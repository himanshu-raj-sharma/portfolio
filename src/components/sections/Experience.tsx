import { Container } from '@/components/ui/Container';
import { Section, SectionHeading } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
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

        <ol className="mt-block-y relative ml-3 space-y-8 border-l border-line pl-7">
          {experiences.map((exp, i) => (
            // <li> must be a direct child of <ol> — the reveal wrapper is a
            // <div>, so it goes *inside* the list item, not around it.
            <li key={exp.role + exp.org} className="relative">
              <Reveal delay={i * 80}>
                <span className="absolute -left-[34px] top-2 inline-block h-2.5 w-2.5 rounded-full bg-[linear-gradient(135deg,var(--accent-1),var(--accent-2))] shadow-[0_0_0_4px_color-mix(in_oklch,var(--accent-1)_15%,transparent)]" />
                <GlassCard variant="interactive" className="p-6" spotlight>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <p className="mono-caption">{exp.start} → {exp.end}</p>
                    {exp.tag && (
                      <Badge tone="accent" className="border-0 text-[10px] uppercase tracking-wider">
                        {exp.tag}
                      </Badge>
                    )}
                  </div>
                  <h3 className="display-sm mt-2 text-xl text-text-primary">
                    {exp.role}{' '}
                    <span className="text-text-secondary">· {exp.org}</span>
                  </h3>
                  {exp.location && <p className="mt-1 text-sm text-text-muted">{exp.location}</p>}
                  <ul className="mt-5 space-y-3">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="flex gap-3 text-sm leading-relaxed text-text-secondary">
                        <span className="mt-2 inline-block h-1 w-3 flex-shrink-0 rounded-full bg-[var(--accent-2)]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}