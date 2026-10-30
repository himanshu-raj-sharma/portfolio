import { NextResponse, type NextRequest } from 'next/server';
import { createContactSchemaWithHoneypot, type ContactInput } from '@/lib/schemas';
import { rateLimit } from '@/lib/ratelimit';
import { sendContactEmails } from '@/lib/email';

export const runtime = 'nodejs';
// Always run dynamically — never cache.
export const dynamic = 'force-dynamic';

/**
 * POST /api/contact
 * - rate limit per IP
 * - strict zod validation (with honeypot stripped)
 * - honeypot check → silent 200 on fail (no leak)
 * - Resend → owner + sender
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = await rateLimit(`contact:${ip}`);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests — please try again in a minute.' },
      { status: 429, headers: rateLimitHeaders(rl) },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  // Extract the dynamic honeypot field name from the submission
  const hpFieldName = (raw as Record<string, unknown> | null)?.hp_field_name;
  if (typeof hpFieldName !== 'string' || !hpFieldName.startsWith('hp_')) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot check first (silent 200).
  const honeypotValue = (raw as Record<string, unknown>)[hpFieldName];
  if (typeof honeypotValue === 'string' && honeypotValue.length > 0) {
    return NextResponse.json({ ok: true, delivered: false }, { headers: rateLimitHeaders(rl) });
  }

  // Create schema with the dynamic honeypot field and validate
  const schemaWithHoneypot = createContactSchemaWithHoneypot(hpFieldName);
  const parsed = schemaWithHoneypot.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  // Strip honeypot fields before sending to email
  const { hp_field_name: _hpFieldName, [hpFieldName]: _honeypot, ...rest } = parsed.data;
  const cleanData = rest as ContactInput;

  const result = await sendContactEmails(cleanData);
  if (!result.delivered) {
    const status = result.reason === 'email-not-configured' ? 202 : 502;
    return NextResponse.json(
      {
        ok: false,
        delivered: false,
        reason: result.reason,
        ...(status === 202
          ? {
              info: 'Email is not configured — your message was validated and logged locally only.',
            }
          : {}),
      },
      { status },
    );
  }

  return NextResponse.json({ ok: true, delivered: true }, { headers: rateLimitHeaders(rl) });
}

/**
 * Extract the best-guess client IP from common proxy headers.
 * Falls back to a constant so unknown clients share one bucket — this
 * matches the behaviour of a single dev box and prevents per-process
 * unbounded key creation.
 */
function clientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get('x-real-ip')?.trim();
  if (real) return real;
  const cf = req.headers.get('cf-connecting-ip')?.trim();
  if (cf) return cf;
  return 'unknown';
}

function rateLimitHeaders(rl: { remaining: number; limit: number; reset: number }) {
  return {
    'X-RateLimit-Limit': String(rl.limit),
    'X-RateLimit-Remaining': String(rl.remaining),
    'X-RateLimit-Reset': String(rl.reset),
  };
}