# Handover: NP Certification Academy — Homepage Redesign (Option 1, "Clinical Navy")

**Goal:** Rebuild the homepage of https://www.npcertificationacademy.com/ (currently Wix) as a modern, fast, conversion-focused page that keeps credibility with nurse practitioners.

**Primary conversion:** visitor picks an exam → reserves a seat / books a review.
**Secondary conversion:** free-class signup (email capture).

**Reference markup:** `option-1-homepage-reference.html` (sent with this file). It's an export from a design tool. Ignore `<script src="./support.js">`, the `<x-dc>` / `<helmet>` wrappers and the `text/x-dc` script block. Everything inside `<x-dc>` is plain HTML with inline styles and is the visual source of truth. Move the inline styles into your styling system (Tailwind or CSS modules); don't ship them inline.

---

## 1. Suggested stack (adjust to the target environment)

- Static-first framework: **Astro** or **Next.js (static export)**. The page is content, not an app.
- Tailwind CSS with the tokens in §2 mapped to the theme.
- Lighthouse targets: Performance ≥ 90 on mobile, Accessibility ≥ 95, CLS < 0.1.
- Images: AVIF/WebP, explicit width/height, lazy-load below the fold. The hero image gets `fetchpriority="high"`.
- No layout shift from fonts: self-host Plus Jakarta Sans or use `display=swap` with a size-adjusted fallback.

> Open question for the owner: stay on Wix (recreate the design in the Wix editor) or move to a coded site. This handover assumes a coded site.

---

## 2. Design tokens

| Token | Value | Use |
|---|---|---|
| `ink` | `#0B1F3A` | Primary text, dark sections, footer |
| `teal` | `#0E6E6B` | Accent, links, highlight borders, stats |
| `teal-dark` | `#0A5452` | Eyebrow labels, link text on light teal |
| `teal-tint` | `#E1F0EF` | Badges, summit band |
| `teal-wash` | `#F2F9F8` | Featured pricing card background |
| `amber` | `#F5B544` | **Primary CTA background only** (text on it = `ink`) |
| `surface` | `#F4F7FA` | Alternating section background |
| `placeholder` | `#D9E2EC` | Image placeholders |
| `border` | `#D5DDE7` / `#E3E8EF` | Card borders / dividers |
| `body-muted` | `#3B4658` | Body copy on white |
| `muted-on-dark` | `#C9D3E0` | Body copy on `ink` |
| `fine-print` | `#4A5568` | Footnotes, captions |

- **Font:** Plus Jakarta Sans 400/500/600/700/800 (Google Fonts).
- **Type scale:** H1 `clamp(36px, 5vw, 58px)` / 800 / lh 1.08 / tracking -0.02em. H2 `clamp(30px, 3.6vw, 42px)` / 800 / lh 1.15. Body 18–19px / lh 1.6. Card body 15px. Eyebrow 14px / 700 / uppercase / tracking 0.06em.
- **Layout:** max-width 1200px container, 24px side gutter, 88px vertical section padding (go to ~56px on mobile).
- **Radius:** buttons 10–12px, cards 16–18px, hero image and trial panel 20–24px, badges pill.
- **Buttons:** Primary = amber bg + ink text. Secondary = white bg + 2px ink border. Alternative-primary (private review only) = teal bg + white text. Minimum height 44px (52px in the hero).
- **Icons:** inline stroke SVGs (checkmarks). No emoji.
- **Avoid:** gradient washes and stock "AI" visuals. Credibility comes from real photos of Dr. K teaching.

---

## 3. Page structure (top → bottom)

