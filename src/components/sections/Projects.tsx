'use client';

import { useMemo, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import { ArrowUpRight, Filter } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section, SectionHeading } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { projects, projectCategories } from '@content/projects';
import type { ProjectCategory } from '@content/projects';
import { motionTokens } from '@/lib/motion-tokens';
import { cn } from '@/lib/utils';

export function Projects() {
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all');
  const filtered = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yDecor = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <Section id="projects" ref={ref} density="tight">
      <Container size="lg">
        <SectionHeading
          number="03"
          caption="Selected work"
          title={
            <>
              A few things
              <br />
              <span className="bg-[linear-gradient(120deg,var(--accent-2),var(--accent-1))] bg-clip-text text-transparent">
                I&apos;ve shipped.
              </span>
            </>
          }
          description="Filter the list — case studies have deeper write-ups."
        />

        <div
          className="mt-stack-y flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter projects by category"
        >
          <span className="mono-caption mr-2">
            <Filter size={11} className="mr-1 inline-block" /> Filter
          </span>
          {projectCategories.map((c) => {
            const isActive = filter === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                aria-pressed={isActive}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs transition-all duration-300',
                  isActive
                    ? 'border-[color-mix(in_oklch,var(--accent-1)_60%,transparent)] bg-[color-mix(in_oklch,var(--accent-1)_14%,transparent)] text-text-primary'
                    : 'border-line text-text-secondary hover:text-text-primary',
                )}
                data-cursor="Filter"
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="popLayout">
          <motion.ul
            key={filter}
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: motionTokens.easing.primary }}
          >
            {filtered.map((p, i) => (
              <motion.li
                key={p.slug}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: motionTokens.easing.primary,
                  delay: i * 0.06,
                }}
              >
                <ProjectCard
                  index={i}
                  slug={p.slug}
                  title={p.title}
                  subtitle={p.subtitle}
                  year={p.year}
                  category={p.category}
                  summary={p.summary}
                  stack={p.stack}
                  yDecor={yDecor}
                />
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </Container>
    </Section>
  );
}

function ProjectCard({
  index,
  slug,
  title,
  subtitle,
  year,
  category,
  summary,
  stack,
  yDecor,
}: {
  index: number;
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  category: ProjectCategory;
  summary: string;
  stack: string[];
  yDecor: MotionValue<number>;
}) {
  const offset = index % 3 === 1;
  return (
    <GlassCard
      variant="interactive"
      spotlight
      className={cn(
        'group relative flex h-full flex-col overflow-hidden p-7',
        // Resting stagger offset lives in a CSS var so `.glass-interactive`'s
        // hover lift composes with it instead of overriding it.
        offset && 'md:[--card-offset:2.5rem]',
      )}
      data-cursor="View"
    >
      <motion.div
        style={offset ? { y: yDecor } : undefined}
        className="flex items-center justify-between"
      >
        <Badge tone="accent" className="border-0 uppercase">
          {category.replace('-', ' / ')}
        </Badge>
        <span className="mono-caption">{year}</span>
      </motion.div>
      <h3 className="display-sm mt-6 text-2xl text-text-primary md:text-3xl">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary md:text-base">{subtitle}</p>
      <p className="mt-5 text-[15px] leading-relaxed text-text-secondary">{summary}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {stack.map((tech) => (
          <li
            key={tech}
            className="mono-caption rounded-full border border-line bg-[color-mix(in_oklch,var(--glass-bg)_120%,transparent)] px-2.5 py-1 text-[10px]"
          >
            {tech}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between pt-8">
        <Link href={`/projects/${slug}`} className="link-arrow text-sm text-text-primary">
          Read case study <ArrowUpRight size={14} />
        </Link>
      </div>
    </GlassCard>
  );
}