import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  adapter: cloudflare(),
  // Keystatic's admin UI is React. Without the renderer the /keystatic route
  // builds and returns 200, then dies at render with NoMatchingRenderer — the
  // CMS looked installed and was unusable. React is here for that UI only;
  // no page component on the site uses it.
  integrations: [react(), keystatic(), sitemap({
    // The Sparehand concept is noindex; a sitemap should not list it.
    filter: (page) => !page.includes('/work/web/sparehand'),
  })],
  site: 'https://yannhamonou-site.pages.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
