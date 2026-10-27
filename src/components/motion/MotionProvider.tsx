'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

/**
 * MotionProvider — global motion preferences for Framer Motion.
 *
 * The `prefers-reduced-motion` CSS block in globals.css can neutralise CSS
 * transitions and `[data-reveal]` reveals, but it cannot touch animations
 * driven from JavaScript. Framer Motion animates inline styles, so those
 * keep running even when the user asked for reduced motion.
 *
 * `MotionConfig reducedMotion="user"` makes Framer honour the OS-level
 * preference on its own: transform/layout animations are skipped and
 * opacity-only animations still play.
 *
 * The match is read in an effect (not during render) so the server and the
 * first client render agree, avoiding a hydration mismatch. Until the effect
 * resolves we keep the default motion behaviour.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>{children}</MotionConfig>;
}
