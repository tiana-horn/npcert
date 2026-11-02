# NP Certification Academy — website

Site rebuild ("Option 1 — Clinical Navy"): homepage plus 11 inner pages. Astro + Tailwind, static output, **hosted on Wix** (Wix Headless static hosting). The free-trial form is a Wix Form. The previous Cloudflare Worker host (`worker/`, `wrangler.jsonc`) is kept running as a fallback until the domain moves; see [Cloudflare (legacy)](#cloudflare-legacy).

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
| `npm run deploy:wix` | Build + publish to Wix (replaces the whole site) |
| `npm run deploy` | Build + deploy to the legacy Cloudflare Worker |

### Deploys

There's no CI: after committing to `main`, publish from your machine with `npm run deploy:wix`. One-time login first: `npx -y -p node@24 -p @wix/cli@latest wix login` (the Wix CLI needs Node ≥ 24.18; `-p node@24` fetches one just for that command).

- Live (Wix): https://headless-azxstdgmuwo-favoreddigital01-1410.wix-site-host.com
- Dashboard: https://manage.wix.com/dashboard/7a561b7f-d690-4984-b863-cef071dc9fbd
- Site ID `7a561b7f-d690-4984-b863-cef071dc9fbd`, OAuth client (appId) `7f79c315-340c-4b4b-aed3-341d86877dad`

**Wix static hosting serves exact file paths only.** `/pmhnp` is a 404; `/pmhnp.html` works. So every internal link, canonical tag and sitemap URL carries `.html` (see `routes` in `src/config/site.ts`). The host also has no server-side redirects and drops files without an extension, so the old-Wix-URL 301s in `worker/redirects.ts` do **not** work on Wix yet (see the launch checklist).

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

A **Wix Form** ("Free trial class"). The page renders whatever fields the form has in the Wix dashboard, so the owner can rename, reorder, add or require fields, or change the thank-you text, with no code change. Values, validation (in Wix's wording) and the submission run through Wix's browser modules, vendored in [`public/js/wix/`](public/js/wix/). The page code is [`public/js/trial-form.js`](public/js/trial-form.js). Submissions also create or update a CRM contact from the email.

- Edit the form: https://manage.wix.com/dashboard/7a561b7f-d690-4984-b863-cef071dc9fbd/wix-forms/form/f0bb3fe9-0eeb-4cbe-bd72-20370eeab101
- Submissions (export to CSV there): …/wix-forms/form/f0bb3fe9-0eeb-4cbe-bd72-20370eeab101/submissions
- Email notifications, automations, spam protection: Wix dashboard → Forms / Automations
- The form ID is `wix.trialFormId` in `src/config/site.ts`

The target-exam field is now a date (Wix Forms has no month picker); "a rough date is fine" is its help text.

## Analytics

Clicks on elements with `data-track` push events to `window.dataLayer` (GTM/GA4) and Cloudflare Zaraz if present: `cta_click`, `exam_card_click`, `checkout_start`, `tel_click`, `trial_form_submit`. Add GTM or turn on Zaraz to collect them; nothing is sent until one is installed.

## Cloudflare (legacy)

`worker/` + `wrangler.jsonc` are the previous host: static assets, `POST /api/trial` → KV, `GET /api/leads` CSV, and the old-Wix-URL 301s. It's still deployed with the pre-Wix build and is **not** updated by `deploy:wix`. Don't run `npm run deploy` with the current code: the form now posts to Wix, which only accepts the Wix origin. Remove `worker/`, `wrangler.jsonc` and the KV namespace once the domain serves from Wix.

## Launch checklist (not done yet)

- [ ] Owner content in `site.ts` (see above); confirm contact details and `CONFIRM` links
- [ ] Turn on email notifications / an automation for the Wix trial form (dashboard → Automations)
- [ ] Move any leads still in Cloudflare KV: `curl -H "Authorization: Bearer $TOKEN" https://<worker host>/api/leads -o leads.csv` (needs `ADMIN_TOKEN` set)
- [ ] Owner answers for the site inconsistencies listed in the handover (PMHNP hours, AGACNP Fast Track length and domains, NCLEX Upgrade length, PMH-RN / Nurse Executive booking links)
- [ ] Still missing: class times, book details, Q-bank prices, summit dates/prices/speakers/agenda, ONE:THREE price, CNE provider number
- [ ] Connect the custom domain to the Wix site (dashboard → Domains), then add the domain to the OAuth app's allowed origins so the trial form can submit from it
- [ ] Old Wix URL 301s ([`worker/redirects.ts`](worker/redirects.ts)): Wix SEO Redirects didn't take effect on the `wix-site-host.com` address. Re-test them once the domain is connected. If they still don't work, the site needs Wix's server-rendered Astro hosting (`@wix/astro` adapter), which can do redirects and clean URLs
- [ ] Lighthouse run against the deployed URL
