# NP Certification Academy — website

Site rebuild ("Option 1 — Clinical Navy"): homepage plus 11 inner pages. Astro + Tailwind, static output, served by a Cloudflare Worker that also handles the free-trial form and the 301s from the old Wix URLs.

Design source and requirements: [`reference/`](reference/) — `CLAUDE_CODE_HANDOVER_1.md` (current) and `option-1-pages/` (one design file per page).

| Route | Page |
|---|---|
| `/` | Homepage |
| `/pmhnp`, `/fnp-agnp`, `/agacnp`, `/nclex-and-certifications` | Exam tracks |
| `/last-minute-review`, `/question-banks`, `/schedule` | |
| `/mentorship-ceus`, `/books`, `/summit-2026`, `/login` | |
| `/confident-prescriber` | Rebuild of confidentprescriber.com |
| `/book` | In-house booking **preview** (replaces Acuity links; see below) |

## Commands

| | |
|---|---|
| `npm run dev` | Astro dev server (page only; the form API isn't available) |
| `npm run preview` | Build + run the real Worker locally at http://localhost:8787 (page + form API) |
| `npm run deploy` | Build + deploy to Cloudflare |

### Deploys

There's no CI: after committing to `main`, deploy from your machine with `npm run deploy` (`npx wrangler login` once first).

## Editing content

- **Every price and booking/checkout link: [`src/config/catalog.ts`](src/config/catalog.ts).** Taken from the current Wix site — confirm before launch. A product with `href: null` shows a "Call to book" button instead of a dead link.
- **Everything else owner-supplied: [`src/config/site.ts`](src/config/site.ts)**, plus small, clearly marked data blocks at the top of `schedule`, `summit-2026`, `books`, `agacnp` and `mentorship-ceus` pages.

Anything set to `null` (or an empty list) is hidden on the page — placeholder text is never shipped. Fill a value in and redeploy:

- prices (`exams[].price`, `formats[].price`), cohort date / seats, nurses-taught count, verified pass rate
- testimonials (the section stays hidden until at least one exists)
- photos (`photos.hero`, `photos.portrait` → put files in `public/images/`)
- CNE provider number, installment-plan FAQ answer, summit date (enables Event schema), OG image
- hero copy (A/B test slot) and every outbound link

Items marked `CONFIRM` in that file were taken from the current Wix site and need the owner's sign-off.

## Booking preview (`/book`)

Every booking button that used to go to Acuity now opens `/book?service=<key>`, which walks through Acuity's steps — service → date & time → your info → payment → confirmation. It's **visual only**, for client review: availability is sample data (except the real AGACNP, Bridge, Growth and Real-Time Collab times), nothing is stored, card fields are disabled, and a banner says so. The page is `noindex` and left out of the sitemap.

- Services, categories, durations, schedules and intake questions: [`src/config/booking.ts`](src/config/booking.ts)
- The original Acuity URL for each product is kept as `legacyHref` in `catalog.ts`
- Stripe checkouts (FNP/AGNP Self-Paced, question banks, summit passes) are unchanged

## Free-trial form

`POST /api/trial` (see [`worker/index.ts`](worker/index.ts)) validates the input, silently drops honeypot hits, and stores each lead in the `LEADS` KV namespace.

- **Forward to an email platform/CRM:** `npx wrangler secret put LEAD_WEBHOOK_URL` (e.g. a Zapier/Make/Mailchimp hook). Each lead is POSTed as JSON: `{email, exam, month, submittedAt, country, referer}`.
- **Download leads as CSV:** `npx wrangler secret put ADMIN_TOKEN`, then
  `curl -H "Authorization: Bearer $TOKEN" https://<site>/api/leads -o leads.csv`

## Analytics

Clicks on elements with `data-track` push events to `window.dataLayer` (GTM/GA4) and Cloudflare Zaraz if present: `cta_click`, `exam_card_click`, `checkout_start`, `tel_click`, `trial_form_submit`. Add GTM or turn on Zaraz to collect them; nothing is sent until one is installed.

## Launch checklist (not done yet)

- [ ] Owner content in `site.ts` (see above); confirm contact details and `CONFIRM` links
- [ ] Decide the lead destination (`LEAD_WEBHOOK_URL`)
- [ ] Owner answers for the site inconsistencies listed in the handover (PMHNP hours, AGACNP Fast Track length and domains, NCLEX Upgrade length, PMH-RN / Nurse Executive booking links)
- [ ] Still missing: class times, book details, Q-bank prices, summit dates/prices/speakers/agenda, ONE:THREE price, CNE provider number
- [ ] Point the custom domain at the Worker (old Wix URLs already 301 — see [`worker/redirects.ts`](worker/redirects.ts))
- [ ] Lighthouse run against the deployed URL
