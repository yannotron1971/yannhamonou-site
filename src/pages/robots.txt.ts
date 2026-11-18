import type { APIRoute } from 'astro';

/* robots.txt follows the `site` in astro.config.mjs, so launch cannot forget it.

   While `site` is the pages.dev preview, every crawler is kept out: a public
   duplicate of the live site would compete with it in search. Once `site` is
   https://www.yannhamonou.com, crawling opens up with the same Content-Signal
   the Webflow site publishes: no AI training, yes to search and to AI answers
   that cite the page. The Keystatic admin and its API stay out either way. */
export const prerender = true;

const PRODUCTION_HOST = 'www.yannhamonou.com';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('/sitemap-index.xml', site).href;
  const live = site?.hostname === PRODUCTION_HOST;

  const body = live
    ? [
        'User-agent: *',
        'Content-Signal: ai-train=no, search=yes, ai-input=yes',
        'Allow: /',
        'Disallow: /keystatic',
        'Disallow: /api/',
        '',
        `Sitemap: ${sitemap}`,
        '',
      ]
    : [
        '# Preview build: not for indexing. Opens up when `site` in',
        `# astro.config.mjs is https://${PRODUCTION_HOST}.`,
        'User-agent: *',
        'Disallow: /',
        '',
        `Sitemap: ${sitemap}`,
        '',
      ];

  return new Response(body.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
