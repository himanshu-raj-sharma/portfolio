import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind-aware class merger. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a Date as "Mon YYYY" — for education / experience timelines. */
export function formatRange(start: string, end: string | 'Present'): string {
  return `${start} – ${end}`;
}

/** Clamp helper. */
export const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n));

/** Tiny id for form keys. */
export const makeId = (prefix = 'id'): string =>
  `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

/** Sleep helper used in tests and throttled effects. */
export const sleep = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));

/**
 * Scroll to a section by id.
 *
 * Lenis is exposed on `window.__lenis` by the SmoothScroll component; when it
 * is running we ask Lenis to scroll (so the easing matches the rest of the
 * page). Without it we fall back to the native smooth scroll.
 */
export function scrollToSection(id: string, offset = -96): void {
  if (typeof document === 'undefined') return;
  const target = document.getElementById(id);
  if (!target) return;

  // Absolute document position of the target, computed from the *real* scroll
  // offset. Passing the element to Lenis is unreliable: it derives the
  // destination from its own internal scroll value, which is stale whenever
  // the page was scrolled natively (anchor jump, autofill, automation) — the
  // jump then lands in the wrong place.
  const top = target.getBoundingClientRect().top + window.scrollY + offset;

  const lenis = (
    window as unknown as {
      __lenis?: {
        scrollTo: (target: number, options?: { force?: boolean }) => void;
      };
    }
  ).__lenis;
  if (lenis) {
    // `force` cancels a scroll that is already running so the jump always
    // ends at the requested section instead of being overridden mid-flight.
    lenis.scrollTo(top, { force: true });
    return;
  }
  window.scrollTo({ top, behavior: 'smooth' });
}