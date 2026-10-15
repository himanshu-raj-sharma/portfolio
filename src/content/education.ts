export type Education = {
  degree: string;
  school: string;
  location: string;
  specialization?: string;
  start: string;
  end: string;
  notes?: string[];
};

export const education: Education[] = [
  {
    degree: 'B.Tech · Computer Science & Engineering',
    school: 'DIT University',
    location: 'Dehradun, India',
    specialization: 'Cloud Computing & Blockchain',
    start: 'TODO: 2022',
    end: 'Expected 2026',
    notes: [
      'Coursework: distributed systems, cloud architecture, blockchain fundamentals, ML.',
      'Capstone: ACFM-Net — see projects.',
    ],
  },
  {
    degree: 'Diploma · Electronics Engineering',
    school: 'TODO: institution name',
    location: 'TODO: city, India',
    start: 'TODO: 2018',
    end: 'TODO: 2021',
    notes: ['Foundation in circuits, embedded systems, and signal processing.'],
  },
];