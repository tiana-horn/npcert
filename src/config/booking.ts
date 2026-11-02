/**
 * In-house booking flow (PREVIEW). Mimics the Acuity steps — service → date & time →
 * your info → payment → confirmation — for client review. Nothing is stored and no
 * payment is taken; availability below is SAMPLE data except where noted as real.
 */
import { catalog, type CatalogKey } from './catalog';

/** Weekday (0 = Sun … 6 = Sat) → start times (ET). */
type Weekly = { weekly: Partial<Record<0 | 1 | 2 | 3 | 4 | 5 | 6, string[]>> };
type Schedule = Weekly | { lastFriday: string[] } | { anytime: true };

type Intake = { name: string; label: string; type: 'text' | 'month' | 'select'; options?: string[]; required?: boolean };

type ServiceMeta = {
  group: string;
  duration: string;
  /** Label for the date step, e.g. "Choose your start date". */
  dateLabel?: string;
  schedule: Schedule;
  intake?: Intake[];
};

const examMonth: Intake = { name: 'examMonth', label: 'Target exam month', type: 'month', required: true };
const role: Intake = { name: 'role', label: 'Current role or credential', type: 'text' };
const start = 'Choose your start date';

// Sample availability unless marked "real".
const weeknights = (time = '7:00 PM'): Weekly => ({ weekly: { 2: [time], 4: [time] } });
const pmhnpPairs: Weekly = { weekly: { 0: ['10:00 AM'], 2: ['7:00 PM'], 4: ['7:00 PM'], 6: ['10:00 AM'] } };
const officeHours: Weekly = { weekly: { 1: ['10:00 AM', '1:00 PM', '6:00 PM'], 3: ['10:00 AM', '1:00 PM', '6:00 PM'], 5: ['10:00 AM', '1:00 PM'] } };

export const groups = [
  'PMHNP Board Review',
  'FNP / AGNP Board Review',
  'AGACNP Board Review',
  'NCLEX & RN Certifications',
  'Mentorship & CEUs',
  'Confident Prescriber',
  'Self-paced courses',
] as const;

