export type SkillCategory = {
  title: string;
  caption: string;
  items: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    caption: 'Craft',
    items: [
      'TypeScript',
      'React',
      'Next.js (App Router)',
      'Tailwind CSS',
    ],
  },
  {
    title: 'Backend',
    caption: 'Server',
    items: ['Node.js', 'Express', 'REST APIs', 'Auth (JWT / OAuth)', 'Serverless functions'],
  },
  {
    title: 'Databases',
    caption: 'Data',
    items: ['MongoDB', 'PostgreSQL', 'Prisma', 'Redis'],
  },
  {
    title: 'Cloud / DevOps',
    caption: 'Ship',
    items: ['AWS (EC2, S3, Lambda)', 'Vercel', 'Render', 'Docker basics', 'GitHub Actions', 'Nginx'],
  },
  {
    title: 'AI / ML',
    caption: 'Intelligent',
    items: ['Python', 'scikit-learn', 'OpenAI APIs', 'Prompt engineering', 'Agent workflows'],
  },
];