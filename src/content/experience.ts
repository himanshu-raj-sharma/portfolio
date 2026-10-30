export type Experience = {
  role: string;
  org: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};

export const experiences: Experience[] = [
  {
    role: 'Full Stack Web Developer',
    org: 'Shailvika Livings',
    location: 'India',
    start: 'Aug,2026',
    end: 'Oct,2026',
    bullets: [
      'Collaborated with stakeholders to define and deliver full-stack features, API integrations, and deployments meeting specific project requirements.',
      'Architected and developed diverse full-stack web applications from the ground up, utilizing modern front-end and back-end technologies.',
      'Streamlined deployment processes and integrated APIs, enhancing the overall functionality and performance of web applications.',
    ],
  },
];