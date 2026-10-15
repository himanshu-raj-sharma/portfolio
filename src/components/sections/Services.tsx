'use client';

import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section, SectionHeading } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal } from '@/components/ui/Reveal';
import { services } from '@content/services';

export function Services() {
  return (
    <Section id="services">
      <Container size="lg">
        <SectionHeading
          number="02"
          caption="Services"
          title={
            <>
              What I can build for
              <br />
              <span className="bg-[linear-gradient(120deg,var(--accent-2),var(--accent-1))] bg-clip-text text-transparent">
                you.
              </span>
            </>
          }
          description="Fixed scope, weekly demos, written estimate before kickoff. Pick a service to pre-fill the contact form."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.id} delay={i * 60}>
                <GlassCard
                  variant="interactive"
                  spotlight
                  className="group flex h-full flex-col p-7"
                  data-cursor="Open"
                >
                  <div className="flex items-start justify-between">
                    <span className="glass inline-flex h-12 w-12 items-center justify-center rounded-2xl">
                      <Icon size={20} strokeWidth={1.6} />
                    </span>
                    <span className="mono-caption">0{i + 1}</span>
                  </div>

                  <h3 className="display mt-6 text-2xl text-text-primary">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-base">
                    {s.description}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.deliverables.map((d) => (
                      <li
                        key={d}
                        className="rounded-full border border-line bg-[color-mix(in_oklch,var(--glass-bg)_120%,transparent)] px-2.5 py-1 text-[11px] text-text-secondary"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`/?type=${s.id}#contact`}
                    className="mt-7 inline-flex items-center gap-1.5 self-start text-sm font-medium text-text-primary underline-offset-4 hover:underline"
                  >
                    Start a project <ArrowUpRight size={14} />
                  </a>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}