// Booking flow PREVIEW (see src/config/booking.ts). Client-side only: nothing is stored or sent.
import { track } from './main';

type Intake = { name: string; label: string; type: 'text' | 'month' | 'select'; options?: string[]; required?: boolean };
type Schedule = { weekly: Record<string, string[]> } | { lastFriday: string[] } | { anytime: true };
type Service = {
  key: string; name: string; price: string | null; priceSuffix?: string;
  group: string; duration: string; dateLabel?: string; schedule: Schedule; intake?: Intake[];
};

const root = document.querySelector<HTMLElement>('[data-booking]');
if (root) init(root);

function init(root: HTMLElement) {
  const services: Service[] = JSON.parse(root.querySelector('[data-services]')!.textContent!);
  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
  const indicators = [...root.querySelectorAll<HTMLElement>('[data-step-indicator]')];
  const panel = $('[data-panel]');
  const summary = $('[data-summary]');

  const DAY_MS = 86_400_000;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const firstBookable = new Date(today.getTime() + DAY_MS);
  const lastBookable = new Date(today.getTime() + 90 * DAY_MS);

  const state: { service?: Service; date?: Date; time?: string | null; info?: Record<string, string>; month: Date } = {
    month: new Date(firstBookable.getFullYear(), firstBookable.getMonth(), 1),
  };

  // ---------- helpers ----------
  const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const sameDay = (a?: Date, b?: Date) => !!a && !!b && a.toDateString() === b.toDateString();
  const isLastFriday = (d: Date) => d.getDay() === 5 && new Date(d.getTime() + 7 * DAY_MS).getMonth() !== d.getMonth();
  const isAnytime = (s: Service) => 'anytime' in s.schedule;
  const timesFor = (s: Service, d: Date): string[] | null => {
    if (d < firstBookable || d > lastBookable) return null;
    const sch = s.schedule;
    if ('anytime' in sch) return [];
    if ('lastFriday' in sch) return isLastFriday(d) ? sch.lastFriday : null;
    return sch.weekly[d.getDay()] ?? null;
  };
  const priceText = (s: Service) => (s.price ? `${s.price}${s.priceSuffix ?? ''}` : 'Quoted after booking');
  const whenText = () => {
    if (!state.date) return '—';
    return state.time ? `${fmtDate(state.date)} at ${state.time} ET` : `Starts ${fmtDate(state.date)}`;
  };

  // ---------- navigation ----------
  let current = 0;
  function goTo(step: number, focus = true) {
    current = step;
    steps.forEach((el, i) => (el.hidden = i !== step));
    indicators.forEach((el, i) => (el.dataset.state = i < step ? 'done' : i === step ? 'current' : 'todo'));
    indicators.forEach((el, i) => (i === step ? el.setAttribute('aria-current', 'step') : el.removeAttribute('aria-current')));
    summary.hidden = step === 0 || !state.service;
    renderSummary();
    if (focus) {
      panel.focus({ preventScroll: true });
      const top = panel.getBoundingClientRect().top + scrollY - 140;
      if (scrollY > top) scrollTo({ top, behavior: 'smooth' });
    }
    track('booking_step', { step: String(step + 1), service: state.service?.key });
  }

  function renderSummary() {
    const s = state.service;
    if (!s) return;
    $('[data-sum-name]').textContent = s.name;
    $('[data-sum-duration]').textContent = s.duration;
    $('[data-sum-price]').textContent = priceText(s);
    $('[data-sum-when-label]').textContent = isAnytime(s) ? 'Start' : 'When';
    $('[data-sum-when]').textContent = whenText();
  }

  function selectService(key: string, push = true) {
    const s = services.find((x) => x.key === key);
    if (!s) return false;
    state.service = s;
    state.date = undefined;
    state.time = undefined;
    state.month = new Date(firstBookable.getFullYear(), firstBookable.getMonth(), 1);
    if (push) history.replaceState(null, '', `?service=${encodeURIComponent(key)}`);
    $('[data-date-heading]').textContent = s.dateLabel ?? 'Select a date & time';
    renderCalendar();
    renderTimes();
    renderIntake();
    return true;
  }

  // ---------- step 2: calendar ----------
  const calendar = $('[data-calendar]');
  function renderCalendar() {
    const s = state.service!;
    const m = state.month;
    $('[data-month-label]').textContent = m.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    $<HTMLButtonElement>('[data-month-prev]').disabled = m <= new Date(firstBookable.getFullYear(), firstBookable.getMonth(), 1);
    $<HTMLButtonElement>('[data-month-next]').disabled = new Date(m.getFullYear(), m.getMonth() + 1, 1) > lastBookable;

    calendar.replaceChildren();
    const lead = m.getDay();
    for (let i = 0; i < lead; i++) calendar.append(Object.assign(document.createElement('span'), { role: 'gridcell' }));
    const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    for (let n = 1; n <= days; n++) {
      const d = new Date(m.getFullYear(), m.getMonth(), n);
      const open = timesFor(s, d) !== null;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = String(n);
      btn.disabled = !open;
      btn.setAttribute('aria-label', `${fmtDate(d)}${open ? ', available' : ', unavailable'}`);
      btn.setAttribute('aria-pressed', String(sameDay(d, state.date)));
      btn.className =
        'aspect-square min-h-10 rounded-full text-[15px] font-semibold border-0 font-[inherit] cursor-pointer ' +
        (sameDay(d, state.date)
          ? 'bg-teal text-white'
          : open
            ? 'bg-teal-tint text-teal-dark hover:bg-teal hover:text-white'
            : 'bg-transparent text-[#A9B6C8] cursor-default');
      btn.addEventListener('click', () => {
        state.date = d;
        state.time = undefined;
        renderCalendar();
        renderTimes();
        renderSummary();
        $<HTMLElement>('[data-times] button')?.focus();
      });
      const cell = Object.assign(document.createElement('span'), { role: 'gridcell' });
      cell.append(btn);
      calendar.append(cell);
    }
  }
  $('[data-month-prev]').addEventListener('click', () => {
    state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1);
    renderCalendar();
  });
  $('[data-month-next]').addEventListener('click', () => {
    state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1);
    renderCalendar();
  });

  function renderTimes() {
    const box = $('[data-times]');
    const label = $('[data-times-label]');
    box.replaceChildren();
    const s = state.service!;
    if (!state.date) {
      label.textContent = isAnytime(s) ? 'Pick any start date.' : 'Select a date to see times.';
      return;
    }
    label.textContent = state.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const times = timesFor(s, state.date) ?? [];
    const cont = () => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-primary text-base min-h-12 border-0 cursor-pointer font-[inherit]';
      b.textContent = 'Continue';
      b.addEventListener('click', () => goTo(2));
      return b;
    };
    if (times.length === 0) {
      // Self-paced: the date is the start date, no time slot.
      state.time = null;
      box.append(cont());
      renderSummary();
      return;
    }
    for (const t of times) {
      const row = document.createElement('div');
      row.className = 'flex gap-2';
      const b = document.createElement('button');
      b.type = 'button';
      const selected = state.time === t;
      b.setAttribute('aria-pressed', String(selected));
      b.className =
        'flex-1 min-h-12 rounded-[10px] text-base font-bold font-[inherit] cursor-pointer border-2 ' +
        (selected ? 'border-ink bg-ink text-white' : 'border-teal bg-white text-teal hover:bg-teal-wash');
      b.textContent = `${t} ET`;
      b.addEventListener('click', () => {
        state.time = t;
        renderTimes();
        renderSummary();
        box.querySelector<HTMLElement>('[data-continue]')?.focus();
      });
      row.append(b);
      if (selected) {
        const c = cont();
        c.dataset.continue = '';
        row.append(c);
      }
      box.append(row);
    }
  }

  // ---------- step 3: info ----------
  const field = 'font-[inherit] text-base px-4 py-3 rounded-[10px] border border-input-border min-h-12 w-full bg-white text-ink aria-[invalid=true]:border-[#C53030]';
  function renderIntake() {
    const box = $('[data-intake]');
    box.replaceChildren();
    for (const q of state.service!.intake ?? []) {
      const label = document.createElement('label');
      label.className = 'flex flex-col gap-1.5 text-sm font-semibold';
      label.append(q.label + (q.required ? '' : ' (optional)'));
      let input: HTMLInputElement | HTMLSelectElement;
      if (q.type === 'select') {
        input = document.createElement('select');
        input.append(new Option('Select…', ''));
        q.options!.forEach((o) => input.append(new Option(o, o)));
      } else {
        input = document.createElement('input');
        input.type = q.type;
      }
      input.name = q.name;
      input.required = !!q.required;
      input.className = field;
      label.append(input);
      box.append(label);
    }
  }
  const infoForm = $<HTMLFormElement>('[data-info-form]');
  infoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = [...infoForm.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select')];
    let firstBad: HTMLElement | undefined;
    for (const f of fields) {
      const ok = f.checkValidity();
      f.setAttribute('aria-invalid', String(!ok));
      if (!ok && !firstBad) firstBad = f;
    }
    $('[data-info-error]').textContent = firstBad ? 'Please complete the highlighted fields.' : '';
    if (firstBad) return firstBad.focus();
    state.info = Object.fromEntries(new FormData(infoForm)) as Record<string, string>;
    renderPayment();
    goTo(3);
  });

  // ---------- step 4: payment ----------
  function renderPayment() {
    const s = state.service!;
    const recurring = s.priceSuffix?.includes('month');
    $('[data-payment-note]').textContent = s.price
      ? `${s.name} · ${priceText(s)}${recurring ? ' — billed monthly' : ''}`
      : 'Payment for this service is arranged after your booking is confirmed.';
    $('[data-pay]').textContent = s.price ? `Pay ${s.price} (preview)` : 'Confirm booking (preview)';
  }
  $('[data-pay]').addEventListener('click', () => {
    const s = state.service!;
    $('[data-confirm-heading]').textContent = isAnytime(s) ? "You're enrolled!" : "You're scheduled!";
    $('[data-confirm-text]').textContent =
      `${s.name} — ${whenText()}. A confirmation would be sent to ${state.info?.email ?? 'your email'}.`;
    track('booking_complete_preview', { service: s.key });
    goTo(4);
  });

  // ---------- step 5: confirmation ----------
  $('[data-ics]').addEventListener('click', () => {
    const s = state.service!;
    const d = state.date!;
    const pad = (n: number) => String(n).padStart(2, '0');
    const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    let when: string;
    if (state.time) {
      const [, h, min, ap] = state.time.match(/(\d+):(\d+)\s*(AM|PM)/)!;
      const hour = (Number(h) % 12) + (ap === 'PM' ? 12 : 0);
      when = `DTSTART;TZID=America/New_York:${ymd}T${pad(hour)}${min}00\r\nDURATION:PT2H`;
    } else {
      when = `DTSTART;VALUE=DATE:${ymd}`;
    }
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NP Certification Academy//Booking preview//EN', 'BEGIN:VEVENT',
      `UID:${Date.now()}@npcertificationacademy.com`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
      when, `SUMMARY:${s.name} — NP Certification Academy`, 'LOCATION:Zoom', 'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })),
      download: 'np-certification-academy.ics',
    });
    a.click();
    URL.revokeObjectURL(a.href);
  });

  function restart() {
    state.service = undefined;
    state.info = undefined;
    infoForm.reset();
    history.replaceState(null, '', location.pathname);
    goTo(0);
  }
  $('[data-restart]').addEventListener('click', restart);
  $('[data-change-service]').addEventListener('click', restart);
  root.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', () => (current === 1 ? restart() : goTo(current - 1))));
  root.querySelectorAll<HTMLButtonElement>('[data-select-service]').forEach((b) =>
    b.addEventListener('click', () => selectService(b.dataset.selectService!) && goTo(1)),
  );

  // Deep link: /book?service=<key> jumps straight to date & time.
  const preset = new URLSearchParams(location.search).get('service');
  if (preset && selectService(preset, false)) goTo(1, false);
  else goTo(0, false);
}
