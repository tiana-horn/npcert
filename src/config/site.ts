/**
 * Single source of truth for owner-supplied content.
 *
 * Anything set to `null` (or an empty array) is HIDDEN on the page — we never
 * ship placeholder text. Fill a value in here and it appears everywhere it's used.
 * Items marked "CONFIRM" were taken from the current Wix site and need sign-off.
 */

import { catalog } from './catalog';

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

/**
 * Google reviews. `count` drives the stat under the hero; `items` drive the rotating
 * carousel below it (hidden while empty). Copy reviews word for word from the Google
 * Business Profile — never paraphrase or invent. Use first name + last initial.
 */
export const googleReviews = {
  count: 521,
  /** Average star rating as shown on Google, e.g. '4.9'. Shown with the count when set. */
  rating: '5.0' as string | null,
  /** Public link to the Google reviews (Business Profile → Share → reviews link). */
  url: 'https://www.google.com/search?q=np+certification+academy#lrd=0x89b64115bf51dcd3:0xbac9d72f1ad98934,1,,,,' as string | null,
  /** Only 5-star reviews — the carousel header shows five stars. */
  items: [
    {
      name: 'Joy I.',
      excerpt: 'I highly recommend Dr. Kehinde’s PMHNP board review course to anyone preparing for the certification exam. The content was clear, organized, and focused on important exam topics.',
      quote: `I highly recommend Dr. Kehinde’s PMHNP board review course to anyone preparing for the certification exam.
The content was clear, organized, and focused on important exam topics. Dr. Kehinde was also supportive, encouraging, and genuinely invested in helping her students succeed.
This course was definitely worth it, and I am very grateful for all the guidance and resources provided.`,
    },
    {
      name: 'Christine X.',
      excerpt: 'Dr Elisha K’s review has been amazing. I like how it provides a more structural learning with biweekly class and canvas with recommended plans for studying.',
      quote: `Dr Elisha K’s review has been amazing. I like how it provides a more structural learning with biweekly class and canvas with recommended plans for studying. I do not come from a psych background so having that extra support is crucial, especially when trying to prepare myself for future practice. I also really appreciate the extras given each week from LMR to TOAD. Highly recommend!`,
    },
    {
      name: 'Carine N.',
      excerpt: 'Dr. K’s NPcertified class was incredibly helpful in preparing for the PMHNP board exam. Her teaching style is unique. She breaks down complex psychiatric concepts and connects them to everyday life, making them easier to understand and retain.',
      quote: `Dr. K’s NPcertified class was incredibly helpful in preparing for the PMHNP board exam. Her teaching style is unique. She breaks down complex psychiatric concepts and connects them to everyday life, making them easier to understand and retain.
The 6-week system is very effective because you go through each domain twice. If something doesn’t click the first time, the repetition ensures it makes sense the second time.
Her LMR review sessions are interactive and engaging, especially with the focus on timing training you to read and answer questions within one minute. That strategy was extremely helpful during my actual board exam and helped me stay mindful of my time.
If you’re preparing for your PMHNP boards and want a structured, supportive, and effective approach, I highly recommend reaching out to Dr. K. At NP certification Academy.
You won’t regret it!`,
    },
    {
      name: 'Lissette W.',
      excerpt: 'Dr. K’s program is an excellent resource for anyone preparing for the ANCC exam. The material is comprehensive, well-organized, and up to date, making it easier to understand and retain key concepts.',
      quote: `Dr. K’s program is an excellent resource for anyone preparing for the ANCC exam. The material is comprehensive, well-organized, and up to date, making it easier to understand and retain key concepts. The content is presented in a clear and practical way, which helps bridge the gap between theory and real-world clinical application.
What I appreciated most is how focused the program is on what you truly need to know to succeed on the exam. It streamlines complex information and highlights high-yield topics, allowing you to study efficiently without feeling overwhelmed. The teaching style is engaging and supportive, which helps build both confidence and competence.
Overall, I highly recommend studying with Dr. K. This program provides the structure, clarity, and guidance needed to feel well-prepared and confident going into the ANCC exam.`,
    },
    {
      name: 'Derick M.',
      quote: `Dr. K effectively elucidated the fundamentals of the PMHNP exam. The class ensured that all participants were adequately prepared. I am delighted to have been a part of the PMHNP review class, as it provided me with valuable insights and knowledge.`,
    },
  ] as {
    /** Full review, word for word. Line breaks become paragraphs. */
    quote: string;
    /** Optional verbatim opening shown in the carousel, with "Read full review" to expand. */
    excerpt?: string;
    name: string;
    when?: string;
  }[],
};

/** Photos: put files in /public/images and set the path. Missing → monogram panel. */
export const photos = {
  hero: null as null | { src: string; alt: string; width: number; height: number },
  portrait: null as null | { src: string; alt: string; width: number; height: number },
};

/** Internal routes (see reference/CLAUDE_CODE_HANDOVER_1.md §1b). */
export const routes = {
  home: '/',
  pmhnp: '/pmhnp',
  fnp: '/fnp-agnp',
  agacnp: '/agacnp',
  nclex: '/nclex-and-certifications',
  lmr: '/last-minute-review',
  qbank: '/question-banks',
  schedule: '/schedule',
  mentorship: '/mentorship-ceus',
  books: '/books',
  summit: '/summit-2026',
  login: '/login',
  confidentPrescriber: '/confident-prescriber',
  book: '/book',
} as const;

