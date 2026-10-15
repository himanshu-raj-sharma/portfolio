import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { siteConfig } from '@content/site';
import { AppShell } from '@/components/layout/Shell';
import { env } from '@/lib/env';
import { JsonLd } from '@/components/seo/JsonLd';
import { Analytics } from '@/components/seo/Analytics';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Note: Geist Mono is not on Google Fonts; JetBrains Mono is a great proxy
// and matches the editorial monospace voice well.
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    'full-stack developer Dehradun',
    'Next.js developer India',
    'freelance web developer',
    'React developer',
    'Node.js developer',
    'NGO website developer',
    'Himanshu Raj Sharma',
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#05060a' },
    { media: '(prefers-color-scheme: light)', color: '#f6f6fb' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable}`}
      style={
        {
          // Fallback display font stack — production uses a real display face.
          ['--font-display' as string]: "'Clash Display', 'Satoshi', 'General Sans', serif",
        } as React.CSSProperties
      }
    >
      <body>
        <JsonLd />
        <Analytics />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}