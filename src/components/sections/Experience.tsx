import { Container } from '@/components/ui/Container';
import { Section, SectionHeading } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal } from '@/components/ui/Reveal';
import { experiences } from '@content/experience';

export function Experience() {
  return (
    <Section id="experience">
      <Container size="lg">
        <SectionHeading
          number="05"
          caption="Experience"
          title={
            <>
              Where I&apos;ve
              <br />
              <span className="bg-[linear-gradient(120deg,var(--accent-2),var(--accent-1))] bg-clip-text text-transparent">
                been useful.
              </span>
            </>
          }
        />

        <ol className="mt-12 relative ml-3 space-y-8 border-l border-line pl-7">
          {experiences.map((exp, i) => (
            <Reveal key={exp.role + exp.org} delay={i * 80}>
              <li className="relative">
                <span className="absolute -left-[34px] top-2 inline-block h-2.5 w-2.5 rounded-full bg-[linear-gradient(135deg,var(--accent-1),var(--accent-2))] shadow-[0_0_0_4px_color-mix(in_oklch,var(--accent-1)_15%,transparent)]" />
                <GlassCard className="p-6" spotlight>
                  <p className="mono-caption">{exp.start} → {exp.end}</p>
                  <h3 className="display mt-2 text-xl text-text-primary">
                    {exp.role}{' '}
                    <span className="text-text-secondary">· {exp.org}</span>
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">{exp.location}</p>
                  <ul className="mt-5 space-y-3">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                        <span className="mt-2 inline-block h-1 w-3 flex-shrink-0 rounded-full bg-[var(--accent-2)]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}