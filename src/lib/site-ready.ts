/**
 * Site-ready signal.
 *
 * The preloader covers the first paint, so anything that animates on mount
 * (the hero) would otherwise run its entrance behind the curtain and be
 * finished before the user sees it. The preloader fires this the moment the
 * curtain starts lifting; the hero waits for it before animating in.
 *
 * The `ready` flag is module-level so a listener that mounts *after* the
 * signal was already sent still gets called.
 */

const READY_EVENT = 'hrsf:site-ready';

let ready = false;

/** Signal that the page is now visible to the user. */
export function markSiteReady(): void {
  if (typeof window === 'undefined') return;
  ready = true;
  window.dispatchEvent(new Event(READY_EVENT));
}

/** True once `markSiteReady` has been called. */
export function isSiteReady(): boolean {
  return ready;
}

/** Run `callback` as soon as the site is ready (immediately if already ready). */
export function onSiteReady(callback: () => void): void {
  if (typeof window === 'undefined') return;
  if (ready) {
    callback();
    return;
  }
  window.addEventListener(READY_EVENT, callback, { once: true });
}
