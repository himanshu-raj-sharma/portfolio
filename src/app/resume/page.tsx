import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { siteConfig } from '@content/site';
import { skillCategories } from '@/content/skills';
import { experiences } from '@/content/experience';
import { education } from '@/content/education';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Resume of Himanshu Raj Sharma — full-stack developer, Dehradun, India.',
  alternates: { canonical: '/resume' },
};

// Skill categories are listed on the home page; this page focuses on
// experience + education. Importing here keeps the file self-contained.
void skillCategories;

export default function ResumePage() {
  return (
    <Section>
      <Container size="md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={14} /> Back home
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="display text-section-title text-text-primary">{siteConfig.name}</h1>
            <p className="mt-2 text-base text-text-secondary">
              {siteConfig.role} · {siteConfig.location}
            </p>
          </div>
          <a
            href={siteConfig.resumeUrl}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
          >
            <Download size={14} /> Download PDF
          </a>
        </div>

        <GlassCard className="mt-10 p-7" spotlight>
          <p className="mono-caption">Profile</p>
          <p className="mt-3 text-base leading-relaxed text-text-secondary">{siteConfig.tagline}</p>
        </GlassCard>

        <GlassCard className="mt-5 p-7" spotlight>
          <p className="mono-caption">Experience</p>
          <ul className="mt-4 space-y-5">
            {experiences.map((exp) => (
              <li key={exp.role + exp.org}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="display text-lg text-text-primary">
                    {exp.role} · {exp.org}
                  </h3>
                  <span className="mono-caption">
                    {exp.start} – {exp.end}
                  </span>
                </div>
                <p className="mt-1 text-sm text-text-muted">{exp.location}</p>
                <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                  {exp.bullets.map((b) => (
                    <li key={b}>— {b}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="mt-5 p-7" spotlight>
          <p className="mono-caption">Education</p>
          <ul className="mt-4 space-y-5">
            {education.map((ed) => (
              <li key={ed.degree}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="display text-lg text-text-primary">
                    {ed.degree}
                    {ed.specialization ? ` · ${ed.specialization}` : ''}
                  </h3>
                  <span className="mono-caption">
                    {ed.start} – {ed.end}
                  </span>
                </div>
                <p className="mt-1 text-sm text-text-secondary">
                  {ed.school} · {ed.location}
                </p>
              </li>
            ))}
          </ul>
        </GlassCard>

        <p className="mt-10 text-xs text-text-muted">
          A printable PDF version is available at{' '}
          <Link href={siteConfig.resumeUrl} className="underline-offset-4 hover:underline">
            {siteConfig.resumeUrl}
          </Link>
          .
        </p>

        <p className="mt-4">
          <Badge tone="accent" className="border-0">
            TODO: drop the PDF into /public/resume.pdf
          </Badge>
        </p>
      </Container>
    </Section>
  );
}