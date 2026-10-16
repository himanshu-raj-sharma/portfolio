/**
 * Site-wide configuration. Edit this file to retune identity, navigation,
 * social links, and SEO defaults without touching components.
 *
 * Every value used in `<head>` metadata, footer, navbar and contact form
 * prefill is sourced from here.
 */
export const siteConfig = {
  name: 'Himanshu Raj',
  shortName: 'Himanshu',
  initials: 'HR',
  role: 'Software Engineer',
  tagline:
    'I build fast, scalable websites and apps for businesses — clean code, calm interfaces, ships on time.',
  description:
    'Portfolio of Himanshu Raj — early-career full-stack developer (Next.js, React, Node, MongoDB, cloud) building freelance websites, apps, and tools for businesses and NGOs.',
  location: 'Gaya, India',
  email: 'rajhimanshu5522@gmail.com',
  phone: '+91-8529762940',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  social: {
    github: 'https://github.com/himanshu-raj-sharma',
    linkedin: 'https://www.linkedin.com/in/himanshu-raj-sharma', // TODO: confirm handle
    twitter: undefined as string | undefined,
    instagram: 'https://www.instagram.com/gurillawarfare',
  },
  availability: {
    status: 'available' as 'available' | 'limited' | 'unavailable',
    label: 'Open to freelance and full-time roles',
  },
  resumeUrl: '/resume.pdf',
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