/**
 * Serves the static Astro build and handles the free-trial form.
 *
 *   POST /api/trial   → validate, drop honeypot hits, store lead in KV, optionally forward to CRM webhook
 *   GET  /api/leads   → CSV export of stored leads (requires `Authorization: Bearer $ADMIN_TOKEN`)
 *   old Wix URLs      → 301 to the new routes (see redirects.ts)
 */

import { redirectFor } from './redirects';

interface Env {
  ASSETS: Fetcher;
  LEADS: KVNamespace;
  /** Optional: POST each lead as JSON to an email platform / CRM / Zapier hook. */
  LEAD_WEBHOOK_URL?: string;
  ADMIN_TOKEN?: string;
}

type Lead = { email: string; exam: string; month: string; submittedAt: string; country?: string; referer?: string };

const EXAMS = new Set(['PMHNP (ANCC / AANP)', 'FNP / AGNP', 'AGACNP', 'NCLEX RN / PN']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

async function handleTrial(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  // Honeypot: pretend success so bots don't retry.
  if (typeof body.company === 'string' && body.company.trim() !== '') return json({ ok: true });

  const email = String(body.email ?? '').trim().toLowerCase();
  const exam = String(body.exam ?? '');
  const month = String(body.month ?? '');
  const errors: Record<string, string> = {};
  if (!EMAIL_RE.test(email) || email.length > 254) errors.email = 'Invalid email';
  if (!EXAMS.has(exam)) errors.exam = 'Invalid exam';
  if (!MONTH_RE.test(month)) errors.month = 'Invalid month';
  if (Object.keys(errors).length) return json({ errors }, 422);

  const lead: Lead = {
    email,
    exam,
    month,
    submittedAt: new Date().toISOString(),
    country: request.cf?.country as string | undefined,
    referer: request.headers.get('referer') ?? undefined,
  };

  // Key sorts chronologically; same email can sign up again for a different exam.
  await env.LEADS.put(`lead:${lead.submittedAt}:${crypto.randomUUID()}`, JSON.stringify(lead));

  if (env.LEAD_WEBHOOK_URL) {
    ctx.waitUntil(
      fetch(env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(lead),
      }).then(
        (r) => { if (!r.ok) console.error('lead webhook failed', r.status); },
        (err) => console.error('lead webhook error', err),
      ),
    );
  }

  return json({ ok: true });
}

async function handleLeads(request: Request, env: Env): Promise<Response> {
  const auth = request.headers.get('authorization') ?? '';
  if (!env.ADMIN_TOKEN || auth !== `Bearer ${env.ADMIN_TOKEN}`) return json({ error: 'Unauthorized' }, 401);

  const rows: Lead[] = [];
  let cursor: string | undefined;
  do {
    const page = await env.LEADS.list({ prefix: 'lead:', cursor });
    const values = await Promise.all(page.keys.map((k) => env.LEADS.get<Lead>(k.name, 'json')));
    rows.push(...values.filter((v): v is Lead => v !== null));
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  const cols = ['submittedAt', 'email', 'exam', 'month', 'country', 'referer'] as const;
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
  return new Response(csv, {
    headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="trial-leads.csv"' },
  });
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/trial') {
      if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
      return handleTrial(request, env, ctx);
    }
    if (pathname === '/api/leads' && request.method === 'GET') return handleLeads(request, env);
    if (pathname.startsWith('/api/')) return json({ error: 'Not found' }, 404);

    const target = redirectFor(new URL(request.url));
    if (target) return Response.redirect(new URL(target, request.url).toString(), 301);

    const res = await env.ASSETS.fetch(request);
    // Keep preview/staging hosts out of search results; only the real domain should be indexed.
    if (new URL(request.url).hostname.endsWith('.workers.dev')) {
      const out = new Response(res.body, res);
      out.headers.set('X-Robots-Tag', 'noindex');
      return out;
    }
    return res;
  },
} satisfies ExportedHandler<Env>;
