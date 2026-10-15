import type { MetadataRoute } from 'next';
import { projects } from '@content/projects';
import { env } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    { url: `${base}/resume`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];
}