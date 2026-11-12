import type { NextConfig } from 'next';

/**
 * Canonical site origin.
 *
 * Resolution order:
 *   1. `NEXT_PUBLIC_SITE_URL` — set this in Vercel once you have a custom
 *      domain. It wins over everything else.
 *   2. `VERCEL_PROJECT_PRODUCTION_URL` — Vercel injects this automatically on
 *      production builds, so a first deploy is never served with
 *      `http://localhost:3000` canonical / OG / sitemap URLs.
 *   3. `VERCEL_URL` — the current deployment URL (used for previews).
 *   4. localhost, for local development.
 *
 * The value is injected through `env` below so it is inlined into the client
 * bundle too, not just read on the server.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  'http://localhost:3000';

/**
 * Next.js configuration for the portfolio.
 * - React strict mode for dev
 * - Security headers (CSP, XFO, Referrer, Permissions)
 * - next/image formats and remote pattern for placeholder / future asset CDNs
 */
const isDev = process.env.NODE_ENV !== 'production';

const csp = [
  "default-src 'self'",
  // Inline styles needed by Tailwind + Framer Motion + dynamic <style> tags
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // Next.js dev needs 'unsafe-eval' for HMR; in prod we still allow inline
  // scripts because Next.js inlines small runtime scripts at build time.
  // Vercel Web Analytics + Speed Insights load their bootstrap script from
  // va.vercel-scripts.com, so that origin must be script-src allowlisted.
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com" +
    (isDev ? " 'unsafe-eval'" : ''),
  // Analytics beacons are sent to va.vercel-scripts.com; Speed Insights
  // reports to vitals.vercel-insights.com. Both must be connect-src allowed.
  "connect-src 'self' https://api.resend.com https://*.upstash.io https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Injected into both server and client bundles. Skipped when the variable
  // is already set, so an explicit value in Vercel is never overwritten.
  env: process.env.NEXT_PUBLIC_SITE_URL ? {} : { NEXT_PUBLIC_SITE_URL: siteUrl },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // TODO: replace with real asset CDN if/when used
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;