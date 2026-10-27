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
    subtitle: 'Real-Time Fatigue Monitoring — capstone',
    year: '2025',
    category: 'ai-ml',
    featured: true,
    role: 'Team lead · ML, backend, hardware integration',
    stack: ['Python', 'PyTorch', 'OpenCV', 'FastAPI', 'React', 'WebSockets'],
    summary:
      'Real-time computer vision system that processes webcam frames to detect fatigue and alertness levels — using eye/face landmarks and an LSTM classifier with sub-100ms end-to-end inference.',
    problem:
      'Driver fatigue causes thousands of accidents yearly. Existing solutions are expensive wearables or coarse detection. This project provides a non-intrusive, real-time alternative using just a webcam.',
    architecture:
      'OpenCV + MediaPipe extracts facial landmarks from webcam frames; an LSTM classifier (PyTorch) processes the sequence and outputs an alertness score; FastAPI serves predictions over WebSockets to a live React dashboard.',
    challenges: [
      'Processing webcam frames in real time while keeping inference under 100ms — solved by optimising the MediaPipe pipeline and batching frames.',
      'Training an LSTM with limited labelled data — addressed through data augmentation and careful windowing of the input sequences.',
      'Deploying on a resource-constrained environment — optimised model size and used WebSockets for efficient real-time communication.',
    ],
    outcome:
      'Achieved sub-100ms end-to-end inference latency. Demonstrated to faculty and reviewed as part of the capstone project.',
    links: [
      { label: 'GitHub', href: 'https://github.com/himanshu-raj-sharma/ACFM-System' },
      { label: 'Case study', href: '/projects/acfm-net' },
    ],
  },
  {
    slug: 'punyakart-foundation',
    title: 'Punyakart Foundation',
    subtitle: 'NGO Donation Platform',
    year: '2024',
    category: 'web',
    featured: true,
    role: 'Solo developer · design + build',
    stack: ['MongoDB', 'Express', 'React', 'Node.js', 'Razorpay'],
    summary:
      'Public donation portal for a small NGO — campaign pages, secure Razorpay payment integration, and a transparent donation ledger.',
    problem:
      'The foundation relied on a manual UPI flow with no visibility into recurring donors and no automated receipts. There was no way to track donation history or issue 80G certificates.',
    architecture:
      'React SPA frontend · Express REST API · MongoDB for data persistence · Razorpay for secure payment processing · Email and WhatsApp notifications for real-time donor updates.',
    challenges: [
      'Integrating Razorpay securely with proper webhook validation and handling payment confirmations reliably.',
      'Building the 80G certificate workflow so donors could self-serve without manual intervention from volunteers.',
    ],
    outcome:
      'Live at punyakart.com. Processed donations successfully with automated receipts delivered to donors.',
    links: [
      { label: 'Live site', href: 'https://punyakart.com' },
      { label: 'GitHub', href: 'https://github.com/himanshu-raj-sharma' },
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