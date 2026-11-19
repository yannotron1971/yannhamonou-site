# Deploying to Cloudflare Pages

Live since 19 Nov 2026. https://www.yannhamonou.com is served by the Pages
project `yannhamonou-site`, which deploys every push to `main`. The bare
domain 301s to www through a Cloudflare redirect rule (Rules, "Redirect from
root to WWW"), and Always Use HTTPS is on.

DNS moved from IONOS to Cloudflare the same day (nameservers
anastasia/kolton.ns.cloudflare.com). Email still runs on IONOS: the MX, SPF,
DMARC, the three IONOS DKIM CNAMEs, autodiscover, the Resend records and the
Bing verification CNAME were all copied across as DNS-only records.

Rollback: re-add both domains in Webflow (Site settings, Publishing) and
set the IONOS nameservers back to ns1022.ui-dns.org, ns1035.ui-dns.com,
ns1054.ui-dns.de and ns1110.ui-dns.biz. The IONOS DNS table was left untouched.

GA4 loads only after consent (src/components/CookieBanner.astro). Webflow
also ran Google Tag Manager GTM-NDQSTJ4B; this site does not.

The setup notes below are kept for reference.

## What the repo already provides

- `@astrojs/cloudflare` adapter, so `npm run build` emits `dist/_worker.js` and
  `dist/_routes.json` — the shape Pages expects.
- `wrangler.jsonc` — project name, compatibility date, `nodejs_compat`, output
  directory, and the `SESSION` KV binding the adapter requires.
- `public/_redirects` — the redirect map, checked against a Search Console
  export. Pages picks this up automatically.
- `npm run deploy` — build, then `wrangler pages deploy`.
- `npm run cf-preview` — build, then serve through the real Workers runtime
  locally. Worth doing before the first real deploy: `astro dev` runs on Node
  and will not catch a runtime-only failure.

## One-time setup

1. **Authenticate.** Interactive, so run it yourself:

   ```
   npx wrangler login
   ```

2. **Create the KV namespace** and paste the printed id over `PLACEHOLDER…` in
   `wrangler.jsonc`:

   ```
   npx wrangler kv namespace create SESSION
   ```

   Skip this and a deployed build fails at runtime with ``Invalid binding
   `SESSION` `` — the warning `astro build` prints on every run.

3. **Create the Pages project.** Either let the first `npm run deploy` create
   it, or connect the GitHub repo in the dashboard (build command
   `npm run build`, output directory `dist`) so every push to `main` deploys.
   The Git integration is the better default now that `main` carries the site.

4. **Set the Keystatic env vars** in the project's settings — the admin UI at
   `/keystatic` will not work on a deployed build without them. Names are in
   `.env.example`; values come from the GitHub App backing Keystatic.

5. **Deploy to a preview URL and check it.** Contact form end to end (it posts
   to Formspree form xkoabzbd on Yann's personal Formspree account; delivery
   confirmed 18 Nov 2026 after the _gotcha honeypot was changed to
   display:none, because browser autofill had been filling it and Formspree
   filed real enquiries as spam), and the site on
   a real phone — the WebGL field, the full-height sections and the sticky hero
   all behave differently there.

## Before any DNS is touched

- `astro.config.mjs` still has `site: 'https://yannhamonou-site.pages.dev'`. Every
  canonical tag and every sitemap `<loc>` uses it. This has to become
  `https://www.yannhamonou.com` at cutover — and that exact origin is what the
  verified Search Console property covers, so serving non-www would silently
  stop the data. The same switch opens `robots.txt` (src/pages/robots.txt.ts):
  on any other `site` it disallows everything, on www.yannhamonou.com it
  allows crawling with `Content-Signal: ai-train=no, search=yes, ai-input=yes`.
  `/llms.txt` and `/llms-full.txt` are generated from Keystatic
  (src/lib/llms.ts) and pick up the new origin automatically.
- GA4 fires on production builds with no consent banner. Harmless while nothing
  is deployed; not harmless the day it is.
