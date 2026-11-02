/**
 * Single source of truth for owner-supplied content.
 *
 * Anything set to `null` (or an empty array) is HIDDEN on the page — we never
 * ship placeholder text. Fill a value in here and it appears everywhere it's used.
 * Items marked "CONFIRM" were taken from the current Wix site and need sign-off.
 */

const WIX = 'https://www.npcertificationacademy.com';
const ACUITY = 'https://app.acuityscheduling.com/schedule.php?owner=23270809&appointmentType=category:';

export const site = {
  url: 'https://www.npcertificationacademy.com',
  name: 'NP Certification Academy',
  legalName: 'NP Certification Academy LLC',
  title: 'NP Board Exam Review — PMHNP, FNP, AGACNP & NCLEX | NP Certification Academy',
  description:
    'Live PMHNP, FNP/AGNP, AGACNP and NCLEX board reviews led by Dr. Kehinde Elisha, FNP, PMHNP-BC — 18+ years in practice and 12+ years in top ICUs. Practice exams, mentorship and a free trial class.',
  ogImage: null as string | null, // e.g. '/og.jpg' (1200×630, hero photo + headline)

  phone: { display: '1-347-901-6037', tel: '13479016037' },
  email: 'info@npcertificationacademy.com', // CONFIRM: current site lists several
  address: { street: '44679 Endicott Drive, Suite 332', city: 'Ashburn', region: 'VA', zip: '20147' }, // CONFIRM

  /** Kansas State Board of Nursing CNE provider number, e.g. 'LT0000-0000'. */
  cneProviderNumber: null as string | null,
};

/** A/B-test slot: hero copy lives here, not in the component. */
export const hero = {
  badge: 'PMHNP · FNP · AGNP · AGACNP · NCLEX',
  h1: 'Pass your NP board exam on the first try — taught by a clinician, not a slideshow.',
  sub: 'Live review courses, practice exams and one-on-one mentorship for ANCC and AANP boards, led by Dr. Kehinde Elisha — 18+ years in practice and 12+ years in ICUs at Duke, NewYork-Presbyterian, Montefiore and Johns Hopkins.',
  primaryCta: { label: 'Choose your exam', href: '#exams' },
  secondaryCta: { label: 'Try a free class', href: '#trial' },
};

/** Utility bar. Bar text is hidden unless `nextCohortStart` is set; seats only if real & maintained. */
export const cohort = {
  track: 'PMHNP',
  nextCohortStart: null as string | null, // e.g. 'Jan 12, 2027'
  seatsLeft: null as number | null,
};

export const stats = {
  yearsExperience: '18+ yrs',
  nursesTaught: null as string | null, // verified count, e.g. '3,200'
  /** Leave null until verified. Footnote renders automatically when set. */
  passRate: null as null | { value: string; cohortYear: string; reportedN: number },
};

/** Photos: put files in /public/images and set the path. Missing → monogram panel. */
export const photos = {
  hero: null as null | { src: string; alt: string; width: number; height: number },
  portrait: null as null | { src: string; alt: string; width: number; height: number },
};

export const links = {
  studentLogin: `${WIX}/login-to-class`,
  allSchedule: `${WIX}/copy-of-schedule-and-syllabus-3`,
  questionBank: `${WIX}/copy-of-pmhnp-ancc-aanp-plus-more`,
  ceMentorship: `${WIX}/copy-of-nclex-cert-pmh-rn-rn-lpn-1`,
  books: `${WIX}/copy-of-home`,
  lastMinuteReview: `${WIX}/last-minute-review`,
  sampleLecture: 'https://youtu.be/P4uZ6i2M938', // CONFIRM this is the sample PMHNP lecture
  summit: `${WIX}/clinician-advancement-summit`,
  oneThree: `${ACUITY}A%20ONE%20%3A%20THREE%20Bundled%20private%20review%20course`,
  pmhnpUpgrade: `${ACUITY}A%20PMHNP%20Exam%20Review%20Upgrade%20Package%20%28For%20Students%20with%20Expired%206-Week%20Review%29%20%7C%203-Week%20Extension%20%7C%202%20Classes%20per%20Week%20%7C%20Content%20Reinforcement%2C%20LMR%2C%20Exam%20Strategy%20Review%20%26%20Question%20Breakdown%20%7C%20Current%20or%20Returning%20Students%20Only`,
};

export type Exam = {
  id: string;
  name: string;
  blurb: string;
  price: string | null;
  href: string;
  linkLabel: string;
  featured?: boolean;
};

