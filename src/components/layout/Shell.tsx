import type { ReactNode } from 'react';
import { CursorProvider } from '@/components/motion/CursorProvider';
import { CursorHoverBinder } from '@/components/motion/CursorHoverBinder';
import { CustomCursor } from '@/components/motion/CustomCursor';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Preloader } from '@/components/motion/Preloader';
import { Footer } from '@/components/sections/Footer';

/**
 * AppShell — wraps the entire tree with the providers that have to be
 * client-side (theme, cursor, smooth scroll, preloader). The navbar + footer
 * are mounted once here so page-level transitions don't unmount them.
 *
 * Server-rendered children (sections) flow through untouched.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <CursorProvider>
          <SmoothScroll />
          <CursorHoverBinder />
          <div className="app-shell">
            <div className="film-grain" aria-hidden />
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <Navbar />
            <Preloader />
            <CustomCursor />
            <main id="main" className="relative z-10 pt-24">
              {children}
            </main>
            <Footer />
          </div>
        </CursorProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}