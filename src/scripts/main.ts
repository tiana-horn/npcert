// ---------- Analytics ----------
// Pushes to dataLayer (GTM/GA4) and Cloudflare Zaraz if either is installed; no-op otherwise.
type Props = Record<string, string | undefined>;
declare global {
  interface Window {
    dataLayer?: unknown[];
    zaraz?: { track: (name: string, props?: Props) => void };
  }
}

export function track(event: string, props: Props = {}) {
  (window.dataLayer ||= []).push({ event, ...props });
  window.zaraz?.track(event, props);
}

document.addEventListener('click', (e) => {
  const el = (e.target as Element).closest<HTMLElement>('[data-track]');
  if (!el) return;
  const { track: name = '', location, label, trackName } = el.dataset;
  const props: Props = { location, label: label ?? el.textContent?.trim() };
  if (name === 'exam_card_click') props.track = trackName;
  if (name === 'checkout_start') props.product = trackName;
  track(name, props);
});

// ---------- Mobile menu (aria-expanded + focus trap) ----------
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');

function setMenu(open: boolean) {
  if (!toggle || !menu) return;
  menu.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  toggle.querySelector('[data-icon-open]')!.toggleAttribute('hidden', open);
  toggle.querySelector('[data-icon-close]')!.toggleAttribute('hidden', !open);
  if (open) menu.querySelector<HTMLElement>('a')?.focus();
}

toggle?.addEventListener('click', () => setMenu(menu!.hidden));
menu?.addEventListener('click', (e) => {
  if ((e.target as Element).closest('a')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (!menu || menu.hidden) return;
  if (e.key === 'Escape') {
    setMenu(false);
    toggle?.focus();
    return;
  }
  if (e.key !== 'Tab') return;
  const focusables = [toggle!, ...menu.querySelectorAll<HTMLElement>('a')];
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  } else if (!focusables.includes(document.activeElement as HTMLElement)) {
    e.preventDefault();
    first.focus();
  }
});
matchMedia('(min-width: 64rem)').addEventListener('change', (m) => m.matches && setMenu(false));

// ---------- Mobile sticky bar (after hero) ----------
const bar = document.querySelector<HTMLElement>('[data-sticky-bar]');
const heroEl = document.querySelector('[data-hero]');
if (bar && heroEl) {
  new IntersectionObserver(([entry]) => {
    const visible = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    bar.dataset.visible = String(visible);
    bar.setAttribute('aria-hidden', String(!visible));
    bar.querySelectorAll('a').forEach((a) => (a.tabIndex = visible ? 0 : -1));
  }).observe(heroEl);
}

// ---------- Free-trial form ----------
const form = document.querySelector<HTMLFormElement>('[data-trial-form]');
const success = document.querySelector<HTMLElement>('[data-trial-success]');

const messages: Record<string, (el: HTMLInputElement | HTMLSelectElement) => string> = {
  email: (el) => (el.validity.valueMissing ? 'Enter your email.' : 'Enter a valid email, like you@example.com.'),
  exam: () => 'Choose the exam you’re preparing for.',
  month: () => 'Choose the month you plan to test.',
};

function validateField(el: HTMLInputElement | HTMLSelectElement): boolean {
  const ok = el.checkValidity();
  el.setAttribute('aria-invalid', String(!ok));
  const msg = form!.querySelector<HTMLElement>(`[data-error-for="${el.name}"]`);
  if (msg) msg.textContent = ok ? '' : messages[el.name]?.(el) ?? 'Required.';
  return ok;
}

if (form && success) {
  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[required]')];
  fields.forEach((el) => {
    el.addEventListener('blur', () => el.value && validateField(el));
    el.addEventListener('input', () => el.getAttribute('aria-invalid') === 'true' && validateField(el));
  });

  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const defaultStatus = status.textContent;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalid = fields.filter((el) => !validateField(el));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    button.disabled = true;
    status.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      track('trial_form_submit', { exam: data.exam, target_month: data.month });
      form.hidden = true;
      success.classList.replace('hidden', 'flex');
      success.focus();
    } catch {
      status.textContent = `Something went wrong. Please try again, or email us at info@npcertificationacademy.com.`;
      button.disabled = false;
      return;
    }
    status.textContent = defaultStatus;
  });
}
