/**
 * 301s from the old Wix URLs to the new routes (handover §1b).
 * Keys are lowercase paths without a trailing slash.
 */
export const redirects: Record<string, string> = {
  '/home': '/',
  '/home-1': '/',
  '/copy-of-pmhnp-ancc-aanp-mentors-1': '/pmhnp',
  '/copy-of-pmhnp-ancc-aanp-plus-more': '/pmhnp', // old "Question bank" tab actually held PMHNP pricing
  '/copy-of-pmhnp-exam-review-all-np-c-1': '/pmhnp',
  '/copy-of-fnp-agnp-ancc-aanp-4': '/fnp-agnp',
  '/copy-of-agacnp-ancc-aacn-2': '/agacnp',
  '/copy-of-agacnp-ancc-aacn-3': '/agacnp',
  '/copy-of-nclex-cert-pmh-rn-rn-lpn': '/nclex-and-certifications',
  '/copy-of-schedule-and-syllabus-3': '/schedule',
  '/copy-of-schedule-and-syllabus-4': '/schedule',
  '/copy-of-nclex-cert-pmh-rn-rn-lpn-1': '/mentorship-ceus',
  '/copy-of-home': '/books',
  '/clinician-advancement-summit': '/summit-2026',
  '/login-to-class': '/login',
};

/** Returns the redirect target for a request URL, or null. Query strings are kept. */
export function redirectFor(url: URL): string | null {
  const path = url.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const target = redirects[path];
  if (target) return target + url.search;
  // Clean URLs: drop a trailing slash on any other path (e.g. /pmhnp/ → /pmhnp).
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) return path + url.search;
  return null;
}
