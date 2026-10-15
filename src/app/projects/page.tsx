import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section, SectionHeading } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { projects } from '@content/projects';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Selected Work',
  description:
    'Case studies of full-stack, AI/ML, and embedded projects by Himanshu Raj Sharma.',
  alternates: { canonical: '/projects' },
};

export default function ProjectsIndexPage() {
  return (
    <Section>
      <Container size="lg">
        <SectionHeading
          number="03"
          caption="All work"
          title={
            <>
              Everything
              <br />
              <span className="bg-[linear-gradient(120deg,var(--accent-2),var(--accent-1))] bg-clip-text text-transparent">
                I&apos;ve shipped.
              </span>
            </>
          }
          description="Detailed write-ups of the projects behind the home-page list."
        />

        <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <li key={p.slug}>
              <GlassCard variant="interactive" spotlight className="h-full p-7">
                <div className="flex items-center justify-between">
                  <Badge tone="accent" className="border-0 uppercase">
                    {p.category.replace('-', ' / ')}
                  </Badge>
                  <span className="mono-caption">{p.year}</span>
                </div>
                <h2 className="display mt-6 text-2xl text-text-primary">{p.title}</h2>
                <p className="mt-2 text-sm text-text-secondary">{p.subtitle}</p>
                <p className="mt-5 text-[15px] leading-relaxed text-text-secondary">{p.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.stack.map((tech) => (
                    <li
                      key={tech}
                      className="mono-caption rounded-full border border-line bg-[color-mix(in_oklch,var(--glass-bg)_120%,transparent)] px-2.5 py-1 text-[10px]"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/projects/${p.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-text-primary underline-offset-4 hover:underline"
                >
                  Read case study <ArrowUpRight size={14} />
                </Link>
              </GlassCard>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}