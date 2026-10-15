import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimit } from '@/lib/ratelimit';

// Force the in-memory fallback by leaving env vars unset in tests.
describe('rateLimit (in-memory fallback)', () => {
  beforeEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it('allows the first N requests in a window', async () => {
    const key = `t-${Math.random()}`;
    const first = await rateLimit(key);
    expect(first.success).toBe(true);
  });

  it('blocks requests after the limit', async () => {
    const key = `t-${Math.random()}`;
    for (let i = 0; i < 5; i++) await rateLimit(key);
    const sixth = await rateLimit(key);
    expect(sixth.success).toBe(false);
  });
});