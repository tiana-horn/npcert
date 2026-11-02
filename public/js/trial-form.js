// Free-trial form, backed by Wix Forms.
//
// The fields come from the form's schema in the Wix dashboard (Forms → "Free trial class"), so the
// owner can rename, reorder, add or require a field there with no code change. Values, validation
// (in Wix's wording) and the submission go through Wix's form store in /js/wix/.
import { createFormStore, FORM_ERROR } from '/js/wix/form-store.js';

const root = document.querySelector('[data-trial-form]');
const success = document.querySelector('[data-trial-success]');

const INPUT_CLS =
  'font-[inherit] text-base font-normal px-4 py-3.5 rounded-[10px] border border-input-border min-h-12 box-border bg-white text-ink w-full aria-[invalid=true]:border-[#E5484D] aria-[invalid=true]:outline-2 aria-[invalid=true]:outline-[#E5484D]';
const INPUT_TYPES = { text: 'text', email: 'email', phone: 'tel', url: 'url', password: 'password', number: 'number', rating: 'number', date: 'date', time: 'time', datetime: 'datetime-local' };

function track(event, props = {}) {
  (window.dataLayer ||= []).push({ event, ...props });
  window.zaraz?.track(event, props);
}

const el = (tag, attrs = {}, children = []) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null && v !== false) n.setAttribute(k, v === true ? '' : v);
  n.append(...children);
  return n;
};

if (root && success) {
  const store = createFormStore({ formId: root.dataset.formId });
  const fieldsBox = root.querySelector('[data-fields]');
  const formError = root.querySelector('[data-form-error]');
  const button = root.querySelector('button[type="submit"]');
  const controls = new Map(); // target → { wrap, input, error }
  let built = '';

  function control(f, state) {
    const describedBy = `err-${f.target}`;
    const common = { name: f.target, id: `f-${f.target}`, class: INPUT_CLS, 'aria-describedby': describedBy, disabled: f.readOnly, 'aria-label': f.showLabel ? null : f.label };
    let input;
    if (f.control === 'select') {
      input = el('select', common, [el('option', { value: '' }, [f.placeholder || 'Choose one']), ...f.choices.map((c) => el('option', { value: c.value }, [c.label]))]);
    } else if (f.control === 'textarea') {
      input = el('textarea', { ...common, rows: 4, placeholder: f.placeholder });
    } else if (INPUT_TYPES[f.control]) {
      const v = f.validation;
      input = el('input', {
        ...common,
        type: INPUT_TYPES[f.control],
        placeholder: f.placeholder,
        autocomplete: f.control === 'email' ? 'email' : null,
        min: v.minDate?.slice(0, f.control === 'date' ? 10 : 16) ?? v.minimum,
        max: v.maxDate?.slice(0, f.control === 'date' ? 10 : 16) ?? v.maximum,
        step: v.multipleOf,
      });
    } else {
      // Choice groups, files, addresses etc. aren't used on this form; fail visibly rather than submit the wrong shape.
      console.error(`trial form: unsupported field kind "${f.control}" (${f.target})`);
      return null;
    }
    input.value = state.values[f.target] ?? '';
    input.addEventListener(f.control === 'select' ? 'change' : 'input', () => store.setValue(f.target, input.value));
    input.addEventListener('blur', () => store.validate(f.target));
    return input;
  }

  function build(state) {
    fieldsBox.replaceChildren();
    controls.clear();
    for (const f of state.form.fields) {
      const input = control(f, state);
      if (!input) continue;
      const error = el('span', { id: `err-${f.target}`, class: 'text-[13px] font-medium text-[#FFB4B4]' });
      const label = el('label', { for: input.id, class: f.showLabel ? null : 'sr-only' }, [f.label]);
      const help = f.description ? el('span', { class: 'text-[13px] font-normal text-muted-on-dark' }, [f.description]) : '';
      const wrap = el('div', { class: 'flex flex-col gap-1.5 text-sm font-semibold' }, [label, input, help, error]);
      fieldsBox.append(wrap);
      controls.set(f.target, { input, error });
    }
    button.textContent = state.form.submitText || button.textContent;
  }

  function render() {
    const state = store.getState();
    if (state.outcome) return;
    if (!state.form) {
      if (state.errors[FORM_ERROR]) formError.textContent = 'The signup form is unavailable right now. Please email us at info@npcertificationacademy.com.';
      return;
    }
    if (state.closed) {
      fieldsBox.replaceChildren(el('p', { class: 'm-0' }, [state.form.disabledMessage || 'Free-class signups are closed right now.']));
      button.hidden = true;
      return;
    }
    // Rebuild only when the set of visible fields changes (a dashboard rule can add or remove one).
    const key = state.form.fields.map((f) => f.target).join('|');
    if (key !== built) {
      build(state);
      built = key;
    }
    for (const [target, { input, error }] of controls) {
      const msg = state.errors[target] || '';
      error.textContent = msg;
      input.setAttribute('aria-invalid', String(Boolean(msg)));
    }
    formError.textContent = state.errors[FORM_ERROR] || '';
    button.disabled = state.loading;
  }

  store.subscribe(render);
  store.start();
  render();

  root.addEventListener('submit', async (e) => {
    const outcome = await store.submit(e);
    if (!outcome) return;
    track('trial_form_submit');
    if (outcome.url) {
      if (outcome.newTab) window.open(outcome.url, '_blank', 'noopener');
      else return window.location.assign(outcome.url);
    }
    // The owner's thank-you text from the dashboard, when set; the built-in message otherwise.
    if (outcome.message) {
      const [title, ...rest] = outcome.message.split('\n').filter(Boolean);
      success.querySelector('[data-success-title]').textContent = title;
      success.querySelector('[data-success-body]').replaceChildren(...rest.map((p) => el('p', { class: 'm-0' }, [p])));
    }
    root.hidden = true;
    success.classList.replace('hidden', 'flex');
    success.focus();
  });
}
