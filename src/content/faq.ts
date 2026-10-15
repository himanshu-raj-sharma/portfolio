export type FAQItem = { question: string; answer: string };

export const faqs: FAQItem[] = [
  {
    question: 'How do you price projects?',
    answer:
      'Fixed-price for defined scopes, weekly rate for ongoing work. I share a written estimate after the discovery call — no surprises.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'A small marketing site ships in 1–3 weeks. A full-stack web app MVP usually takes 6–10 weeks. I commit to a date and miss it rarely.',
  },
  {
    question: 'Which tech stack do you prefer?',
    answer:
      'Next.js + TypeScript + Tailwind on the front, Node.js or Python on the back, MongoDB or Postgres for data, Vercel/Render/AWS to host. I will push back if a different choice fits the problem better.',
  },
  {
    question: 'How many revisions are included?',
    answer:
      'Two rounds of revisions per deliverable are baked into the estimate. Beyond that I bill hourly so the work stays fair for both of us.',
  },
  {
    question: 'What happens after launch?',
    answer:
      'Every project ships with a 30-day hand-off window. After that I offer monthly maintenance or a one-off retainer — whatever fits.',
  },
  {
    question: 'Do you sign NDAs and contracts?',
    answer:
      'Yes. Standard MSA + project SOW before kickoff. Happy to use your legal team’s paper or provide mine.',
  },
  {
    question: 'Can you work with my existing designer / agency?',
    answer:
      'Frequently. I’m happy to integrate with in-house teams and partner agencies — clear roles up front make it work.',
  },
];