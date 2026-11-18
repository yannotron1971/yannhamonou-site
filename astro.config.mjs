import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import reviewNotes from './integrations/review-notes.mjs';
import { readFileSync } from 'node:fs';

// The marketing audit page stays out of the sitemap until "Published" is
// ticked in Keystatic (content/marketing-audit/index.yaml).
const auditPublished = (() => {
  try { return /^published:\s*true\s*$/m.test(readFileSync(new URL('./content/marketing-audit/index.yaml', import.meta.url), 'utf-8')); }
  catch { return false; }
})();

export default defineConfig({
  adapter: cloudflare(),
  // Keystatic's admin UI is React. Without the renderer the /keystatic route
  // builds and returns 200, then dies at render with NoMatchingRenderer — the
  // CMS looked installed and was unusable. React is here for that UI only;
  // no page component on the site uses it.
  integrations: [react(), keystatic(), sitemap({
    // The concept pages are noindex; a sitemap should not list them.
    filter: (page) =>
      !/\/work\/web\/(sparehand|keelson|emberline)/.test(page) &&
      (auditPublished || !/\/services\/marketing-audit\/?$/.test(page)),
  }),
  // Click-to-comment review notes. Dev server only; adds nothing to builds.
  reviewNotes()],
  site: 'https://yannhamonou-site.pages.dev',
  vite: {
    plugins: [tailwindcss()],
    // Keystatic's API route imports the virtual:keystatic-config module, which
    // only Astro's Vite plugin can resolve. Pre-bundling it with esbuild fails.
    optimizeDeps: { exclude: ['@keystatic/astro'] },
  },
});
