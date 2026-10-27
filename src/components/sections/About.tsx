'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { Section, SectionHeading } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal } from '@/components/ui/Reveal';
import { motionTokens } from '@/lib/motion-tokens';

const PARAGRAPH_A =
  "I'm a B.Tech Computer Science student at DIT University (Cloud Computing & Blockchain) with a prior Diploma in Electronics Engineering — so I move comfortably between low-level signals and cloud-native web apps. I've shipped real products for businesses and NGOs, not just side projects.";

const PARAGRAPH_B =
  'I work in tight loops: short briefs, weekly demos, and clean handoffs. My stack is mostly Next.js, Node, MongoDB and AWS, but I care more about the right tool for the problem than the framework on my CV.';

const STATS = [
  { label: 'Production projects', value: '5+', note: 'Web, mobile, embedded' },
  { label: 'Internship', value: '1', note: 'DAWF, Dehradun' },
  { label: 'Response time', value: '<24h', note: 'For inquiries' },
  { label: 'Stack focus', value: 'TS · Node', note: 'Next.js + Mongo' },
] as const;

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Subtle parallax on the copy column.
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <Section id="about" ref={ref}>
      <Container size="lg">
        <SectionHeading
          number="01"
          caption="About"
          title={
            <>
              An engineer who
              <br />
              <span className="bg-[linear-gradient(120deg,var(--accent-2),var(--accent-1))] bg-clip-text text-transparent">
                ships, not decks.
              </span>
            </>
          }
          description="A short intro, the kind of work I like, and how I run projects."
        />

        <div className="mt-block-y grid grid-cols-1 gap-8 md:grid-cols-12">
          <motion.div style={{ y }} className="md:col-span-7">
            <Reveal>
              <p className="display-sm text-2xl leading-relaxed text-text-primary md:text-3xl">
                {wordReveal(PARAGRAPH_A)}
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="body-text mt-6 text-base text-text-secondary md:text-lg">
                {PARAGRAPH_B}
              </p>
            </Reveal>
          </motion.div>

          <div className="md:col-span-5">
            <Reveal>
              <GlassCard variant="elevated" spotlight className="p-6">
                <div className="mono-caption">Portrait</div>
                <div className="relative mt-4 aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line">
                  <Image
                    src="/portrait.jpg"
                    alt="Himanshu Raj"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>

        <div className="mt-stack-y grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {STATS.map((s) => (
            <Reveal key={s.label}>
              <GlassCard variant="interactive" className="p-5" data-cursor="Read">
                <p className="mono-caption">{s.label}</p>
                <p className="display-sm mt-3 text-3xl text-text-primary md:text-4xl">{s.value}</p>
                <p className="mt-2 text-xs text-text-muted">{s.note}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/**
 * Word-by-word reveal: starts dim, scrubs to full opacity as the section
 * enters the viewport. Each word uses a delay computed from its index so
 * the reveal reads as a wave rather than a single fade.
 *
 * SSR note: `initial={{ opacity: 0 }}` ensures words render at zero
 * opacity before hydration; the `whileInView` handler then animates them
 * in. Without the initial, words would flash at full opacity briefly.
 */
function wordReveal(text: string) {
  const words = text.split(' ');
  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-15% 0px' }}
      className="block"
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0.15 }}
          variants={{
            hidden: { opacity: 0.15 },
            show: {
              opacity: 1,
              transition: { duration: 0.6, delay: i * 0.02, ease: motionTokens.easing.primary },
            },
          }}
        >
          {w}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </motion.span>
  );
}