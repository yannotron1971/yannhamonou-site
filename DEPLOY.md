# Deploying to Cloudflare Pages

Nothing is deployed yet. The live site at yannhamonou.com is still Webflow; this
repo has never been built anywhere but a local machine. What follows is the
one-time setup, and it needs a signed-in Cloudflare account — the repo side is
already done.

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
   to Formspree and nobody has ever confirmed an email arrives), and the site on
   a real phone — the WebGL field, the full-height sections and the sticky hero
   all behave differently there.

## Before any DNS is touched

- `astro.config.mjs` still has `site: 'https://yannhamonou.pages.dev'`. Every
  canonical tag and every sitemap `<loc>` uses it. This has to become
  `https://www.yannhamonou.com` at cutover — and that exact origin is what the
  verified Search Console property covers, so serving non-www would silently
  stop the data.
- GA4 fires on production builds with no consent banner. Harmless while nothing
  is deployed; not harmless the day it is.
