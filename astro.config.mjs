import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  adapter: cloudflare(),
  integrations: [keystatic(), sitemap()],
  site: 'https://yannhamonou.pages.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
