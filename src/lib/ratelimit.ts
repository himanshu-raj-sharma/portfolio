/**
 * Rate limiter abstraction.
 * - Uses Upstash Ratelimit when env vars are configured.
 * - Falls back to an in-memory token bucket per IP for local/dev runs.
 *
 * The in-memory bucket is GC'd at most once per minute to avoid unbounded
 * growth on long-running single-instance deployments.
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { isRateLimitConfigured } from './env';

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
};

type Bucket = { tokens: number; updatedAt: number };

const FALLBACK_LIMIT = 5;
const FALLBACK_WINDOW_MS = 60 * 1000;
const FALLBACK_REFILL = FALLBACK_LIMIT / FALLBACK_WINDOW_MS;
const GC_INTERVAL_MS = 5 * 60 * 1000;

const buckets = new Map<string, Bucket>();
let lastGcAt = Date.now();

function maybeGc() {
  const now = Date.now();
  if (now - lastGcAt < GC_INTERVAL_MS) return;
  lastGcAt = now;
  const cutoff = now - FALLBACK_WINDOW_MS;
  for (const [k, v] of buckets) {
    if (v.updatedAt < cutoff && v.tokens >= FALLBACK_LIMIT) {
      buckets.delete(k);
    }
  }
}

function inMemoryLimit(key: string): RateLimitResult {
  maybeGc();
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: FALLBACK_LIMIT, updatedAt: now };
  const elapsed = now - bucket.updatedAt;
  bucket.tokens = Math.min(FALLBACK_LIMIT, bucket.tokens + elapsed * FALLBACK_REFILL);
  bucket.updatedAt = now;

  const success = bucket.tokens >= 1;
  if (success) bucket.tokens -= 1;
  buckets.set(key, bucket);

  return {
    success,
    remaining: Math.max(0, Math.floor(bucket.tokens)),
    reset: now + FALLBACK_WINDOW_MS,
    limit: FALLBACK_LIMIT,
  };
}

let cachedLimiter: Ratelimit | null = null;
function upstashLimiter(): Ratelimit | null {
  if (!isRateLimitConfigured) return null;
  if (cachedLimiter) return cachedLimiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const redis = new Redis({ url, token });
  cachedLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: false,
    prefix: 'hrsf:contact',
  });
  return cachedLimiter;
}

export async function rateLimit(key: string): Promise<RateLimitResult> {
  const limiter = upstashLimiter();
  if (!limiter) return inMemoryLimit(key);
  const { success, remaining, reset, limit } = await limiter.limit(key);
  return { success, remaining, reset, limit };
}

/** Test-only — resets the in-memory bucket map. */
export function __resetForTesting(): void {
  buckets.clear();
  lastGcAt = Date.now();
}