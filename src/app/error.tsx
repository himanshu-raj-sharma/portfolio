'use client';

import { useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassLinkButton, GlassButton } from '@/components/ui/GlassButton';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app] Runtime error', error);
  }, [error]);

  return (
    <Section>
      <Container size="sm">
        <GlassCard variant="elevated" spotlight className="p-10 text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 text-red-300">
            <AlertCircle size={20} />
          </span>
          <h1 className="display mt-4 text-section-title text-text-primary">
            Something went sideways.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-text-secondary">
            I&apos;ve logged the error. You can retry, or head back home.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <GlassButton variant="primary" onClick={reset}>
              Try again
            </GlassButton>
            <GlassLinkButton as="a" href="/" variant="secondary">
              Home
            </GlassLinkButton>
          </div>
        </GlassCard>
      </Container>
    </Section>
  );
}