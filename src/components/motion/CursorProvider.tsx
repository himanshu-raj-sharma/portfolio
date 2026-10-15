'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

type CursorContextValue = {
  position: { x: number; y: number };
  /** Identifier of the element the cursor is over (or null). */
  hovered: string | null;
  setHovered: (label: string | null) => void;
};

const CursorContext = createContext<CursorContextValue | null>(null);

export function useCursor(): CursorContextValue {
  const ctx = useContext(CursorContext);
  if (!ctx) {
    throw new Error('useCursor must be used inside <CursorProvider>');
  }
  return ctx;
}

/**
 * CursorProvider tracks the pointer globally and writes
 * `--cursor-x/y/intensity` on the root element so any element with the
 * `.spotlight` class can render a radial gradient at the cursor position
 * with zero per-element listeners.
 *
 * Also exposes `hovered` for the custom cursor to read (so interactive
 * elements can label the cursor "View", "Open", etc).
 */
export function CursorProvider({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Skip on touch devices entirely.
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const root = document.documentElement;
    let pendingX = 0;
    let pendingY = 0;

    const onMove = (e: PointerEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        root.style.setProperty('--cursor-x', `${pendingX}px`);
        root.style.setProperty('--cursor-y', `${pendingY}px`);
        root.style.setProperty('--cursor-intensity', '1');
        setPosition({ x: pendingX, y: pendingY });
      });
    };
    const onLeave = () => root.style.setProperty('--cursor-intensity', '0');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const value = useMemo<CursorContextValue>(
    () => ({ position, hovered, setHovered }),
    [position, hovered],
  );

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}