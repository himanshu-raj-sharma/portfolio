import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  tone?: 'default' | 'accent';
};

export function Badge({ className, children, tone = 'default', ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-line bg-[color-mix(in_oklch,var(--glass-bg)_120%,transparent)] px-3 py-1 text-xs font-medium tracking-tight',
        tone === 'accent' &&
          'border-[color-mix(in_oklch,var(--accent-1)_50%,transparent)] text-[color-mix(in_oklch,var(--accent-2)_85%,var(--text-primary))]',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}