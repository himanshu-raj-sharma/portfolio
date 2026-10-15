import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type GlassVariant = 'default' | 'elevated' | 'interactive';
type GlassTag = 'div' | 'article' | 'section' | 'li';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  spotlight?: boolean;
  as?: GlassTag;
  children?: ReactNode;
}

/**
 * The signature layered-glass surface. Defaults to `div`. Variants:
 *   default       — everyday card
 *   elevated      — stronger shadow + slightly more opaque
 *   interactive   — adds hover transitions
 *
 * `spotlight` enables the cursor-following radial highlight. The page-level
 * CursorProvider drives `--cursor-x/y/intensity` so no per-card listeners
 * are needed — keeping cost flat regardless of card count.
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(function GlassCard(
  { className, variant = 'default', spotlight = false, as: Tag = 'div', children, ...rest },
  ref,
) {
  // `li`/`section`/`article` all forward a div-shaped ref safely; cast at the boundary.
  const TagAny = Tag as unknown as 'div';
  return (
    <TagAny
      ref={ref}
      className={cn(
        'glass',
        variant === 'elevated' && 'glass-elevated',
        variant === 'interactive' && 'glass-interactive',
        spotlight && 'spotlight',
        className,
      )}
      {...rest}
    >
      {children}
    </TagAny>
  );
});
GlassCard.displayName = 'GlassCard';