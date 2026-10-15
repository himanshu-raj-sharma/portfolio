'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section, SectionHeading } from '@/components/ui/Section';
import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal } from '@/components/ui/Reveal';
import { faqs } from '@content/faq';
import { motion, AnimatePresence } from 'framer-motion';
import { motionTokens } from '@/lib/motion-tokens';

export function FAQ() {
  const [active, setActive] = useState<number | null>(0);
  const baseId = useId();

  return (
    <Section id="faq" aria-labelledby="faq-heading">
      <Container size="lg">
        <SectionHeading
          number="08"
          caption="FAQ"
          title={
            <>
              Things people
              <br />
              <span className="bg-[linear-gradient(120deg,var(--accent-2),var(--accent-1))] bg-clip-text text-transparent">
                ask first.
              </span>
            </>
          }
        />
        <h2 id="faq-heading" className="visually-hidden">
          Frequently asked questions
        </h2>

        <div className="mt-12 max-w-3xl">
          {faqs.map((f, i) => {
            const open = active === i;
            const headingId = `${baseId}-q-${i}`;
            const panelId = `${baseId}-p-${i}`;
            return (
              <Reveal key={f.question} delay={i * 50}>
                <GlassCard className="mb-3 p-0">
                  <h3 id={headingId} className="m-0">
                    <button
                      type="button"
                      onClick={() => setActive(open ? null : i)}
                      className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left"
                      aria-expanded={open}
                      aria-controls={panelId}
                    >
                      <span className="text-base font-medium text-text-primary md:text-lg">
                        {f.question}
                      </span>
                      <motion.span
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: motionTokens.easing.primary }}
                        className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-line"
                        aria-hidden
                      >
                        <ChevronDown size={14} />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={headingId}
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: motionTokens.easing.primary }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm leading-relaxed text-text-secondary md:text-base">
                          {f.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}