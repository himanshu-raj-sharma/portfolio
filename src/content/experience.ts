export type Experience = {
  role: string;
  org: string;
  /** Optional qualifier shown after the role, e.g. "freelance". */
  tag?: string;
  location?: string;
  start: string;
  end: string;
  bullets: string[];
};

export const experiences: Experience[] = [
  {
    role: 'Full Stack Web Developer',
    org: 'Doon Animal Welfare | Shalvika Livings',
    tag: 'freelance',
    start: 'Aug 2026',
    end: 'Present',
    bullets: [
      'Collaborate with stakeholders to define and deliver full-stack features, API integrations and application deployments.',
      'Develop web applications using modern frontend and backend technologies based on project requirements.',
      'Support deployment workflows and API integrations to improve application functionality.',
    ],
  },
  {
    role: 'Cloud Computing Intern',
    org: 'SmartED Innovations',
    start: 'Apr 2025',
    end: 'Jul 2025',
    bullets: [
      'Built and deployed a serverless application using managed cloud services.',
      'Designed a cloud data pipeline to process and analyze datasets.',
    ],
  },
];
