/**
 * Single source of truth for motion values. No hardcoded durations / easings
 * anywhere else in the codebase — always import from here.
 *
 * Usage:
 *   <motion.div transition={{ duration: motionTokens.duration.base, ease: motionTokens.easing.primary }} />
 */

export const motionTokens = {
  duration: {
    fast: 0.25,
    base: 0.6,
    slow: 1.1,
  },
  easing: {
    primary: [0.22, 1, 0.36, 1] as [number, number, number, number],
    expressive: [0.16, 1, 0.3, 1] as [number, number, number, number],
    inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  },
  spring: {
    soft: { stiffness: 120, damping: 20, mass: 1 },
    snappy: { stiffness: 380, damping: 30, mass: 1 },
    magnetic: { stiffness: 220, damping: 18, mass: 0.6 },
  },
  stagger: {
    tight: 0.04,
    base: 0.08,
    wide: 0.14,
  },
} as const;

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};