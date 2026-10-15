import { describe, it, expect } from 'vitest';
import { contactSchema } from '@/lib/schemas';

describe('contactSchema', () => {
  const baseInput = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    company: '',
    projectType: 'full-stack-web',
    budget: 'discuss',
    timeline: 'flexible',
    message: 'A short message describing the project in enough detail to pass validation.',
    website: '',
  };

  it('accepts a well-formed payload', () => {
    const result = contactSchema.safeParse(baseInput);
    expect(result.success).toBe(true);
  });

  it('rejects an empty name', () => {
    const result = contactSchema.safeParse({ ...baseInput, name: 'A' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = contactSchema.safeParse({ ...baseInput, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects too-short messages', () => {
    const result = contactSchema.safeParse({ ...baseInput, message: 'too short' });
    expect(result.success).toBe(false);
  });

  it('flags the honeypot when filled', () => {
    const result = contactSchema.safeParse({ ...baseInput, website: 'http://spam.example' });
    expect(result.success).toBe(false);
  });

  it('accepts the honeypot when missing', () => {
    const result = contactSchema.safeParse({ ...baseInput, website: undefined });
    expect(result.success).toBe(true);
  });

  it('accepts the honeypot when empty string', () => {
    const result = contactSchema.safeParse({ ...baseInput, website: '' });
    expect(result.success).toBe(true);
  });

  it('rejects unknown enum values', () => {
    const result = contactSchema.safeParse({ ...baseInput, projectType: 'something' });
    expect(result.success).toBe(false);
  });
});