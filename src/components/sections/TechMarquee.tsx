'use client';

import { Container } from '@/components/ui/Container';
import { skillCategories } from '@content/skills';

const TOOLS = Array.from(new Set(skillCategories.flatMap((c) => c.items)));

export function TechMarquee() {
  return (
    <section aria-label="Tools I work with" className="relative border-y border-line py-8">
      <Container size="full" className="overflow-hidden">
        <div className="marquee gap-12">
          {[...TOOLS, ...TOOLS].map((tool, i) => (
            <span
              key={`${tool}-${i}`}
              className="mono-caption whitespace-nowrap text-base text-text-secondary"
            >
              {tool} <span className="mx-3 text-text-muted">✦</span>
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}