import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type SectionProps = HTMLAttributes<HTMLElement> & {
  id?: string;
  children?: ReactNode;
  /** Pulls the section up so it sits flush against the previous one. */
  flush?: boolean;
  /**
   * Vertical density. `default` suits standard sections, `tight` for dense
   * list-heavy ones (projects, toolbox), `loose` for breathing room around
   * a short, high-impact section (contact, FAQ).
   */
  density?: 'tight' | 'default' | 'loose';
};

const densityClass = {
  tight: 'py-section-y-sm',
  default: 'py-section-y',
  loose: 'py-section-y-lg',
} as const;

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { id, className, flush = false, density = 'default', children, ...rest },
  ref,
) {
  return (
    <section
      ref={ref}
      id={id}
      className={cn('relative', densityClass[density], !flush && 'scroll-mt-24', className)}
      {...rest}
    >
      {children}
    </section>
  );
});

type SectionHeadingProps = {
  number: string;
  caption: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

/**
 * SectionHeading — oversized mono section number on the left, expressive
 * display title on the right. Used at the top of every section.
 */
export function SectionHeading({
  number,
  caption,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-8 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center md:text-center',
        className,
      )}
    >
      <div className="flex items-start gap-5">
        <span className="mono-caption mt-2 inline-flex h-8 min-w-[2.5rem] items-center justify-center rounded-full border border-line px-3 text-[11px]">
          {number}
        </span>
        <div className="flex flex-col">
          <span className="mono-caption">{caption}</span>
          <h2 className="display text-section-title text-text-primary">{title}</h2>
        </div>
      </div>
      {description && (
        <p className="lead max-w-md md:text-right">{description}</p>
      )}
    </div>
  );
}