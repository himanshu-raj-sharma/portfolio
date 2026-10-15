export type ProcessStep = {
  step: string;
  title: string;
  body: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Discovery call',
    body: 'A 30-minute call to understand goals, constraints and timeline. No pitch — just questions.',
  },
  {
    step: '02',
    title: 'Proposal & timeline',
    body: 'A short written proposal with scope, milestones, price, and what is and isn’t included.',
  },
  {
    step: '03',
    title: 'Build with weekly demos',
    body: 'Short weekly demos with a working URL, not slide decks. You see progress every Friday.',
  },
  {
    step: '04',
    title: 'Launch & support',
    body: 'Deploy, monitor, and a 30-day hand-off window for fixes and small tweaks. Longer support optional.',
  },
];