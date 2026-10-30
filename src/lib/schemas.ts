import { z } from 'zod';

/**
 * Project types are referenced both in the Services cards (CTA prefill) and
 * in the contact form's select. Keep this enum and the contact schema in sync.
 */
export const projectTypes = [
  'full-stack-web',
  'ecommerce',
  'mobile-app',
  'wordpress',
  'backend-api',
  'cloud-devops',
  'other',
] as const;

export const budgetRanges = [
  'under-5k',
  '5k-15k',
  '15k-50k',
  '50k-plus',
  'discuss',
] as const;

export const timelines = ['asap', '1-3-months', '3-6-months', 'flexible'] as const;

/**
 * Generates a randomized honeypot field name to avoid bot detection.
 * Format: hp_<8 random chars>
 */
export function generateHoneypotFieldName(): string {
  if (typeof window === 'undefined') {
    // Server-side fallback - use a fixed name with timestamp
    return `hp_${Date.now().toString(36).slice(-8)}`;
  }
  // Client-side: generate once per session and store
  let name = sessionStorage.getItem('hp_field_name');
  if (!name) {
    name = `hp_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem('hp_field_name', name);
  }
  return name;
}

/**
 * Honeypot field validator. Bots typically fill any input they find; humans never see
 * this control. We reject the submission when it contains anything other than
 * `undefined` or `''`.
 */
const createHoneypotSchema = (_fieldName: string) =>
  z
    .union([z.string(), z.undefined()])
    .transform((v) => v ?? '')
    .refine((v) => v.length === 0, { message: 'Spam detected.' })
    .optional();

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please share your name (at least 2 characters).')
    .max(80, 'Name looks too long.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  company: z
    .string()
    .trim()
    .max(120, 'Company name is too long.')
    .optional()
    .or(z.literal('')),
  projectType: z.enum(projectTypes, {
    errorMap: () => ({ message: 'Pick the option that best matches your project.' }),
  }),
  budget: z.enum(budgetRanges, {
    errorMap: () => ({ message: 'Pick a budget range.' }),
  }),
  timeline: z.enum(timelines, {
    errorMap: () => ({ message: 'When do you need this?' }),
  }),
  message: z
    .string()
    .trim()
    .min(20, 'A little more detail helps — at least 20 characters.')
    .max(4000, 'Please keep it under 4000 characters.'),
  // Honeypot field name is dynamic; we'll validate it separately in the API route
  hp_field_name: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Extended contact input that includes the dynamic honeypot field.
 * Used by the client-side form with a specific honeypot field name.
 */
export type ContactInputWithHoneypot<H extends string = string> = ContactInput & {
  [K in H]: string | undefined;
};

/**
 * Creates a contact schema with a dynamic honeypot field.
 * The returned schema includes the honeypot field in its type.
 */
export function createContactSchemaWithHoneypot<H extends string>(honeypotFieldName: H) {
  return contactSchema.extend({
    [honeypotFieldName]: createHoneypotSchema(honeypotFieldName),
  }) as unknown as z.ZodObject<
    z.ZodRawShape & Record<H, z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodUndefined]>, string, string>>>
  >;
}

export const projectTypeLabels: Record<(typeof projectTypes)[number], string> = {
  'full-stack-web': 'Full-stack web app',
  ecommerce: 'E-commerce site',
  'mobile-app': 'Mobile / cross-platform app',
  wordpress: 'WordPress / Elementor site',
  'backend-api': 'Backend API or database design',
  'cloud-devops': 'Cloud deployment / DevOps',
  other: 'Something else',
};

export const budgetLabels: Record<(typeof budgetRanges)[number], string> = {
  'under-5k': 'Under ₹5,000 / $1k',
  '5k-15k': '₹5k–₹15k / $1k–$3k',
  '15k-50k': '₹15k–₹50k / $3k–$10k',
  '50k-plus': '₹50k+ / $10k+',
  discuss: "Let's discuss",
};

export const timelineLabels: Record<(typeof timelines)[number], string> = {
  asap: 'ASAP',
  '1-3-months': '1–3 months',
  '3-6-months': '3–6 months',
  flexible: 'Flexible',
};