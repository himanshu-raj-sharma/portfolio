'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, AlertCircle, Github, Linkedin, Mail } from 'lucide-react';
import {
  contactSchema,
  projectTypeLabels,
  budgetLabels,
  timelineLabels,
  type ContactInput,
} from '@/lib/schemas';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton, GlassLinkButton } from '@/components/ui/GlassButton';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { siteConfig } from '@content/site';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      projectType: 'full-stack-web',
      budget: 'discuss',
      timeline: 'flexible',
      message: '',
      website: '',
    },
    mode: 'onBlur',
  });

  // Pre-fill from query string (used by service CTAs like #contact?type=ecommerce)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type) {
      setValue('projectType', type as ContactInput['projectType']);
    }
  }, [setValue]);

  const onSubmit = async (data: ContactInput) => {
    setStatus('submitting');
    setErrorMessage(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'Something went wrong.');
      }
      setStatus('success');
      reset();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Unexpected error');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <GlassCard variant="elevated" spotlight className="p-7 md:p-10">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent-1),var(--accent-2))]"
                >
                  <Check size={26} className="text-text-inverse" strokeWidth={2.4} />
                </motion.span>
                <h3 className="display mt-5 text-2xl text-text-primary">Got it — thank you.</h3>
                <p className="mt-3 max-w-md text-text-secondary">
                  I read every message myself and reply within 24 hours. If it&apos;s urgent,
                  ping me on LinkedIn.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-7 text-sm text-text-muted underline-offset-4 hover:underline"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={(e: FormEvent<HTMLFormElement>) => void handleSubmit(onSubmit)(e)}
                noValidate
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
              >
                <Field
                  id="name"
                  label="Your name"
                  error={errors.name?.message}
                  full
                >
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    {...register('name')}
                    className={inputClass(!!errors.name)}
                  />
                </Field>
                <Field
                  id="email"
                  label="Email"
                  error={errors.email?.message}
                  full
                >
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    {...register('email')}
                    className={inputClass(!!errors.email)}
                  />
                </Field>
                <Field
                  id="company"
                  label="Company (optional)"
                  error={errors.company?.message}
                >
                  <input
                    id="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Acme Inc."
                    {...register('company')}
                    className={inputClass(!!errors.company)}
                  />
                </Field>

                <Field id="projectType" label="Project type" error={errors.projectType?.message}>
                  <select
                    id="projectType"
                    {...register('projectType')}
                    className={inputClass(!!errors.projectType)}
                  >
                    {(Object.keys(projectTypeLabels) as (keyof typeof projectTypeLabels)[]).map(
                      (k) => (
                        <option key={k} value={k}>
                          {projectTypeLabels[k]}
                        </option>
                      ),
                    )}
                  </select>
                </Field>

                <Field id="budget" label="Budget" error={errors.budget?.message}>
                  <select
                    id="budget"
                    {...register('budget')}
                    className={inputClass(!!errors.budget)}
                  >
                    {(Object.keys(budgetLabels) as (keyof typeof budgetLabels)[]).map((k) => (
                      <option key={k} value={k}>
                        {budgetLabels[k]}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="timeline" label="Timeline" error={errors.timeline?.message}>
                  <select
                    id="timeline"
                    {...register('timeline')}
                    className={inputClass(!!errors.timeline)}
                  >
                    {(Object.keys(timelineLabels) as (keyof typeof timelineLabels)[]).map((k) => (
                      <option key={k} value={k}>
                        {timelineLabels[k]}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  id="message"
                  label="Tell me about the project"
                  error={errors.message?.message}
                  full
                >
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="What are you building? Any constraints, deadlines, or links to share?"
                    {...register('message')}
                    className={cn(inputClass(!!errors.message), 'min-h-[140px] resize-y')}
                  />
                  <p className="mt-1 flex justify-between text-[11px] text-text-muted">
                    <span>{watch('message')?.length ?? 0} / 4000</span>
                    <span>Markdown not rendered — keep it plain.</span>
                  </p>
                </Field>

                {/* Honeypot — hidden from humans, bots fill it */}
                <div className="visually-hidden" aria-hidden>
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register('website')}
                  />
                </div>

                <div className="md:col-span-2 flex flex-col items-start gap-4 pt-2 md:flex-row md:items-center md:justify-between">
                  <p className="text-xs text-text-muted">
                    By submitting you agree to be contacted about your inquiry. No newsletters, ever.
                  </p>
                  <MagneticButton label="Send">
                    <GlassButton
                      type="submit"
                      size="lg"
                      variant="primary"
                      disabled={status === 'submitting'}
                      className="w-full md:w-auto"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Sending…
                        </>
                      ) : (
                        <>Send inquiry</>
                      )}
                    </GlassButton>
                  </MagneticButton>
                </div>

                {status === 'error' && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="md:col-span-2 mt-2 flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
                  >
                    <AlertCircle size={16} className="mt-0.5" />
                    <span>{errorMessage ?? 'Could not send. Please try again.'}</span>
                  </div>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>

      <aside className="lg:col-span-5">
        <GlassCard variant="elevated" spotlight className="p-7">
          <p className="mono-caption">Direct lines</p>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="glass inline-flex h-9 w-9 items-center justify-center rounded-full">
                <Mail size={14} />
              </span>
              <div>
                <p className="text-text-muted">Email</p>
                <p className="text-text-primary">via the form — fastest response.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="glass inline-flex h-9 w-9 items-center justify-center rounded-full">
                <Github size={14} />
              </span>
              <div>
                <p className="text-text-muted">GitHub</p>
                <a
                  href={siteConfig.social.github}
                  className="text-text-primary underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {siteConfig.social.github.replace('https://', '')}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="glass inline-flex h-9 w-9 items-center justify-center rounded-full">
                <Linkedin size={14} />
              </span>
              <div>
                <p className="text-text-muted">LinkedIn</p>
                <a
                  href={siteConfig.social.linkedin}
                  className="text-text-primary underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {siteConfig.social.linkedin.replace('https://', '')}
                </a>
              </div>
            </li>
          </ul>

          <hr className="my-6 border-line" />

          <p className="mono-caption">Promise</p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Every inquiry gets a personal reply within{' '}
            <span className="text-text-primary">24 hours</span>. If I&apos;m away I&apos;ll tell you when I&apos;ll be back.
          </p>

          <hr className="my-6 border-line" />

          <p className="mono-caption">Schedule</p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Prefer a live conversation? A booking link will live here once Cal.com is connected.
          </p>
          <GlassLinkButton as="a" href="#contact" variant="ghost" size="sm" className="mt-3" aria-disabled="true">
            Notify me when booking is live →
          </GlassLinkButton>
        </GlassCard>
      </aside>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full rounded-2xl border bg-[color-mix(in_oklch,var(--glass-bg)_150%,transparent)] px-4 py-3 text-base text-text-primary outline-none transition-colors placeholder:text-text-muted',
    hasError
      ? 'border-red-500/50 focus:border-red-400'
      : 'border-line focus:border-[color-mix(in_oklch,var(--accent-1)_70%,transparent)]',
  );
}

function Field({
  id,
  label,
  children,
  error,
  full = false,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  error?: string;
  full?: boolean;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', full && 'md:col-span-2')}>
      <label htmlFor={id} className="mono-caption">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="flex items-center gap-1 text-xs text-red-300">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}