1. **Utility bar** (ink): "Next PMHNP live cohort starts [START DATE] · [X] seats left" with click-to-call `tel:13479016037` and a Student login link. *Only show the seats count if it's real and kept up to date.*
2. **Header / nav:** logo + "Board review by Dr. Kehinde Elisha". Links: Exam reviews (#exams), Schedule & pricing (#formats), Question bank, CE & mentorship, About Dr. K (#about). Amber CTA "Find my review" → #exams. **Mobile:** collapse to a hamburger and keep the CTA visible. Make the header sticky on scroll.
3. **Hero** (surface bg, 2 columns, stacks on mobile):
   - Badge: PMHNP · FNP · AGNP · AGACNP · NCLEX
   - H1: "Pass your NP board exam on the first try — taught by a clinician, not a slideshow."
   - Sub: live reviews, practice exams and mentorship for ANCC and AANP boards; 18+ years in practice and 12+ years in ICUs at Duke, NewYork-Presbyterian, Montefiore and Johns Hopkins.
   - CTAs: "Choose your exam" (primary → #exams), "Try a free class" (secondary → #trial)
   - Checklist: CNE approved by Kansas State Board of Nursing · Live classes, not just recordings · ADD/ADHD-friendly support
   - Right column: photo of Dr. K with an overlapping name/credentials card.
4. **Proof strip** (4 stats): 18+ yrs · [X,XXX] nurses & NPs taught · [XX%] first-attempt pass rate* · 4 learning styles.
5. **Exam picker** (#exams): 4 cards (PMHNP is featured with a "Most popular" badge and teal border; then FNP/AGNP, AGACNP, NCLEX RN/PN). Each card shows the name, a one-line format description, "From [$PRICE]" and a link to that track's page. The whole card is clickable. Underneath: quick links to Last Minute Review, Question bank only, and Books.
6. **How it works** (ink bg, 3 steps with an amber top rule): Join a live cohort → Practice like the real exam → Get mentored to the finish.
7. **Learning styles / anxiety section:** copy plus a 2×2 grid (Visual, Auditory, Reading/writing, Hands-on). Link to #trial.
8. **Testimonials:** 3 cards (PMHNP, FNP, AGACNP) with the pass-rate footnote underneath.
9. **Formats & pricing** (#formats): Live group review / ONE:THREE private review (featured, teal) / Last Minute Review. Below: link to the 3-week PMHNP Upgrade Package for returning students.
10. **About** (#about): portrait plus bio. Sister-organization tiles: SeriSphere Center, IACA, Confident Prescriber.
11. **Free trial capture** (#trial, ink panel): Email, Exam (select), Target exam month, "Send me the free class" button. Microcopy: "We reply within 48 hours. No spam."
12. **FAQ:** native `<details>` accordion. Questions: affiliation; CE credit; failed before; review expires before exam; installments.
13. **Summit band** (teal tint): Clinician Advancement Summit 2026, Kalahari Resort VA + virtual, with a "Get summit details" CTA.
14. **Footer** (ink): address, exam links, student links, contact, non-affiliation disclaimer, Kansas Board CNE line, © 2026 NP Certification Academy LLC.

All copy is in the reference file. Use it verbatim unless the owner edits it.

---

## 4. Content the owner must supply (do NOT invent)

Every `[BRACKETED]` item in the reference is a placeholder. Build the page so these values come from one config/CMS file, not hard-coded across components.

- [ ] Prices for every exam card and format card
- [ ] Next cohort start date(s), and a seats count only if it's real
- [ ] Number of nurses/NPs taught (verified)
- [ ] **First-attempt pass rate with methodology** (N students, cohort year). The current site's "99.9% pass rate" has no source and should be removed. Leave the stat out entirely until a verified number exists.
- [ ] 3+ real testimonials with written permission (name format, credential, exam, month/year)
- [ ] Photos: Dr. K teaching (hero) and a portrait (about)
- [ ] Kansas State Board of Nursing CNE provider number and contact hours per course
- [ ] Payment plan / refund policy (FAQ)
- [ ] Logo file (the design uses a temporary "NP" monogram)

**Never ship placeholder text.** If a value is missing at launch, hide that element.

---

## 5. Integrations / link mapping

The current site routes purchases through **Stripe, Acuity Scheduling and SignupGenius**. Keep those, but send every CTA to the right one.

| CTA | Destination (confirm with owner) |
|---|---|
| Exam cards / "Reserve my seat" | Track page → Stripe checkout or Acuity |
| "Book a private review" | Acuity (ONE:THREE) |
| "Start cramming smart" | Last Minute Review checkout |
| Free trial form | Email platform / CRM (owner to choose; replaces the SignupGenius link). Store exam + target month as fields so follow-up emails can be segmented. |
| Student login | Existing class login URL |
| Sample lecture | Existing YouTube sample PMHNP lecture |
| Summit | Clinician Advancement Summit 2026 page |
| Sister orgs | confidentprescriber.com, plus IACA and SeriSphere URLs (owner to confirm) |

**Contact (use these only):** phone 1-347-901-6037; email info@npcertificationacademy.com; address 44679 Endicott Drive, Suite 332, Ashburn, VA 20147. The current site lists several emails and an older Brambleton address, so confirm with the owner before launch.

**Existing pages to keep (and redirect from old Wix URLs with 301s):** All Schedule, Login to Class, Books, AGACNP, FNP/AGNP, Question Bank, Last Minute Review, NCLEX & Other Certs, Bridge & Mentorship & CEUs, Clinician Advancement Summit 2026, PMHNP Upgrade Package, ONE review for PMHNP.

---

## 6. Conversion & tracking requirements

- Fire analytics events for: `cta_click` (with location + label), `exam_card_click` (track), `trial_form_submit` (exam, target month), `tel_click`, `checkout_start`.
- On mobile, add a sticky bottom bar with "Choose your exam" plus a call icon. It appears after the user scrolls past the hero.
- Form: inline validation, a success state on the same page (no redirect), honeypot spam protection, and a "we reply within 48 hours" confirmation.
- Make the A/B test slot easy: keep the hero H1/sub/CTA copy in config.

## 7. SEO & schema

- Title: "NP Board Exam Review — PMHNP, FNP, AGACNP & NCLEX | NP Certification Academy"
- Meta description: lead with the tracks, live format, Dr. K's credentials and the free class. **No unverified pass-rate claims.**
- One H1. Logical H2 per section.
- JSON-LD: `EducationalOrganization`, `Person` (Dr. Kehinde Elisha), `Course` per track (add `offers` once prices exist), `FAQPage` for the FAQ, `Event` for the Summit.
- Open Graph image: hero photo with the headline.

## 8. Accessibility

- Text contrast meets WCAG AA. Keep the tokens as given; don't use amber for text on white.
- Every `<input>` has a `<label>`. Buttons are real `<button>`s and links are real `<a href>`s.
- Visible focus rings (2px teal outline, offset 2px).
- The FAQ uses `<details>`/`<summary>`; the mobile menu needs `aria-expanded` and focus trapping.
- Respect `prefers-reduced-motion` if you add any animation (keep animation minimal).

## 9. Compliance / credibility guardrails

- Keep the disclaimer: "Not affiliated with AANP, ANCC or any certification body." Show it in the FAQ and footer.
- Don't use ANCC/AANP or hospital logos. Institutions are named in text only, as work history.
- Testimonials must be real and permissioned. Stats must be verifiable and footnoted.

## 10. Acceptance checklist

- [ ] Matches the reference at 1440px and 390px widths; no horizontal scroll at 320px
- [ ] Every CTA goes to a real destination
- [ ] No `[PLACEHOLDER]` text visible in production
- [ ] Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, SEO ≥ 95
- [ ] Analytics events firing; form delivers to the chosen platform
- [ ] 301 redirects from old Wix URLs in place
