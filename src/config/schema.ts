import { site, exams, faqs, summit, photos } from './site';
import type { Product } from './catalog';

/** JSON-LD builders. Items with missing data are omitted rather than faked. */

const orgId = `${site.url}/#org`;
const personId = `${site.url}/#dr-k`;

export function orgSchema() {
  return {
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
}

export function breadcrumbSchema(name: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name, item: url },
    ],
  };
}

const toOffer = (p: Product) =>
  p.price && p.href ? { '@type': 'Offer', name: p.name, price: p.price.replace(/[^0-9.]/g, ''), priceCurrency: 'USD', url: p.href } : null;

/** A Course with one Offer per product that has a price and a booking link. */
export function courseSchema(name: string, description: string, url: string, products: Product[] = []) {
  const offers = products.map(toOffer).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url: new URL(url, site.url).toString(),
    provider: { '@id': orgId },
    ...(offers.length && { offers }),
  };
}

export function homeSchema(): object[] {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name: 'Kehinde Elisha',
    honorificPrefix: 'Dr.',
    jobTitle: 'Founder & lead instructor',
    description: 'FNP, PMHNP-BC, MSc Info, Legal Nurse Consultant',
    worksFor: { '@id': orgId },
    ...(photos.portrait && { image: new URL(photos.portrait.src.src, site.url).toString() }),
  };

  const courses = exams.map((e) => courseSchema(`${e.name} Board Exam Review`, e.blurb, e.href));

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs
      .filter((f) => f.a)
      .map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return [person, ...courses, faqPage, ...summitSchema()];
}

export function summitSchema(): object[] {
  if (!summit.startDate) return [];
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: summit.name,
      startDate: summit.startDate,
      eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
      location: [
        { '@type': 'Place', name: 'Kalahari Resort', address: { '@type': 'PostalAddress', addressRegion: 'VA', addressCountry: 'US' } },
        { '@type': 'VirtualLocation', url: new URL(summit.href, site.url).toString() },
      ],
      organizer: { '@id': orgId },
      url: new URL(summit.href, site.url).toString(),
    },
  ];
}
