import type { ComponentType } from 'react';
import {
  LayoutTemplate,
  ShoppingCart,
  Smartphone,
  PaintBucket,
  Server,
  Cloud,
} from 'lucide-react';
import type { projectTypes } from '@/lib/schemas';

export type ServiceItem = {
  id: (typeof projectTypes)[number];
  title: string;
  description: string;
  deliverables: string[];
  icon: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
};

export const services: ServiceItem[] = [
  {
    id: 'full-stack-web',
    title: 'Full-Stack Web Apps',
    description:
      'End-to-end product builds — from spec to deploy. Auth, dashboards, payments, admin tooling, the works.',
    deliverables: [
      'Next.js + TypeScript app',
      'Database & auth setup',
      'Admin dashboard',
      'Analytics & monitoring',
    ],
    icon: LayoutTemplate,
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Websites',
    description:
      'Conversion-focused storefronts with secure checkout, inventory, and a backend your team can actually use.',
    deliverables: [
      'Storefront design',
      'Catalog & inventory',
      'Payments (Razorpay / Stripe)',
      'Order management',
    ],
    icon: ShoppingCart,
  },
  {
    id: 'mobile-app',
    title: 'Mobile / Cross-platform Apps',
    description:
      'iOS, Android, and PWA — one codebase, native feel. Good for MVPs and small teams that need to ship fast.',
    deliverables: [
      'Cross-platform app',
      'Push notifications',
      'Offline cache',
      'Store deployment',
    ],
    icon: Smartphone,
  },
  {
    id: 'wordpress',
    title: 'WordPress / Elementor for NGOs & SMBs',
    description:
      'Practical sites your team can edit themselves. Editorial-friendly CMS, fast load, easy hand-off.',
    deliverables: [
      'Theme / Elementor build',
      'Editable CMS',
      'Donation / form setup',
      'Launch + handover',
    ],
    icon: PaintBucket,
  },
  {
    id: 'backend-api',
    title: 'Backend APIs & Database Design',
    description:
      'Need a clean API behind an existing site or app? Or to fix a flaky database? I do that.',
    deliverables: [
      'REST API',
      'Schema & migrations',
      'Auth & permissions',
      'API documentation',
    ],
    icon: Server,
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Deployment & Maintenance',
    description:
      'AWS / Vercel / Render setup, CI/CD, monitoring, cost tuning, and the occasional firefighting call.',
    deliverables: [
      'Cloud setup',
      'CI/CD pipeline',
      'Monitoring + alerts',
      'Monthly maintenance',
    ],
    icon: Cloud,
  },
];