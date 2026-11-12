/**
 * Contact-form prefill channel.
 *
 * The service cards and the contact form live on the same page but in
 * different components. Rather than reloading the page with `?type=…` (a
 * full document reload, which loses scroll position and re-runs hydration),
 * the service CTA dispatches this event and the form listens for it.
 */

/** Event name — keep in sync with `ContactForm`'s listener. */
export const CONTACT_PREFILL_EVENT = 'hrsf:contact-prefill';

export type ContactPrefillDetail = { type: string };

/** Ask the contact form to switch its project type. */
export function prefillContactType(type: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<ContactPrefillDetail>(CONTACT_PREFILL_EVENT, { detail: { type } }),
  );
}
