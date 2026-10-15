import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { projects } from '@content/projects';
import { siteConfig } from '@content/site';
import { env } from '@/lib/env';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return { title: 'Project not found' };
  return {
    title: `${p.title} · Case study`,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: {
      type: 'article',
      title: `${p.title} · ${siteConfig.name}`,
      description: p.summary,
      url: `/projects/${p.slug}`,
    },
  };
}

export default async function ProjectCaseStudy({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();

  const url = `${env.NEXT_PUBLIC_SITE_URL}/projects/${p.slug}`;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: env.NEXT_PUBLIC_SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: `${env.NEXT_PUBLIC_SITE_URL}/projects` },
      { '@type': 'ListItem', position: 3, name: p.title, item: url },
    ],
  };

  return (
    <Section>
      <Container size="md">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={14} /> Back to projects
        </Link>

        <header>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="accent" className="border-0 uppercase">
              {p.category.replace('-', ' / ')}
            </Badge>
            <span className="mono-caption">{p.year}</span>
            <span className="mono-caption">· {p.role}</span>
          </div>
          <h1 className="display mt-5 text-section-title text-text-primary">{p.title}</h1>
          <p className="mt-3 text-base text-text-secondary md:text-lg">{p.subtitle}</p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <GlassCard className="p-6 md:col-span-2" spotlight>
            <p className="mono-caption">Summary</p>
            <p className="mt-3 text-base leading-relaxed text-text-secondary">{p.summary}</p>
          </GlassCard>
          <GlassCard className="p-6" spotlight>
            <p className="mono-caption">Stack</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-line bg-[color-mix(in_oklch,var(--glass-bg)_120%,transparent)] px-3 py-1 text-xs text-text-secondary"
                >
                  {s}
                </li>
              ))}
            </ul>
            {p.links.length > 0 && (
              <>
                <p className="mono-caption mt-6">Links</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {p.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-text-primary underline-offset-4 hover:underline"
                      >
                        {l.label} <ArrowUpRight size={12} />
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </GlassCard>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          <GlassCard className="p-7" spotlight>
            <p className="mono-caption">Problem</p>
            <p className="mt-3 text-base leading-relaxed text-text-secondary">{p.problem}</p>
          </GlassCard>
          <GlassCard className="p-7" spotlight>
            <p className="mono-caption">Architecture</p>
            <p className="mt-3 text-base leading-relaxed text-text-secondary">{p.architecture}</p>
          </GlassCard>
          <GlassCard className="p-7 md:col-span-2" spotlight>
            <p className="mono-caption">Challenges</p>
            <ul className="mt-4 space-y-3 text-base leading-relaxed text-text-secondary">
              {p.challenges.map((c) => (
                <li key={c} className="flex gap-3">
                  <span className="mt-2 inline-block h-1 w-3 flex-shrink-0 rounded-full bg-[var(--accent-2)]" />
                  {c}
                </li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard variant="elevated" className="p-7 md:col-span-2" spotlight>
            <p className="mono-caption">Outcome</p>
            <p className="mt-3 text-base leading-relaxed text-text-secondary">{p.outcome}</p>
          </GlassCard>
        </div>

        <div className="mt-12">
          <Link
            href="/#contact"
            className="text-sm text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
          >
            Want something like this? Start a conversation →
          </Link>
        </div>
      </Container>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </Section>
  );
}