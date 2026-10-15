'use client';

import Link from 'next/link';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { GlassCard } from '@/components/ui/GlassCard';
import { siteConfig, navLinks } from '@content/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-32 pb-10 pt-20">
      <Container size="lg">
        <GlassCard
          variant="elevated"
          spotlight
          className="relative overflow-hidden p-10 md:p-16"
        >
          {/* Giant name with cursor spotlight — uses the same `.spotlight` CSS
              primitive as every other glass card. The first word is the
              visible colour-shifting block; the rest is dimmed to keep the
              oversized name readable on smaller screens. */}
          <p
            aria-hidden
            className="display pointer-events-none absolute inset-x-0 -top-6 select-none text-center text-[24vw] leading-[0.85] tracking-tightest text-text-muted/30 md:text-[16vw]"
          >
            {siteConfig.name}
          </p>
          <h2
            className="display spotlight pointer-events-auto relative z-10 cursor-default select-none text-center text-[24vw] leading-[0.85] tracking-tightest text-text-primary md:text-[16vw]"
          >
            {siteConfig.name}
          </h2>

          <div className="relative z-10 mt-12 grid grid-cols-2 gap-10 md:grid-cols-4">
            <div>
              <p className="mono-caption">Pages</p>
              <ul className="mt-3 space-y-2 text-sm">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-text-secondary hover:text-text-primary"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href="/projects"
                    className="text-text-secondary hover:text-text-primary"
                  >
                    All work
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mono-caption">Elsewhere</p>
              <ul className="mt-3 space-y-2 text-sm">
                {siteConfig.social.github && (
                  <li>
                    <a
                      href={siteConfig.social.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-text-secondary hover:text-text-primary"
                    >
                      GitHub
                    </a>
                  </li>
                )}
                {siteConfig.social.linkedin && (
                  <li>
                    <a
                      href={siteConfig.social.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-text-secondary hover:text-text-primary"
                    >
                      LinkedIn
                    </a>
                  </li>
                )}
                <li>
                  <a href="#contact" className="text-text-secondary hover:text-text-primary">
                    Contact form
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-2">
              <p className="mono-caption">Get the resume</p>
              <p className="mt-3 max-w-sm text-sm text-text-secondary">
                A short PDF with the same info as this site, formatted for inboxes and ATS.
              </p>
              <a
                href={siteConfig.resumeUrl}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-text-primary underline-offset-4 hover:underline"
              >
                Download resume →
              </a>
            </div>
          </div>

          <div className="relative z-10 mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-xs text-text-muted">
            <p>
              © {year} {siteConfig.name}. Built in Dehradun — ships from anywhere.
            </p>
            <div className="flex items-center gap-3">
              {siteConfig.social.github && (
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line"
                >
                  <Github size={13} />
                </a>
              )}
              {siteConfig.social.linkedin && (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line"
                >
                  <Linkedin size={13} />
                </a>
              )}
              <a
                href="#contact"
                aria-label="Email"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line"
              >
                <Mail size={13} />
              </a>
              <a
                href="#main"
                aria-label="Back to top"
                className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-text-secondary hover:text-text-primary"
              >
                Top <ArrowUp size={12} />
              </a>
            </div>
          </div>
        </GlassCard>
      </Container>
    </footer>
  );
}