export const serviceMeta: Partial<Record<CatalogKey, ServiceMeta & { group: (typeof groups)[number] }>> = {
  pmhnpCrashAncc: { group: 'PMHNP Board Review', duration: '1 day · 8 hours live', schedule: { weekly: { 6: ['9:00 AM'] } }, intake: [examMonth] },
  pmhnpCrashAanp: { group: 'PMHNP Board Review', duration: '1 day · 8 hours live', schedule: { weekly: { 6: ['9:00 AM'] } }, intake: [examMonth] },
  pmhnpPremiumAncc: { group: 'PMHNP Board Review', duration: '6 weeks · 2 live classes a week', dateLabel: start, schedule: pmhnpPairs, intake: [examMonth] },
  pmhnpPremiumAanp: { group: 'PMHNP Board Review', duration: '6 weeks · 2 live classes a week', dateLabel: start, schedule: pmhnpPairs, intake: [examMonth] },
  pmhnpExtended: { group: 'PMHNP Board Review', duration: '8 weeks of live sessions', dateLabel: start, schedule: pmhnpPairs, intake: [examMonth, { name: 'exam', label: 'Which exam?', type: 'select', options: ['ANCC', 'AANP'], required: true }] },
  pmhnpOneThree: { group: 'PMHNP Board Review', duration: 'Private sessions with Dr. K', schedule: officeHours, intake: [examMonth, { name: 'attempts', label: 'Have you taken the exam before?', type: 'select', options: ['No, first attempt', 'Yes, once', 'Yes, more than once'] }] },
  pmhnpUpgrade: { group: 'PMHNP Board Review', duration: '3 weeks · 2 classes a week', dateLabel: start, schedule: weeknights(), intake: [examMonth] },
  pmhnpLmrAncc: { group: 'PMHNP Board Review', duration: 'Last Minute Review · live', schedule: { weekly: { 6: ['10:00 AM'] } }, intake: [examMonth] },
  pmhnpLmrAanp: { group: 'PMHNP Board Review', duration: 'Last Minute Review · 3 hours live', schedule: { weekly: { 6: ['2:00 PM'] } }, intake: [examMonth] },

  fnpComprehensive: { group: 'FNP / AGNP Board Review', duration: '8 weeks · live on Zoom · 50+ hours', dateLabel: start, schedule: { weekly: { 1: ['7:00 PM'], 3: ['7:00 PM'] } }, intake: [examMonth, { name: 'exam', label: 'Which exam?', type: 'select', options: ['ANCC FNP', 'AANP FNP', 'ANCC AGNP', 'AANP AGNP'], required: true }] },
  fnpIntensive: { group: 'FNP / AGNP Board Review', duration: '2 days live', schedule: { weekly: { 6: ['9:00 AM'] } }, intake: [examMonth] },

  // Real: Tue & Thu, 8:15–10:30 PM ET.
  agacnpPremium: { group: 'AGACNP Board Review', duration: '8 weeks · live on Zoom · 70+ hours', dateLabel: start, schedule: weeknights('8:15 PM'), intake: [examMonth, { name: 'exam', label: 'Which exam?', type: 'select', options: ['ANCC AGACNP-BC', 'AACN ACNPC-AG'], required: true }] },
  agacnpFastTrack: { group: 'AGACNP Board Review', duration: '4 weeks · 20 hours live', dateLabel: start, schedule: weeknights('8:15 PM'), intake: [examMonth] },

  nclexPremium: { group: 'NCLEX & RN Certifications', duration: '8 weeks · live Zoom lectures', dateLabel: start, schedule: { weekly: { 3: ['7:00 PM'] } }, intake: [{ name: 'nclex', label: 'RN or PN?', type: 'select', options: ['NCLEX-RN', 'NCLEX-PN'], required: true }, examMonth] },
  nclexUpgrade: { group: 'NCLEX & RN Certifications', duration: 'Review extension · 2 classes a week', dateLabel: start, schedule: weeknights() },
  ccrn: { group: 'NCLEX & RN Certifications', duration: '4 weeks', dateLabel: start, schedule: { weekly: { 1: ['7:00 PM'] } }, intake: [examMonth] },
  pmhRn: { group: 'NCLEX & RN Certifications', duration: '3 days', dateLabel: start, schedule: { weekly: { 5: ['9:00 AM'] } }, intake: [examMonth] },

  // Real (confidentprescriber.com): Bridge Tue 6 PM or Sat 4:30 PM; Growth Tue 7:45 PM.
  bridge: { group: 'Mentorship & CEUs', duration: '6 months · 25 CEUs', dateLabel: start, schedule: { weekly: { 2: ['6:00 PM'], 6: ['4:30 PM'] } }, intake: [role] },
  growth: { group: 'Mentorship & CEUs', duration: '3 months · 20 CEUs', dateLabel: start, schedule: { weekly: { 2: ['7:45 PM'] } }, intake: [role] },

  cpBridgeClinic: { group: 'Confident Prescriber', duration: '6 months live · 25 CEUs', dateLabel: start, schedule: { weekly: { 2: ['6:00 PM'], 6: ['4:30 PM'] } }, intake: [role] },
  cpGrowth: { group: 'Confident Prescriber', duration: '3 months · 20 CEUs', dateLabel: start, schedule: { weekly: { 2: ['7:45 PM'] } }, intake: [role] },
  cpClinicStartup: { group: 'Confident Prescriber', duration: '2 days live · last Friday of the month', schedule: { lastFriday: ['10:00 AM'] }, intake: [role] },
  // Real: Mondays 10 AM–12 PM ET.
  cpRealTimeCollab: { group: 'Confident Prescriber', duration: '2-hour live session', schedule: { weekly: { 1: ['10:00 AM'] } }, intake: [role] },
  cpCareerCoaching: { group: 'Confident Prescriber', duration: '1-hour 1:1 session', schedule: officeHours, intake: [role] },
  cpClinicalPsychotherapy: { group: 'Confident Prescriber', duration: 'Master class', schedule: officeHours, intake: [role] },
  cpClinicalSim: { group: 'Confident Prescriber', duration: 'Master class', schedule: officeHours, intake: [role] },

  detailedDiagnosis: { group: 'Self-paced courses', duration: 'Monthly · self-paced + 4-hour live review', dateLabel: start, schedule: { anytime: true } },
  psychopharm: { group: 'Self-paced courses', duration: 'Monthly · self-paced', dateLabel: start, schedule: { anytime: true } },
  nclexSelfPaced: { group: 'Self-paced courses', duration: '4 weeks of access', dateLabel: start, schedule: { anytime: true } },
  cpPsychopathology: { group: 'Self-paced courses', duration: '1 week with work slides · 10 CEUs', dateLabel: start, schedule: { anytime: true } },
  cpPsychopharm: { group: 'Self-paced courses', duration: '1 week with work slides · 10 CEUs', dateLabel: start, schedule: { anytime: true } },
  cpPsychAssessment: { group: 'Self-paced courses', duration: '1 week with work slides · 10 CEUs', dateLabel: start, schedule: { anytime: true } },
};

export type BookableService = ServiceMeta & {
  key: string;
  name: string;
  price: string | null;
  priceSuffix?: string;
};

/** Every catalog product that routes to /book, joined with its booking metadata. */
export const services: BookableService[] = (Object.keys(serviceMeta) as CatalogKey[])
  .filter((k) => catalog[k].href?.startsWith('/book'))
  .map((k) => ({ key: k, name: catalog[k].name, price: catalog[k].price, priceSuffix: catalog[k].priceSuffix, ...serviceMeta[k]! }));
