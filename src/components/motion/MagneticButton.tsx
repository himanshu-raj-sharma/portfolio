'use client';

import { useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, type MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type MagneticProps = Omit<MotionProps, 'children'> & {
  children: ReactNode;
  /** How aggressively the wrapper follows the cursor. 0 = none, 1 = sticky. */
  strength?: number;
  /** Cursor pill label when hovering this element. Applied via data-cursor so
   *  CursorHoverBinder can pick it up — no manual mouse events needed here. */
  label?: string;
  className?: string;
};

/**
 * MagneticButton — wraps any element and pulls it toward the cursor within
 * a 120px radius, with a spring return when the cursor leaves. Designed to
 * wrap CTAs (typically a GlassLinkButton) for a tactile feel.
 */
export function MagneticButton({
  children,
  strength = 0.35,
  label = 'Click',
  className,
  ...rest
}: MagneticProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });
  const [active, setActive] = useState(false);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !active) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    x.set(dx);
    y.set(dy);
  };

  const handleLeave = () => {
    setActive(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={cn('inline-block', className)}
      data-cursor={label}
      {...rest}
    >
      {children}
    </motion.div>
  );
}