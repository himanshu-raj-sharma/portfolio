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
    start: '2023',
    end: '2026',
    notes: [
      'Specializing in back-end and full-stack development.',
      'Capstone: ACFM-Net — see projects.',
    ],
  },
  {
    degree: 'Diploma · Electronics Engineering',
    school: 'Government Polytechnic College',
    location: 'Gaya, India',
    start: '2019',
    end: '2022',
    notes: ['Foundation in circuits, embedded systems, and signal processing.'],
  },
];