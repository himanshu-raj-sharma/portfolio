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
    role: 'Web Development Intern',
    org: 'Doon Animal Welfare Foundation',
    location: 'Dehradun, India',
    start: 'TODO: Month YYYY',
    end: 'TODO: Month YYYY',
    bullets: [
      'TODO: Built and shipped a public-facing donation flow that volunteers could maintain themselves.',
      'TODO: Improved mobile performance from Lighthouse ~50 to ~90 by deferring third-party scripts and rebuilding the donate funnel.',
      'TODO: Set up a small Node/Express service that automated weekly reconciliation reports and saved ~4 hours of manual work per week.',
    ],
  },
];