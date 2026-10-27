import { Container } from '@/components/ui/Container';
import { Section, SectionHeading } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal } from '@/components/ui/Reveal';
import { education } from '@content/education';

export function Education() {
  return (
    <Section id="education" density="tight">
      <Container size="lg">
        <SectionHeading
          number="06"
          caption="Education"
          title={
            <>
              The
              <br />
              <span className="bg-[linear-gradient(120deg,var(--accent-2),var(--accent-1))] bg-clip-text text-transparent">
                classroom bits.
              </span>
            </>
          }
        />

        <div className="mt-block-y grid grid-cols-1 gap-5 md:grid-cols-2">
          {education.map((ed, i) => (
            <Reveal key={ed.degree} delay={i * 80}>
              <GlassCard variant="interactive" className="h-full p-7" spotlight>
                <p className="mono-caption">{ed.start} → {ed.end}</p>
                <h3 className="display-sm mt-2 text-2xl text-text-primary">{ed.degree}</h3>
                <p className="mt-1 text-sm text-text-secondary">{ed.school}</p>
                <p className="mt-1 text-sm text-text-muted">{ed.location}</p>
                {ed.specialization && (
                  <p className="mt-4 inline-block rounded-full border border-line bg-[color-mix(in_oklch,var(--accent-1)_10%,transparent)] px-3 py-1 text-xs">
                    {ed.specialization}
                  </p>
                )}
                {ed.notes && (
                  <ul className="mt-5 space-y-2 text-sm leading-relaxed text-text-secondary">
                    {ed.notes.map((n) => (
                      <li key={n}>— {n}</li>
                    ))}
                  </ul>
                )}
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}