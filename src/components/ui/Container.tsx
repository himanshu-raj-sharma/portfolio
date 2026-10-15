import type { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
};

/**
 * Page-width container with editorial gutters.
 *  sm  — 720px (long-form copy)
 *  md  — 1080px (default, sections)
 *  lg  — 1320px (hero / wide sections)
 *  full — fluid 1600px with auto gutters
 */
export function Container({ className, size = 'lg', children, ...rest }: ContainerProps) {
  const widthClass = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-[1320px]',
    full: 'max-w-[1600px]',
  }[size];

  return (
    <div className={cn('mx-auto w-full px-6 md:px-10', widthClass, className)} {...rest}>
      {children}
    </div>
  );
}