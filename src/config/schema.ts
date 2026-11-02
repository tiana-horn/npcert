import { site, exams, faqs, summit, photos } from './site';

/** JSON-LD for the homepage. Items with missing data are omitted rather than faked. */
export function buildSchema(): object[] {
  const orgId = `${site.url}/#org`;
  const personId = `${site.url}/#dr-k`;

  const org = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': orgId,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    telephone: `+1-${site.phone.display.replace(/^1-/, '')}`,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.zip,
      addressCountry: 'US',
    },
    founder: { '@id': personId },
  };

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name: 'Kehinde Elisha',
    honorificPrefix: 'Dr.',
    jobTitle: 'Founder & lead instructor',
    description: 'FNP, PMHNP-BC, MSc Info, Legal Nurse Consultant',
    worksFor: { '@id': orgId },
    ...(photos.portrait && { image: new URL(photos.portrait.src, site.url).toString() }),
  };

  const courses = exams.map((e) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${e.name} Board Exam Review`,
    description: e.blurb,
    url: e.href,
    provider: { '@id': orgId },
    ...(e.price && {
      offers: { '@type': 'Offer', price: e.price.replace(/[^0-9.]/g, ''), priceCurrency: 'USD', url: e.href },
    }),
  }));

  const visible = faqs.filter((f) => f.a);
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: visible.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const event = summit.startDate && {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: summit.name,
    startDate: summit.startDate,
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    location: [
      { '@type': 'Place', name: 'Kalahari Resort', address: { '@type': 'PostalAddress', addressRegion: 'VA', addressCountry: 'US' } },
      { '@type': 'VirtualLocation', url: summit.href },
    ],
    organizer: { '@id': orgId },
    url: summit.href,
  };

  return [org, person, ...courses, faqPage, ...(event ? [event] : [])];
}