export type NavKey = 'home' | 'pmhnp' | 'fnp' | 'agacnp' | 'nclex' | 'lmr' | 'qbank' | 'schedule' | 'other';

export const mainNav: { key: NavKey; label: string; href: string }[] = [
  { key: 'pmhnp', label: 'PMHNP', href: routes.pmhnp },
  { key: 'fnp', label: 'FNP / AGNP', href: routes.fnp },
  { key: 'agacnp', label: 'AGACNP', href: routes.agacnp },
  { key: 'nclex', label: 'NCLEX & certs', href: routes.nclex },
  { key: 'lmr', label: 'Last Minute Review', href: routes.lmr },
  { key: 'qbank', label: 'Question banks', href: routes.qbank },
  { key: 'schedule', label: 'Schedule', href: routes.schedule },
];

export const utilityNav = [
  { label: 'Summit 2026', href: routes.summit },
  { label: 'Mentorship & CEUs', href: routes.mentorship },
  { label: 'Books', href: routes.books },
];

export const links = {
  /** Thinkific classroom. The /login page links here. */
  classroom: 'https://kehinde-s-site-79b3.thinkific.com/users/sign_in',
  freeTrialPmhnp: 'https://www.signupgenius.com/go/10C0D4AA9AE29A0F4C52-64636770-free',
  freeTrialFnp: 'https://www.signupgenius.com/go/10C0D4AA9AE29A0F4C52-62916546-free',
  sampleLecture: 'https://youtu.be/P4uZ6i2M938',
  whatsapp: 'https://chat.whatsapp.com/IJlEPutKiRHA3b7hVrrb24',
  confidentPrescriber: '/confident-prescriber',
};

export const social = [
  { label: 'Instagram', href: 'https://www.instagram.com/drkehindeelisha/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@npcertificationacademyllc' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@npcertificationacademy' },
  { label: 'Facebook group', href: 'https://www.facebook.com/groups/httpswww.facebook.comgroups317253332913398' },
  { label: 'X', href: 'https://x.com/llc_np56929' },
];

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
    price: catalog.pmhnpCrashAncc.price,
    href: routes.pmhnp,
    linkLabel: 'See PMHNP schedule',
    featured: true,
  },
  {
    id: 'fnp-agnp',
    name: 'FNP / AGNP',
    blurb: 'ANCC & AANP. Full live review or the 4-week FNP crash course.',
    price: catalog.fnpIntensive.price,
    href: routes.fnp,
    linkLabel: 'See FNP/AGNP options',
  },
  {
    id: 'agacnp',
    name: 'AGACNP',
    blurb: 'ANCC & AACN acute care review, taught from years of ICU practice.',
    price: catalog.agacnpFastTrack.price,
    href: routes.agacnp,
    linkLabel: 'See AGACNP review',
  },
  {
    id: 'nclex',
    name: 'NCLEX RN / PN',
    blurb: 'Next Generation NCLEX review for 2026, with clinical-judgment case practice.',
    price: catalog.nclexSelfPaced.price,
    href: routes.nclex,
    linkLabel: 'See NCLEX review',
  },
];

export type Format = {
  id: string;
  name: string;
  price: string | null;
  /** Small label after the price, e.g. "PMHNP Premium". */
  priceNote?: string;
  bullets: string[];
  cta: { label: string; href: string };
  variant: 'primary' | 'teal' | 'secondary';
  featured?: boolean;
};

export const formats: Format[] = [
  {
    id: 'group',
    name: 'Live group review',
    price: catalog.pmhnpPremiumAncc.price,
    priceNote: 'PMHNP Premium',
    bullets: ['6 weeks · 2 live classes a week', 'Slides, Last Minute Review & Canvas access', 'Live or hybrid schedule', 'WhatsApp study community'],
    cta: { label: 'Reserve my seat', href: `${routes.pmhnp}#plans` },
    variant: 'primary',
  },
  {
    id: 'one-three',
    name: 'ONE:THREE private review',
    price: catalog.pmhnpOneThree.price,
    bullets: ['Private sessions with Dr. K', 'Study plan built around your gaps', 'Best for repeat test-takers & ADHD', 'Everything in group review'],
    cta: { label: 'Book a private review', href: catalog.pmhnpOneThree.href! },
    variant: 'teal',
    featured: true,
  },
  {
    id: 'lmr',
    name: 'Last Minute Review',
    price: catalog.fnpIntensive.price && `From ${catalog.fnpIntensive.price}`,
    bullets: ['For exams in the next few weeks', 'High-yield topics only', 'Timed practice exam'],
    cta: { label: 'Start cramming smart', href: routes.lmr },
    variant: 'secondary',
  },
];

/** Real, permissioned testimonials only. Section hides when empty. */
export const testimonials: { quote: string; name: string; credential: string; result: string }[] = [];

export const sisterOrgs: { name: string; tagline: string; href: string | null }[] = [
  { name: 'SeriSphere Center', tagline: 'Behavioral & integrative health', href: null },
  { name: 'IACA', tagline: "Int'l Association for Clinician Advancement", href: null },
  { name: 'Confident Prescriber', tagline: 'Weekly prescribing support for NPs', href: links.confidentPrescriber },
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
  href: routes.summit,
  /** ISO date for Event schema; schema is skipped until set. */
  startDate: null as string | null,
};

export const trialExamOptions = ['PMHNP (ANCC / AANP)', 'FNP / AGNP', 'AGACNP', 'NCLEX RN / PN'];
