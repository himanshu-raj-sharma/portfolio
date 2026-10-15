/**
 * Env validation via zod. Loaded once at app start.
 *
 * Strategy:
 *  - Server: parse strictly; surface issues with `console.error` and continue
 *    with defaults so a missing optional key never crashes a server render.
 *  - Client: only the public schema runs; secrets are not exposed.
 */
import { z } from 'zod';

const serverSchema = z.object({
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_TO_EMAIL: z.string().email().optional(),
  CONTACT_FROM_EMAIL: z.string().email().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Himanshu Raj Sharma'),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
});

type PublicInput = {
  NEXT_PUBLIC_SITE_URL?: string | undefined;
  NEXT_PUBLIC_SITE_NAME?: string | undefined;
  NEXT_PUBLIC_GA_ID?: string | undefined;
};

type ServerInput = {
  RESEND_API_KEY?: string | undefined;
  CONTACT_TO_EMAIL?: string | undefined;
  CONTACT_FROM_EMAIL?: string | undefined;
  UPSTASH_REDIS_REST_URL?: string | undefined;
  UPSTASH_REDIS_REST_TOKEN?: string | undefined;
  NODE_ENV?: string | undefined;
};

function parseOr<T extends z.ZodTypeAny>(schema: T, fallback: z.input<T>): z.output<T> {
  const result = schema.safeParse(fallback);
  if (!result.success) {
    if (typeof window === 'undefined') {
      console.error('[env] Invalid configuration:', result.error.flatten().fieldErrors);
    }
    // Coerce back to output type by re-running with the schema's defaults.
    return schema.parse({} as z.input<T>);
  }
  return result.data as z.output<T>;
}

const publicEnv = parseOr(publicSchema, {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
} satisfies PublicInput);

const serverEnv: z.output<typeof serverSchema> =
  typeof window === 'undefined'
    ? parseOr(serverSchema, {
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
        CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
        NODE_ENV: process.env.NODE_ENV,
      } satisfies ServerInput)
    : ({} as z.output<typeof serverSchema>);

export const env = { ...publicEnv, ...serverEnv };

export const isEmailConfigured =
  Boolean(env.RESEND_API_KEY) && Boolean(env.CONTACT_TO_EMAIL) && Boolean(env.CONTACT_FROM_EMAIL);

export const isRateLimitConfigured = Boolean(
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN,
);