/**
 * Site-wide configuration. Edit this file to retune identity, navigation,
 * social links, and SEO defaults without touching components.
 *
 * Every value used in `<head>` metadata, footer, navbar and contact form
 * prefill is sourced from here.
 */
export const siteConfig = {
  name: 'Himanshu Raj Sharma',
  shortName: 'Himanshu',
  initials: 'HRS',
  role: 'Full-Stack Developer',
  tagline:
    'I build fast, scalable websites and apps for businesses and NGOs — clean code, calm interfaces, ships on time.',
  description:
    'Portfolio of Himanshu Raj Sharma — early-career full-stack developer (Next.js, React, Node, MongoDB, cloud) building freelance websites, apps, and tools for businesses and NGOs.',
  location: 'Dehradun, India',
  email: 'TODO: himanshu@example.com', // TODO: replace with real email
  phone: undefined as string | undefined, // TODO: optional phone
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  social: {
    github: 'https://github.com/himanshursharma2004',
    linkedin: 'https://www.linkedin.com/in/himanshursharma2004', // TODO: confirm handle
    twitter: undefined as string | undefined,
    instagram: undefined as string | undefined,
  },
  availability: {
    status: 'available' as 'available' | 'limited' | 'unavailable',
    label: 'Open to freelance and full-time roles',
  },
  resumeUrl: '/resume.pdf', // TODO: drop real resume into /public
  ogImage: '/og.png', // generated at build via opengraph-image.tsx
} as const;

export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#projects', label: 'Work' },
  { href: '#process', label: 'Process' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
] as const;