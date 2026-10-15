import type { NextConfig } from 'next';

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
  "script-src 'self' 'unsafe-inline'" + (isDev ? " 'unsafe-eval'" : ''),
  "connect-src 'self' https://api.resend.com https://*.upstash.io https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
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