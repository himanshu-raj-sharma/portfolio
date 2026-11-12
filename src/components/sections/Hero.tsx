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
import { motionTokens, prefersReducedMotion } from '@/lib/motion-tokens';
import { onSiteReady } from '@/lib/site-ready';
import { cn } from '@/lib/utils';

// R3F scene is client-only; `ssr: false` keeps Three.js out of the server bundle.
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
});

const ROLES = ['Full-Stack Developer', 'Cloud Enthusiast', 'Problem Solver'];

function SplitHeadline({ text, ready }: { text: string; ready: boolean }) {
  const words = text.split(' ');
  return (
    <h1 className="display text-hero text-text-primary">
      <span className="block overflow-hidden">
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={ready ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
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
    if (prefersReducedMotion()) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block min-w-[14ch] align-baseline">
      {/* Layout placeholder — keeps the row from resizing as roles swap.
          `invisible` (visibility: hidden) also drops it from the a11y tree. */}
      <span className="invisible" aria-hidden>
        {ROLES[0]}
      </span>
      {/* The rotator changes every 2.8s — announcing each change would be
          constant noise for screen readers, so the roles are exposed once as
          static text and the animated copy is hidden from assistive tech. */}
      <span className="visually-hidden">{ROLES.join(', ')}</span>
      {ROLES.map((role, i) => {
        const isActive = i === index;
        return (
          <motion.span
            key={role}
            aria-hidden
            className={cn(
              'absolute left-0 top-0 whitespace-nowrap bg-[linear-gradient(120deg,var(--accent-2),var(--accent-1))] bg-clip-text text-transparent',
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            // Fade out first, then fade the next role in. The old version
            // slid one role up while the next slid in, so the two overlapped
            // mid-swap and read as two ghosted lines of text.
            transition={{
              duration: isActive ? 0.5 : 0.25,
              delay: isActive ? 0.25 : 0,
              ease: motionTokens.easing.primary,
            }}
          >
            {role}
          </motion.span>
        );
      })}
    </span>
  );
}

export function Hero() {
  const [showScene, setShowScene] = useState(false);
  // The preloader covers the first paint — hold the entrance animation until
  // the curtain lifts, otherwise it plays out unseen behind the overlay.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    onSiteReady(() => setReady(true));
    // Safety net: never leave the hero hidden if the signal is missed.
    const fallback = window.setTimeout(() => setReady(true), 4000);
    return () => window.clearTimeout(fallback);
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduce = prefersReducedMotion();
    const url = new URL(window.location.href);
    const nofx = url.searchParams.get('nofx') === '1';
    setShowScene(!coarse && !reduce && !nofx);
  }, []);

  return (
    <section
      aria-labelledby="hero-title"
      className={cn(
        'relative isolate flex items-center overflow-hidden pt-12 md:pt-20',
        showScene ? 'min-h-[88vh]' : 'min-h-[70vh]'
      )}
    >
      <BackdropScene show={showScene} />

      <Container size="lg" className="relative z-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-9">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
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
              <SplitHeadline text={siteConfig.name} ready={ready} />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.8, ease: motionTokens.easing.primary, delay: 0.8 }}
              className="lead mt-8 max-w-2xl text-lg text-text-secondary md:text-xl"
            >
              <RoleRotator /> — {siteConfig.tagline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
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
              animate={ready ? { opacity: 1 } : { opacity: 0 }}
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
              animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
              transition={{ duration: 0.8, delay: 1.0, ease: motionTokens.easing.primary }}
              className="glass spotlight sticky top-32 rounded-glass p-6"
            >
              <p className="mono-caption">Currently</p>
              <p className="mt-2 text-sm leading-relaxed text-text-primary">
                Building <span className="font-semibold">innovative web projects</span> — from full-stack apps to cloud-native solutions.
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

function BackdropScene({ show }: { show: boolean }) {
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