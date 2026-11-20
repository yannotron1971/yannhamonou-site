/* Cloudflare Turnstile site key. It is public by design (it ships in the
   page), so it can live here. The secret key never does: it is set as
   TURNSTILE_SECRET_KEY in the Cloudflare Pages project and read only by
   /api/form. Empty key = no widget, and forms submit as before. */
export const TURNSTILE_SITE_KEY: string = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '';
