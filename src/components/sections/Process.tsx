import { Container } from '@/components/ui/Container';
import { Section, SectionHeading } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal } from '@/components/ui/Reveal';
import { processSteps } from '@content/process';

export function Process() {
  return (
    <Section id="process">
      <Container size="lg">
        <SectionHeading
          number="07"
          caption="Process"
          title={
            <>
              How a project
              <br />
              <span className="bg-[linear-gradient(120deg,var(--accent-2),var(--accent-1))] bg-clip-text text-transparent">
                runs with me.
              </span>
            </>
          }
          description="No surprises — a four-step loop you can see from the outside."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s, i) => (
            <Reveal key={s.step} delay={i * 80}>
              <GlassCard className="h-full p-6" spotlight>
                <span className="display text-5xl text-text-primary md:text-6xl">{s.step}</span>
                <h3 className="display mt-5 text-xl text-text-primary">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{s.body}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}