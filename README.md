# NP Certification Academy — website

Homepage rebuild ("Option 1 — Clinical Navy"). Astro + Tailwind, static output, served by a Cloudflare Worker that also handles the free-trial form.

Design source and requirements: [`reference/`](reference/) (`CLAUDE_CODE_HANDOVER.md`, `option-1-homepage-reference.html`).

## Commands

| | |
|---|---|
| `npm run dev` | Astro dev server (page only; the form API isn't available) |
| `npm run preview` | Build + run the real Worker locally at http://localhost:8787 (page + form API) |
| `npm run deploy` | Build + deploy to Cloudflare |

First deploy: `npx wrangler login` once, then `npm run deploy`. The `LEADS` KV namespace is created automatically.

## Editing content

**All owner-supplied content lives in [`src/config/site.ts`](src/config/site.ts).** Anything set to `null` (or an empty list) is hidden on the page — placeholder text is never shipped. Fill a value in and redeploy:

- prices (`exams[].price`, `formats[].price`), cohort date / seats, nurses-taught count, verified pass rate
- testimonials (the section stays hidden until at least one exists)
- photos (`photos.hero`, `photos.portrait` → put files in `public/images/`)
- CNE provider number, installment-plan FAQ answer, summit date (enables Event schema), OG image
- hero copy (A/B test slot) and every outbound link

Items marked `CONFIRM` in that file were taken from the current Wix site and need the owner's sign-off.

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
- [ ] Build the inner pages, or keep them on Wix under a subdomain — today every track/checkout link points to the existing Wix pages
- [ ] Custom domain + 301 redirects from old Wix URLs (add a `_redirects` file to `public/` once the new URLs exist)
- [ ] Lighthouse run against the deployed URL
