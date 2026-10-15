import type { Config } from 'tailwindcss';

/**
 * Tailwind theme — all design tokens come from CSS variables declared in
 * src/styles/globals.css. Tailwind utilities here consume those tokens so the
 * theme remains easy to retune without touching class names.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--bg-base)',
          elevated: 'var(--bg-elevated)',
          inverse: 'var(--bg-inverse)',
        },
        glass: {
          bg: 'var(--glass-bg)',
          border: 'var(--glass-border)',
          highlight: 'var(--glass-highlight)',
          shadow: 'var(--glass-shadow)',
        },
        accent: {
          1: 'var(--accent-1)',
          2: 'var(--accent-2)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        line: 'var(--line)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Editorial display scale
        'hero-sm': 'clamp(2.75rem, 8vw, 4.5rem)',
        hero: 'clamp(3.5rem, 12vw, 9rem)',
        'section-title': 'clamp(2.25rem, 5vw, 4rem)',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
        tight: '-0.015em',
      },
      borderRadius: {
        glass: '1.25rem',
        'glass-lg': '1.75rem',
      },
      boxShadow: {
        glass: '0 18px 60px -24px var(--glass-shadow), inset 0 1px 0 0 var(--glass-highlight)',
        'glass-lg':
          '0 30px 90px -30px var(--glass-shadow), inset 0 1px 0 0 var(--glass-highlight)',
        glow: '0 0 40px -8px var(--accent-1)',
      },
      backdropBlur: {
        glass: '20px',
      },
      transitionTimingFunction: {
        primary: 'cubic-bezier(0.22, 1, 0.36, 1)',
        expressive: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'marquee-x': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'marquee-x': 'marquee-x 40s linear infinite',
        shimmer: 'shimmer 1.6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;