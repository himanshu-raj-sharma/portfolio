import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind-aware class merger. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a Date as "Mon YYYY" — for education / experience timelines. */
export function formatRange(start: string, end: string | 'Present'): string {
  return `${start} – ${end}`;
}

/** Clamp helper. */
export const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n));

/** Tiny id for form keys. */
export const makeId = (prefix = 'id'): string =>
  `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

/** Sleep helper used in tests and throttled effects. */
export const sleep = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));