'use client';

import { useEffect, useRef, type ReactNode, type HTMLAttributes } from 'react';

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  /** Delay (ms) before triggering the reveal once in viewport. */
  delay?: number;
  /** Trigger only once. Default true. */
  once?: boolean;
};

/**
 * IntersectionObserver-based reveal. Uses the global `[data-reveal]` CSS
 * hook (see globals.css) so reduced-motion users get an instant render.
 *
 * Avoid putting reveal inside a GSAP timeline that also animates the same
 * node — pick one.
 */
export function Reveal({ children, delay = 0, once = true, className, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.setAttribute('data-reveal', 'in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            window.setTimeout(() => target.setAttribute('data-reveal', 'in'), delay);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            (entry.target as HTMLElement).setAttribute('data-reveal', '');
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, once]);

  return (
    <div ref={ref} data-reveal="" className={className} {...rest}>
      {children}
    </div>
  );
}