import { describe, it, expect } from 'vitest';
import { cn, clamp, formatRange } from '@/lib/utils';

describe('utils', () => {
  it('cn merges and deduplicates classes', () => {
    expect(cn('a', 'a', 'b')).toContain('a');
    expect(cn('a', 'a', 'b')).toContain('b');
    expect(cn('px-2', 'px-4')).toBe('px-4'); // tailwind-merge wins later
  });

  it('clamp respects min/max bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(50, 0, 10)).toBe(10);
  });

  it('formats ranges', () => {
    expect(formatRange('Jan 2024', 'Present')).toBe('Jan 2024 – Present');
  });
});