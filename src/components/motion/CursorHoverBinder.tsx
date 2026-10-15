'use client';

import { useEffect } from 'react';
import { useCursor } from './CursorProvider';

/**
 * Mounts a single document-level listener that watches for elements with
 * a `data-cursor` attribute and updates the cursor context whenever the
 * pointer enters/leaves them. Avoids each interactive element having to
 * wire its own onMouseEnter/Leave.
 *
 * Place once near the root of the tree (after CursorProvider).
 */
export function CursorHoverBinder() {
  const { setHovered } = useCursor();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    if (touch) return;

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      if (!labelled) return;
      setHovered(labelled.dataset.cursor ?? null);
    };
    const onOut = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      if (!labelled) return;
      const related = (e as MouseEvent).relatedTarget as HTMLElement | null;
      if (related && labelled.contains(related)) return;
      setHovered(null);
    };

    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
    };
  }, [setHovered]);

  return null;
}