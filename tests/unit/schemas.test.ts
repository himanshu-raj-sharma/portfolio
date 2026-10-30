import { describe, it, expect } from 'vitest';
import { contactSchema, createContactSchemaWithHoneypot } from '@/lib/schemas';

describe('contactSchema', () => {
  const baseInput = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    company: '',
    projectType: 'full-stack-web',
    budget: 'discuss',
    timeline: 'flexible',
    message: 'A short message describing the project in enough detail to pass validation.',
    hp_field_name: 'hp_test123',
  };

  it('accepts a well-formed payload', () => {
    const schema = createContactSchemaWithHoneypot('hp_test123');
    const result = schema.safeParse({ ...baseInput, hp_test123: '' });
    expect(result.success).toBe(true);
  });

  it('rejects an empty name', () => {
    const schema = createContactSchemaWithHoneypot('hp_test123');
    const result = schema.safeParse({ ...baseInput, name: 'A', hp_test123: '' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const schema = createContactSchemaWithHoneypot('hp_test123');
    const result = schema.safeParse({ ...baseInput, email: 'not-an-email', hp_test123: '' });
    expect(result.success).toBe(false);
  });

  it('rejects too-short messages', () => {
    const schema = createContactSchemaWithHoneypot('hp_test123');
    const result = schema.safeParse({ ...baseInput, message: 'too short', hp_test123: '' });
    expect(result.success).toBe(false);
  });

  it('flags the honeypot when filled', () => {
    const schema = createContactSchemaWithHoneypot('hp_test123');
    const result = schema.safeParse({ ...baseInput, hp_test123: 'http://spam.example' });
    expect(result.success).toBe(false);
  });

  it('accepts the honeypot when missing', () => {
    const schema = createContactSchemaWithHoneypot('hp_test123');
    const result = schema.safeParse({ ...baseInput, hp_test123: undefined });
    expect(result.success).toBe(true);
  });

  it('accepts the honeypot when empty string', () => {
    const schema = createContactSchemaWithHoneypot('hp_test123');
    const result = schema.safeParse({ ...baseInput, hp_test123: '' });
    expect(result.success).toBe(true);
  });

  it('rejects unknown enum values', () => {
    const schema = createContactSchemaWithHoneypot('hp_test123');
    const result = schema.safeParse({ ...baseInput, projectType: 'something', hp_test123: '' });
    expect(result.success).toBe(false);
  });

  it('contactSchema base accepts hp_field_name', () => {
    const result = contactSchema.safeParse(baseInput);
    expect(result.success).toBe(true);
  });
});