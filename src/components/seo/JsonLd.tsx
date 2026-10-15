import { siteConfig } from '@content/site';
import { faqs } from '@content/faq';

export function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteConfig.url}/#person`,
        name: siteConfig.name,
        url: siteConfig.url,
        jobTitle: siteConfig.role,
        description: siteConfig.description,
        address: { '@type': 'PostalAddress', addressLocality: 'Dehradun', addressCountry: 'IN' },
        sameAs: [siteConfig.social.github, siteConfig.social.linkedin].filter(Boolean),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        inLanguage: 'en',
        publisher: { '@id': `${siteConfig.url}/#person` },
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${siteConfig.url}/#service`,
        name: `${siteConfig.name} — Freelance Web Development`,
        provider: { '@id': `${siteConfig.url}/#person` },
        areaServed: 'Worldwide',
        serviceType: ['Web development', 'App development', 'Cloud deployment'],
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteConfig.url}/#faq`,
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}