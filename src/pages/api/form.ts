/* Form relay: checks the Cloudflare Turnstile token, then forwards the
   submission to Formspree. The Formspree IDs live here, keyed by the form's
   _form field, so the endpoint cannot be used to post to any other form.

   TURNSTILE_SECRET_KEY comes from the Cloudflare Pages environment. While it
   is unset the check is skipped and forms pass straight through, so the site
   keeps working before the keys are added. */
import type { APIRoute } from 'astro';

export const prerender = false;

const FORMS: Record<string, string> = {
  contact: 'xkoabzbd',
  newsletter: 'xdoqkgpr',
};

export const POST: APIRoute = async ({ request, locals }) => {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const back = request.headers.get('referer') ?? new URL('/', request.url).href;
  const reply = (ok: boolean, status: number, error?: string) =>
    wantsJson
      ? new Response(JSON.stringify(ok ? { ok } : { ok, error }), {
          status,
          headers: { 'content-type': 'application/json' },
        })
      : Response.redirect(new URL(ok ? '?sent=1' : '?sent=0', back).href, 303);

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return reply(false, 400, 'bad-request');
  }

  const formId = FORMS[String(data.get('_form') ?? '')];
  if (!formId) return reply(false, 400, 'unknown-form');

  const env = (locals as { runtime?: { env?: Record<string, string | undefined> } }).runtime?.env;
  const secret = env?.TURNSTILE_SECRET_KEY;
  if (secret) {
    const token = String(data.get('cf-turnstile-response') ?? '');
    if (!token) return reply(false, 403, 'turnstile-missing');
    const check = new FormData();
    check.append('secret', secret);
    check.append('response', token);
    const ip = request.headers.get('cf-connecting-ip');
    if (ip) check.append('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: check });
    const result = (await res.json().catch(() => ({}))) as { success?: boolean };
    if (!result.success) return reply(false, 403, 'turnstile-failed');
  }

  data.delete('cf-turnstile-response');
  data.delete('_form');
  const origin = new URL(request.url).origin;
  const sent = await fetch(`https://formspree.io/f/${formId}`, {
    method: 'POST',
    body: data,
    headers: { Accept: 'application/json', Origin: origin, Referer: back },
  });
  return reply(sent.ok, sent.ok ? 200 : 502, sent.ok ? undefined : 'formspree');
};
