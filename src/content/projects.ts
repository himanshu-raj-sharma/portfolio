export type ProjectCategory = 'web' | 'ai-ml' | 'hardware';

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  category: ProjectCategory;
  featured: boolean;
  role: string;
  stack: string[];
  summary: string;
  problem: string;
  architecture: string;
  challenges: string[];
  outcome: string;
  links: { label: string; href: string }[];
  /** Optional cover image URL — uses placeholder when missing. */
  cover?: string;
  /** Screenshot list rendered on the case-study page. */
  screenshots?: { src: string; alt: string; caption?: string }[];
};

/**
 * Project seed. Numbers and outcomes that aren't confirmed are marked TODO
 * (see README for the master TODO list). Cover images and screenshots use
 * public/placeholders/* paths so the build succeeds without external assets.
 */
export const projects: Project[] = [
  {
    slug: 'acfm-net',
    title: 'ACFM-Net',
    subtitle: 'Adaptive Cognitive & Fatigue Monitoring — capstone',
    year: '2025',
    category: 'ai-ml',
    featured: true,
    role: 'Team lead · ML, backend, hardware integration',
    stack: ['Python', 'scikit-learn', 'Flask', 'MongoDB', 'Arduino', 'MQTT'],
    summary:
      'Wearable-assisted cognitive load monitoring that adapts to the user over time — predicts fatigue from physiological signals and short interactions.',
    problem: 'TODO: describe the capstone problem statement and constraints in 2–3 sentences.',
    architecture:
      'TODO: high-level architecture — sensor layer (Arduino + PPG/EDA), MQTT bridge, Flask API, ML inference service, React dashboard.',
    challenges: [
      'TODO: noisy biosignal data — filtering, windowing, label agreement',
      'TODO: keeping inference latency low on a Raspberry Pi edge node',
      'TODO: adaptive personalization with very little per-user data',
    ],
    outcome:
      'TODO: back this with a real metric. Placeholder — internal demo for faculty review, served predictions at <200ms latency.',
    links: [
      { label: 'GitHub', href: 'https://github.com/himanshursharma2004' },
      { label: 'Case study', href: '/projects/acfm-net' },
    ],
  },
  {
    slug: 'lele-organic',
    title: 'LeLe Organic',
    subtitle: 'Premium Indian organic e-commerce · internship',
    year: '2025',
    category: 'web',
    featured: true,
    role: 'Full-stack developer · storefront, admin, payments',
    stack: ['Next.js 15', 'Express', 'MongoDB', 'Razorpay', 'Tailwind'],
    summary:
      'Direct-to-consumer organic food storefront with admin dashboard, secure checkout and India-only fulfilment.',
    problem: 'TODO: founder wanted a premium brand experience without a marketplace fee; inventory had to stay synced across web + manual orders.',
    architecture:
      'TODO: Next.js storefront on Vercel · Express API on Render · MongoDB Atlas · Resend for transactional email · Razorpay for payments.',
    challenges: [
      'TODO: catalogue sync between admin and storefront',
      'TODO: GSTIN and invoicing compliance',
      'TODO: keep the marketing pages snappy on slow connections',
    ],
    outcome:
      'TODO: replace with a real metric. Placeholder — launched MVP behind a feature flag, store admin can add products without a redeploy.',
    links: [
      { label: 'Live site (TBD)', href: '#' },
      { label: 'GitHub (private)', href: '#' },
    ],
  },
  {
    slug: 'punyakart-foundation',
    title: 'Punyakart Foundation',
    subtitle: 'Donation portal · React + Express',
    year: '2024',
    category: 'web',
    featured: true,
    role: 'Solo developer · design + build',
    stack: ['React', 'Express', 'MongoDB', 'Stripe'],
    summary:
      'Public donation portal for a small NGO — campaign pages, recurring donations, and a transparent donation ledger.',
    problem: 'TODO: foundation relied on a manual UPI flow with no visibility into recurring donors.',
    architecture:
      'TODO: React SPA · Express API · MongoDB · Stripe Subscriptions · S3-hosted campaign assets.',
    challenges: [
      'TODO: keeping donor PII minimal and auditable',
      'TODO: receipt generation in a way volunteers could actually run',
    ],
    outcome:
      'TODO: replace with a real metric. Placeholder — processed X donations in the first Y months, zero missed receipts.',
    links: [
      { label: 'Live site', href: '#' },
      { label: 'GitHub', href: 'https://github.com/himanshursharma2004' },
    ],
  },
  {
    slug: 'srshti-foundation',
    title: 'SRSHTI Foundation',
    subtitle: 'NGO donation landing page · WordPress / Elementor',
    year: '2024',
    category: 'web',
    featured: true,
    role: 'Designer & developer',
    stack: ['WordPress', 'Elementor', 'Contact Form 7', 'Razorpay'],
    summary:
      'Single-page donation funnel built so volunteers can edit copy without breaking the layout.',
    problem: 'TODO: foundation wanted a one-page site focused on a single ask, with a hand-off the team could actually maintain.',
    architecture:
      'TODO: Elementor + lightweight theme · Razorpay donate button · Resend for receipts.',
    challenges: [
      'TODO: keep it editable without breaking the design',
      'TODO: accessibility for low-end devices',
    ],
    outcome:
      'TODO: replace with a real metric. Placeholder — live for ~6 months, edited weekly by non-technical volunteers.',
    links: [{ label: 'Live site', href: '#' }],
  },
  {
    slug: 'self-learning-support-agent',
    title: 'Self-Learning Support Agent',
    subtitle: 'Agent that improves from corrected responses',
    year: '2025',
    category: 'ai-ml',
    featured: true,
    role: 'Designer & developer',
    stack: ['Python', 'OpenAI API', 'FastAPI', 'Postgres'],
    summary:
      'Support agent that takes operator corrections, distills them into rules, and updates its responses over time — without retraining.',
    problem: 'TODO: small support team kept repeating the same corrections; retraining was out of budget.',
    architecture:
      'TODO: FastAPI · Postgres for correction memory · OpenAI for embedding + drafting · rule store as JSON.',
    challenges: [
      'TODO: keeping corrections auditable',
      'TODO: avoiding silent drift in tone',
    ],
    outcome:
      'TODO: replace with a real metric. Placeholder — handled X% of tier-1 tickets after 30 days of corrections.',
    links: [{ label: 'GitHub', href: 'https://github.com/himanshursharma2004' }],
  },
];

export const projectCategories: { id: ProjectCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All work' },
  { id: 'web', label: 'Web' },
  { id: 'ai-ml', label: 'AI / ML' },
  { id: 'hardware', label: 'Hardware' },
];