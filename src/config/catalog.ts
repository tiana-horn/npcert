/**
 * Every price and booking/checkout URL on the site lives here.
 *
 * Prices and URLs were taken from the current Wix site (Nov 2026) — CONFIRM with the owner before launch.
 * `price: null` hides the price; `href: null` turns the button into "Call to book".
 */

const ACUITY = 'https://app.acuityscheduling.com/schedule.php?owner=23270809&appointmentType=';
const acuityCategory = (name: string) => `${ACUITY}category:${encodeURIComponent(name)}`;
const acuityForm = (name: string) => `https://app.acuityscheduling.com/schedule/3d18a681/?categories[]=${encodeURIComponent(name)}`;

export type Product = {
  name: string;
  price: string | null;
  /** Shown after the price, e.g. " /month". */
  priceSuffix?: string;
  href: string | null;
};

const p = (name: string, price: string | null, href: string | null, priceSuffix?: string): Product => ({ name, price, href, priceSuffix });

export const catalog = {
  // PMHNP — the current site books ANCC and AANP through separate Acuity categories.
  pmhnpCrashAncc: p('PMHNP Crash Course (ANCC)', '$275', `${ACUITY}72080101`),
  pmhnpCrashAanp: p('PMHNP Crash Course (AANP)', '$275', acuityCategory('AANP Crash course by Dr. K')),
  pmhnpPremiumAncc: p('PMHNP Premium Plan (ANCC)', '$799', acuityCategory('A PMHNP Group Review Course with 500 Question Bank')),
  pmhnpPremiumAanp: p('PMHNP Premium Plan (AANP)', '$799', acuityCategory('AANP PMHNP EXAM REVIEW ')),
  pmhnpExtended: p('PMHNP Extended Package', '$999', acuityCategory('EXTENDED PACKAGE- ANCC PMHNP EXAM REVIEW')),
  pmhnpOneThree: p('ONE:THREE private review', null, acuityCategory('A ONE : THREE Bundled private review course')),
  pmhnpUpgrade: p('PMHNP Upgrade Package', '$399', acuityCategory('A PMHNP Exam Review Upgrade Package (For Students with Expired 6-Week Review) | 3-Week Extension | 2 Classes per Week | Content Reinforcement, LMR, Exam Strategy Review & Question Breakdown | Current or Returning Students Only')),
  pmhnpLmrAncc: p('PMHNP Last Minute Review (ANCC)', '$120', acuityCategory('A Last Minute Review ( ANCC PMHNP) by Dr. Kehinde Elisha')),
  pmhnpLmrAanp: p('PMHNP Last Minute Review (AANP)', '$119', acuityCategory('A Last Minute Review ( AANP) PMHNP) by Dr. Kehinde Elisha')),
  detailedDiagnosis: p('Detailed Diagnosis', '$175', acuityCategory('SELF PACED COURSES WITH 1HR ORIENTATION BY DR. KEHINDE ELISHA'), ' /month'),
  psychopharm: p('Psychopharmacology', '$299', `${ACUITY}75786365`, ' /month'),

  // FNP / AGNP
  fnpComprehensive: p('FNP/AGNP Comprehensive', '$850', acuityCategory('FNP/AGNP ANCC EXAM REVIEW ')),
  fnpSelfPaced: p('FNP/AGNP Self-Paced', '$599', 'https://book.stripe.com/14A28s5PX9Bo2tA8nE2Fa0h'),
  fnpIntensive: p('FNP/AGNP Last Minute Intensive', '$250', acuityCategory('A Fast track - FNP/AGNP ANCC EXAM REVIEW ')),

  // AGACNP
  agacnpPremium: p('AGACNP Premium Plan', '$850', acuityCategory('AGACNP EXAM REVIEW (AACN/ANCC)')),
  agacnpFastTrack: p('AGACNP Fast Track', '$699', acuityCategory('AGACNP FAST TRACK PACKAGE - Short term course')),

  // NCLEX & RN certifications
  nclexPremium: p('NCLEX Premium Plan', '$759', acuityForm('A NEW GENERATION NCLEX RN/PN')),
  nclexSelfPaced: p('NCLEX Self-Paced Crash Course', '$499', acuityCategory('A Self-Paced NCLEX Review (RN/PN)')),
  nclexUpgrade: p('NCLEX Upgrade', '$399', acuityCategory('A NCLEX Review  Upgrade Package (For Students with Expired 6-Week Review) | 3-Week Extension | 2 Classes per Week | Content Reinforcement, LMR, Exam Strategy Review & Question Breakdown | Current or Returning Students Only')),
  ccrn: p('CCRN review', '$599', acuityCategory('CCRN Exam Review')),
  /** The current site links this to the CCRN booking page by mistake — needs its own link. */
  pmhRn: p('ANCC PMH-RN review', '$599', null),
  nurseExecutive: p('Nurse Executive review', '$795', null),

  // Question banks (Stripe). Prices per bank aren't on the current site; "from $69" is.
  qbankFrom: '$69',
  qbankPmhnp: p('PMHNP question bank', null, 'https://buy.stripe.com/9B66oI92914Sd8ebzQ2Fa0b'),
  qbankFnp: p('FNP/AGNP question bank', null, 'https://buy.stripe.com/4gM7sMfqxeVI1pwdHY2Fa0f'),
  qbankAgacnp: p('AGACNP question bank', null, 'https://buy.stripe.com/7sY3cw0vD3d07NU33k2Fa0c'),
  qbankNclexRn: p('NCLEX RN question bank', null, 'https://buy.stripe.com/dRm28s9295l81pwavM2Fa0d'),
  qbankNclexPn: p('NCLEX PN question bank', null, 'https://buy.stripe.com/14A4gA92928Wb06bzQ2Fa0g'),

  // Mentorship & CE
  bridge: p('Bridge & Mentorship Program', '$599', acuityForm('BRIDGE PROGRAM for students that passed their boards')),
  growth: p('Clinician Growth Package', '$199', acuityForm('CLINICIANS GROWTH PACKAGE')),

  // Summit
  summitInPerson: p('Summit in-person pass', null, 'https://buy.stripe.com/8x2eVea6dbJw9W27jA2Fa0i'),
  summitVirtual: p('Summit virtual pass', null, 'https://buy.stripe.com/14AcN6a6dfZM0lscDU2Fa0k'),
} as const;

export type CatalogKey = { [K in keyof typeof catalog]: (typeof catalog)[K] extends Product ? K : never }[keyof typeof catalog];
