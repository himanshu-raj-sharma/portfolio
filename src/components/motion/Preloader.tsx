'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SESSION_KEY = 'hrsf:preloader-shown';
const TOTAL_MS = 2200;

/**
 * Preloader — monogram + name reveal with a 0–100 counter, then a glass
 * panel wipe that reveals the rest of the page. Under 2.5s, skippable,
 * shown once per session.
 *
 * SSR safe: starts hidden, mounts on the client.
 *
 * Accessibility:
 *   - `aria-hidden` on the wrapper keeps the loading counter out of the
 *     AT tree (the page is non-interactive while it's up).
 *   - Skippable via click or Escape; the page is locked behind
 *     `body { overflow: hidden }` until the wipe finishes.
 */
export function Preloader() {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  const finish = useCallback(() => {
    if (typeof window !== 'undefined') window.sessionStorage.setItem(SESSION_KEY, '1');
    setCount(100);
    setDone(true);
  }, []);

  // Mount + run counter
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem(SESSION_KEY) === '1') return;
    setVisible(true);
    document.body.style.overflow = 'hidden';

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / TOTAL_MS);
      setCount(Math.floor(t * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.sessionStorage.setItem(SESSION_KEY, '1');
        setDone(true);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
  }, []);

  // Auto-dismiss after wipe completes.
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setVisible(false), 700);
    return () => clearTimeout(t);
  }, [done]);

  // Keyboard skip
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, finish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={finish}
          className="fixed inset-0 z-[100] cursor-pointer"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[var(--bg-base)]" />
          <div className="film-grain" />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-6"
            >
              <div className="glass relative flex h-24 w-24 items-center justify-center rounded-full text-2xl font-semibold tracking-tighter text-text-primary">
                <span className="display text-3xl">HRS</span>
                <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_oklch,var(--accent-2)_30%,transparent),transparent_60%)] mix-blend-screen" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="mono-caption">Loading the studio</span>
                <span className="display text-xl">{count.toString().padStart(3, '0')}</span>
              </div>
              <button
                type="button"
                onClick={finish}
                className="mono-caption text-[10px] text-text-muted hover:text-text-primary"
              >
                Press Esc to skip
              </button>
            </motion.div>
          </div>

          {/* Glass wipe */}
          <motion.div
            aria-hidden
            initial={{ scaleY: 0 }}
            animate={{ scaleY: done ? 1 : 0 }}
            transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
            style={{ transformOrigin: 'top' }}
            className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--accent-1)_20%,var(--bg-base))_0%,var(--bg-base)_60%)] backdrop-blur-2xl"
          />
          <motion.div
            aria-hidden
            initial={{ scaleY: 0 }}
            animate={{ scaleY: done ? 1 : 0 }}
            transition={{ duration: 0.85, ease: [0.83, 0, 0.17, 1], delay: 0.08 }}
            style={{ transformOrigin: 'top' }}
            className="absolute inset-0 bg-[var(--bg-base)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}