export const exams: Exam[] = [
  {
    id: 'pmhnp',
    name: 'PMHNP',
    blurb: 'ANCC & AANP. 6-week live review, 2 classes a week, question bank and content-outline workbook.',
    price: null,
    href: links.allSchedule, // CONFIRM: no dedicated PMHNP page found on the current site
    linkLabel: 'See PMHNP schedule',
    featured: true,
  },
  {
    id: 'fnp-agnp',
    name: 'FNP / AGNP',
    blurb: 'ANCC & AANP. Full live review or the 4-week FNP crash course.',
    price: null,
    href: `${WIX}/copy-of-fnp-agnp-ancc-aanp-4`,
    linkLabel: 'See FNP/AGNP options',
  },
  {
    id: 'agacnp',
    name: 'AGACNP',
    blurb: 'ANCC & AACN acute care review, taught from years of ICU practice.',
    price: null,
    href: `${WIX}/copy-of-agacnp-ancc-aacn-2`,
    linkLabel: 'See AGACNP review',
  },
  {
    id: 'nclex',
    name: 'NCLEX RN / PN',
    blurb: 'Next Generation NCLEX review for 2026, with clinical-judgment case practice.',
    price: null,
    href: `${WIX}/copy-of-nclex-cert-pmh-rn-rn-lpn`,
    linkLabel: 'See NCLEX review',
  },
];

export type Format = {
  id: string;
  name: string;
  price: string | null;
  bullets: string[];
  cta: { label: string; href: string };
  variant: 'primary' | 'teal' | 'secondary';
  featured?: boolean;
};

export const formats: Format[] = [
  {
    id: 'group',
    name: 'Live group review',
    price: null,
    bullets: ['6 weeks · 2 live classes a week', 'Replays, workbook, question bank', 'Live or hybrid schedule', 'WhatsApp study community'],
    cta: { label: 'Reserve my seat', href: links.allSchedule },
    variant: 'primary',
  },
  {
    id: 'one-three',
    name: 'ONE:THREE private review',
    price: null,
    bullets: ['Private sessions with Dr. K', 'Study plan built around your gaps', 'Best for repeat test-takers & ADHD', 'Everything in group review'],
    cta: { label: 'Book a private review', href: links.oneThree },
    variant: 'teal',
    featured: true,
  },
  {
    id: 'lmr',
    name: 'Last Minute Review',
    price: null,
    bullets: ['For exams in the next few weeks', 'High-yield topics only', 'Timed practice exam'],
    cta: { label: 'Start cramming smart', href: links.lastMinuteReview },
    variant: 'secondary',
  },
];

/** Real, permissioned testimonials only. Section hides when empty. */
export const testimonials: { quote: string; name: string; credential: string; result: string }[] = [];

export const sisterOrgs: { name: string; tagline: string; href: string | null }[] = [
  { name: 'SeriSphere Center', tagline: 'Behavioral & integrative health', href: null },
  { name: 'IACA', tagline: "Int'l Association for Clinician Advancement", href: null },
  { name: 'Confident Prescriber', tagline: 'Weekly prescribing support for NPs', href: 'https://www.confidentprescriber.com/' },
];

/** FAQ answers set to null are hidden (and left out of FAQPage schema). */
export const faqs: { q: string; a: string | null }[] = [
  {
    q: 'Are you affiliated with ANCC or AANP?',
    a: 'No. NP Certification Academy is an independent review provider and is not affiliated with AANP, ANCC or any certification body. Our content follows their published test outlines.',
  },
  {
    q: 'Do I earn continuing education credit?',
    a:
      'Yes. Our continuing nursing education is approved by the Kansas State Board of Nursing.' +
      (site.cneProviderNumber ? ` Provider number ${site.cneProviderNumber}.` : ''),
  },
  {
    q: "I've failed before. Is this right for me?",
    a: 'Many of our students are repeat test-takers. The ONE:THREE private review builds a plan around exactly where you lost points.',
  },
  {
    q: 'What if my 6-week review ends before my exam?',
    a: 'Current and returning students can add the 3-week Upgrade Package with two classes a week.',
  },
  { q: 'Can I pay in installments?', a: null },
];

export const summit = {
  name: 'Clinician Advancement Summit 2026',
  detail: 'IACA & NP Certification Academy · Live at Kalahari Resort, VA and virtual',
  href: links.summit,
  /** ISO date for Event schema; schema is skipped until set. */
  startDate: null as string | null,
};

export const trialExamOptions = ['PMHNP (ANCC / AANP)', 'FNP / AGNP', 'AGACNP', 'NCLEX RN / PN'];
