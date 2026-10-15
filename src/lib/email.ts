/**
 * Email helper using Resend. Falls back to a console-log "dev mode" when env
 * vars are not set so the API route stays usable in local development.
 */
import { Resend } from 'resend';
import { env, isEmailConfigured } from './env';
import type { ContactInput } from './schemas';
import { projectTypeLabels, budgetLabels, timelineLabels } from './schemas';

type SendArgs = {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

let cachedClient: Resend | null = null;
function getClient(): Resend | null {
  if (!isEmailConfigured) return null;
  if (cachedClient) return cachedClient;
  cachedClient = new Resend(env.RESEND_API_KEY as string);
  return cachedClient;
}

async function sendViaResend(args: SendArgs) {
  const client = getClient();
  if (!client) throw new Error('Email client not configured');
  return client.emails.send({
    from: args.from,
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
    replyTo: args.replyTo,
  });
}

function renderOwnerEmail(input: ContactInput): string {
  const safeMessage = escape(input.message).replace(/\n/g, '<br />');
  return `
    <div style="font-family:Inter,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;color:#0b0b0f">
      <h2 style="margin:0 0 16px">New portfolio inquiry</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px;color:#666">Name</td><td style="padding:6px 12px">${escape(input.name)}</td></tr>
        <tr><td style="padding:6px 12px;color:#666">Email</td><td style="padding:6px 12px">${escape(input.email)}</td></tr>
        ${input.company ? `<tr><td style="padding:6px 12px;color:#666">Company</td><td style="padding:6px 12px">${escape(input.company)}</td></tr>` : ''}
        <tr><td style="padding:6px 12px;color:#666">Project</td><td style="padding:6px 12px">${escape(projectTypeLabels[input.projectType])}</td></tr>
        <tr><td style="padding:6px 12px;color:#666">Budget</td><td style="padding:6px 12px">${escape(budgetLabels[input.budget])}</td></tr>
        <tr><td style="padding:6px 12px;color:#666">Timeline</td><td style="padding:6px 12px">${escape(timelineLabels[input.timeline])}</td></tr>
      </table>
      <h3 style="margin:24px 0 8px">Message</h3>
      <p style="white-space:pre-wrap;line-height:1.55">${safeMessage}</p>
    </div>
  `;
}

function renderConfirmationEmail(input: ContactInput): string {
  const firstName = escape(input.name.split(' ')[0] ?? input.name);
  return `
    <div style="font-family:Inter,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;line-height:1.6;color:#0b0b0f">
      <h2 style="margin:0 0 12px">Hi ${firstName},</h2>
      <p>Thanks for reaching out about <strong>${escape(projectTypeLabels[input.projectType])}</strong>. I read every message myself and typically reply within 24 hours.</p>
      <p>For your records, here's what you sent:</p>
      <blockquote style="border-left:3px solid #915cff;padding:8px 12px;margin:16px 0;color:#444;white-space:pre-wrap">${escape(input.message)}</blockquote>
      <p>— Himanshu</p>
    </div>
  `;
}

function renderConfirmationText(input: ContactInput): string {
  const firstName = input.name.split(' ')[0] ?? input.name;
  return [
    `Hi ${firstName},`,
    '',
    `Thanks for reaching out about ${projectTypeLabels[input.projectType]}.`,
    `I read every message myself and typically reply within 24 hours.`,
    '',
    'Your message:',
    input.message,
    '',
    '— Himanshu',
  ].join('\n');
}

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function sendContactEmails(input: ContactInput): Promise<{
  delivered: boolean;
  reason?: string;
}> {
  const ownerTo = env.CONTACT_TO_EMAIL;
  const fromAddr = env.CONTACT_FROM_EMAIL;
  if (!isEmailConfigured || !ownerTo || !fromAddr) {
    if (typeof window === 'undefined') {
      console.info('[contact] Email not configured — validated locally:', {
        to: ownerTo ?? '(unset)',
        from: fromAddr ?? '(unset)',
        input,
      });
    }
    return { delivered: false, reason: 'email-not-configured' };
  }

  try {
    const [owner, confirmation] = await Promise.all([
      sendViaResend({
        from: fromAddr,
        to: ownerTo,
        subject: `New inquiry · ${input.name} · ${projectTypeLabels[input.projectType]}`,
        html: renderOwnerEmail(input),
        replyTo: input.email,
      }),
      sendViaResend({
        from: fromAddr,
        to: input.email,
        subject: "Got it — I'll be in touch soon",
        html: renderConfirmationEmail(input),
        text: renderConfirmationText(input),
      }),
    ]);
    if (owner.error || confirmation.error) {
      const reason =
        owner.error?.message ?? confirmation.error?.message ?? 'Resend returned an error';
      console.error('[contact] Resend reported error:', reason);
      return { delivered: false, reason };
    }
    return { delivered: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[contact] Resend failed:', message);
    return { delivered: false, reason: message };
  }
}