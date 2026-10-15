import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variantClass: Record<Variant, string> = {
  primary:
    'text-text-inverse bg-[linear-gradient(135deg,var(--accent-1),var(--accent-2))] shadow-glow',
  secondary: 'glass glass-interactive text-text-primary',
  ghost: 'text-text-primary hover:bg-[color-mix(in_oklch,var(--accent-1)_12%,transparent)]',
};

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-14 px-7 text-base',
};

const baseClass =
  'group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-tight transition-transform duration-300 ease-primary will-change-transform hover:-translate-y-0.5 active:translate-y-0 before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.45),transparent)] before:transition-transform before:duration-700 hover:before:translate-x-full';

interface SharedProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: ReactNode;
}

export type GlassButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };

export type GlassLinkButtonProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { as: 'a'; href: string };

/**
 * GlassButton — primary CTA on dark surfaces.
 *
 * For links, use `GlassLinkButton` (auto-detects external URLs and uses
 * `<a target="_blank" rel="noopener noreferrer">` or `<Link>`).
 */
export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  function GlassButton(
    { variant = 'primary', size = 'md', className, children, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn(
          baseClass,
          'disabled:cursor-not-allowed disabled:opacity-50',
          variantClass[variant],
          sizeClass[size],
          className,
        )}
        {...rest}
      >
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </button>
    );
  },
);
GlassButton.displayName = 'GlassButton';

export function GlassLinkButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  target,
  rel,
  ...rest
}: GlassLinkButtonProps) {
  const isExternal = /^https?:\/\//.test(href);
  const className_ = cn(baseClass, variantClass[variant], sizeClass[size], className);
  const inner = (
    <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target={target ?? '_blank'}
        rel={rel ?? 'noopener noreferrer'}
        className={className_}
        {...rest}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} target={target} rel={rel} className={className_} {...rest}>
      {inner}
    </Link>
  );
}