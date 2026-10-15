'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCursor } from './CursorProvider';

/**
 * Custom cursor — small dot + larger trailing ring. The ring morphs into a
 * pill labelled with the hovered element's `data-cursor` attribute when the
 * cursor is over an interactive element.
 *
 * Touch / coarse-pointer devices skip rendering entirely.
 */
export function CustomCursor() {
  const { position, hovered } = useCursor();
  const [enabled, setEnabled] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(useMotionValue(-100), { stiffness: 250, damping: 28, mass: 0.5 });
  const ringY = useSpring(useMotionValue(-100), { stiffness: 250, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(!touch && !reduce);
  }, []);

  useEffect(() => {
    dotX.set(position.x - 4);
    dotY.set(position.y - 4);
    ringX.set(position.x - 18);
    ringY.set(position.y - 18);
  }, [position, dotX, dotY, ringX, ringY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] h-2 w-2 rounded-full bg-[var(--accent-2)] mix-blend-screen"
        style={{ x: dotX, y: dotY }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] flex h-9 items-center justify-center rounded-full border border-[color-mix(in_oklch,var(--accent-1)_55%,transparent)] bg-[color-mix(in_oklch,var(--accent-1)_10%,transparent)] text-[11px] uppercase tracking-[0.18em] text-text-primary backdrop-blur-md"
        style={{
          x: ringX,
          y: ringY,
          paddingInline: hovered ? '14px' : '0',
          width: hovered ? 'auto' : '36px',
        }}
        animate={{
          scale: hovered ? 1.05 : 1,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        <span className={hovered ? 'opacity-100' : 'opacity-0'}>{hovered ?? ''}</span>
      </motion.div>
    </>
  );
}