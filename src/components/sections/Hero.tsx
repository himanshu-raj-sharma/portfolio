'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { GlassLinkButton } from '@/components/ui/GlassButton';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Badge } from '@/components/ui/Badge';
import { siteConfig } from '@content/site';
import { motionTokens } from '@/lib/motion-tokens';
import { cn } from '@/lib/utils';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => null,
});

const ROLES = ['Full-Stack Developer', 'Cloud Enthusiast', 'Problem Solver'];

function SplitHeadline({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <h1 className="display text-hero text-text-primary">
      <span className="block overflow-hidden">
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 1,
              ease: motionTokens.easing.expressive,
              delay: 0.4 + i * 0.08,
            }}
          >
            {word}
            {i < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}

function RoleRotator() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      className="relative inline-block min-w-[14ch] align-baseline"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="invisible">{ROLES[0]}</span>
      {ROLES.map((role, i) => (
        <motion.span
          key={role}
          aria-hidden={i !== index}
          className={cn(
            'absolute left-0 top-0 whitespace-nowrap bg-[linear-gradient(120deg,var(--accent-2),var(--accent-1))] bg-clip-text text-transparent',
          )}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: i === index ? 1 : 0, y: i === index ? 0 : -18 }}
          transition={{ duration: 0.6, ease: motionTokens.easing.primary }}
        >
          {role}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[88vh] items-center overflow-hidden pt-12 md:pt-20"
    >
      <BackdropScene />

      <Container size="lg" className="relative z-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-9">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: motionTokens.easing.primary, delay: 0.1 }}
              className="mb-6 flex items-center gap-3"
            >
              <Badge tone="accent" className="border-0">
                <span className="relative mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-2)]">
                  <span className="absolute inset-0 animate-pulse-glow rounded-full bg-[var(--accent-2)]" />
                </span>
                {siteConfig.availability.label}
              </Badge>
              <span className="mono-caption hidden md:inline">{siteConfig.location}</span>
            </motion.div>

            <div id="hero-title">
              <p className="mono-caption mb-4">
                <Sparkles size={12} className="mr-1 inline-block" strokeWidth={1.5} /> Hi, I&apos;m
              </p>
              <SplitHeadline text={siteConfig.name} />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: motionTokens.easing.primary, delay: 0.8 }}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl"
            >
              <RoleRotator /> — {siteConfig.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: motionTokens.easing.primary, delay: 1.0 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <MagneticButton label="Hire me">
                <GlassLinkButton as="a" href="#contact" size="lg" variant="primary">
                  Hire me <ArrowRight size={16} />
                </GlassLinkButton>
              </MagneticButton>
              <MagneticButton label="View work">
                <GlassLinkButton as="a" href="#projects" size="lg" variant="secondary">
                  View work
                </GlassLinkButton>
              </MagneticButton>
              <MagneticButton label="Download">
                <GlassLinkButton as="a" href={siteConfig.resumeUrl} size="lg" variant="ghost">
                  <Download size={16} /> Resume
                </GlassLinkButton>
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-10 flex items-center gap-3"
            >
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="glass inline-flex h-10 w-10 items-center justify-center rounded-full"
                data-cursor="Visit"
              >
                <Github size={16} strokeWidth={1.6} />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="glass inline-flex h-10 w-10 items-center justify-center rounded-full"
                data-cursor="Visit"
              >
                <Linkedin size={16} strokeWidth={1.6} />
              </a>
            </motion.div>
          </div>

          <div className="hidden md:col-span-3 md:block">
            <motion.aside
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0, ease: motionTokens.easing.primary }}
              className="glass spotlight sticky top-32 rounded-glass p-6"
            >
              <p className="mono-caption">Currently</p>
              <p className="mt-2 text-sm leading-relaxed text-text-primary">
                Building <span className="font-semibold">LeLe Organic</span> — a premium Indian
                organic e-commerce storefront.
              </p>
              <hr className="my-5 border-line" />
              <p className="mono-caption">Open to</p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Freelance web &amp; app projects, NGO partnerships, select full-time roles.
              </p>
            </motion.aside>
          </div>
        </div>
      </Container>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-48 bg-[linear-gradient(180deg,transparent,var(--bg-base))]" />
    </section>
  );
}

function BackdropScene() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const url = new URL(window.location.href);
    const nofx = url.searchParams.get('nofx') === '1';
    setShow(!coarse && !reduce && !nofx);
  }, []);
  if (!show) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-70 md:opacity-90"
    >
      <HeroScene />
    </div>
  );
}