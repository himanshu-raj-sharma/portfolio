'use client';

import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { motionTokens } from '@/lib/motion-tokens';
import { Container } from '@/components/ui/Container';
import { GlassLinkButton } from '@/components/ui/GlassButton';
import { navLinks, siteConfig } from '@content/site';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-primary',
        scrolled ? 'pt-3' : 'pt-6',
      )}
    >
      <Container size="lg">
        <nav
          className={cn(
            'glass spotlight flex items-center justify-between rounded-full px-4 py-2 md:px-6 md:py-3',
            scrolled && 'shadow-glass-lg',
          )}
          aria-label="Primary"
        >
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-semibold tracking-tight"
            data-cursor="Home"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent-1),var(--accent-2))] text-[11px] font-bold text-text-inverse">
              {siteConfig.initials}
            </span>
            <span className="hidden md:inline">{siteConfig.shortName}</span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-3 py-2 text-sm text-text-secondary transition-colors duration-300 hover:text-text-primary"
                  data-cursor="Jump"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle theme"
              className="glass glass-interactive inline-flex h-9 w-9 items-center justify-center rounded-full"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              data-cursor="Theme"
            >
              {mounted &&
                (resolvedTheme === 'dark' ? (
                  <Sun size={16} strokeWidth={1.6} />
                ) : (
                  <Moon size={16} strokeWidth={1.6} />
                ))}
            </button>
            <GlassLinkButton
              as="a"
              href="#contact"
              size="sm"
              variant="primary"
              className="hidden md:inline-flex"
              data-cursor="Hire"
            >
              Hire me
            </GlassLinkButton>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="glass inline-flex h-9 w-9 items-center justify-center rounded-full md:hidden"
              onClick={() => setOpen((v) => !v)}
              data-cursor="Menu"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: motionTokens.easing.primary }}
            className="md:hidden"
          >
            <Container size="lg" className="mt-3">
              <div className="glass spotlight rounded-glass p-5">
                <ul className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-2xl px-4 py-3 text-base text-text-secondary hover:bg-[color-mix(in_oklch,var(--accent-1)_10%,transparent)] hover:text-text-primary"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <GlassLinkButton
                  as="a"
                  href="#contact"
                  variant="primary"
                  size="md"
                  className="mt-4 w-full"
                  onClick={() => setOpen(false)}
                >
                  Hire me
                </GlassLinkButton>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}