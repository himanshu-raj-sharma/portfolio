import { Container } from '@/components/ui/Container';
import { Section, SectionHeading } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal } from '@/components/ui/Reveal';
import { skillCategories } from '@content/skills';

export function Skills() {
  return (
    <Section id="skills" density="tight">
      <Container size="lg">
        <SectionHeading
          number="04"
          caption="Toolbox"
          title={
            <>
              The tools I
              <br />
              <span className="bg-[linear-gradient(120deg,var(--accent-2),var(--accent-1))] bg-clip-text text-transparent">
                reach for.
              </span>
            </>
          }
          description="Stack and tooling — grouped by what they're good at. I lean toward boring, well-supported choices."
        />

        <div className="mt-block-y grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat, i) => (
            <Reveal key={cat.title} delay={i * 50}>
              <GlassCard variant="interactive" className="h-full p-6" spotlight>
                <div className="flex items-baseline justify-between">
                  <h3 className="display-sm text-xl text-text-primary">{cat.title}</h3>
                  <span className="mono-caption">{cat.caption}</span>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line bg-[color-mix(in_oklch,var(--glass-bg)_120%,transparent)] px-3 py-1 text-xs text-text-secondary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}