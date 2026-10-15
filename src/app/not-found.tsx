import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassLinkButton } from '@/components/ui/GlassButton';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <Section>
      <Container size="sm">
        <GlassCard variant="elevated" spotlight className="p-10 text-center md:p-16">
          <p className="mono-caption">404</p>
          <h1 className="display mt-4 text-section-title text-text-primary">
            Wrong door.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-text-secondary">
            The page you were looking for moved or never existed. Head back to the home page —
            or pick a section below.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <GlassLinkButton as="a" href="/" variant="primary" size="md">
              <ArrowLeft size={14} /> Home
            </GlassLinkButton>
            <GlassLinkButton as="a" href="/projects" variant="secondary" size="md">
              Projects
            </GlassLinkButton>
            <GlassLinkButton as="a" href="/#contact" variant="ghost" size="md">
              Contact
            </GlassLinkButton>
          </div>
        </GlassCard>
      </Container>
    </Section>
  );
}