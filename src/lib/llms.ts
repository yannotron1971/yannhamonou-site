/* llms.txt and llms-full.txt, built from the same Keystatic content as the
   pages, so the AI-facing summary can never drift from the site.

   Format follows https://llmstxt.org/: H1 name, a blockquote summary, short
   context, then H2 sections of `- [Title](URL): description` links, with an
   "Optional" section agents may skip. llms-full.txt carries the same facts
   in full, in one fetch.

   Google has said its AI features use the normal search index, not llms.txt,
   so this is a low-cost hedge for other assistants and agents, not an SEO
   lever. Facts only: no claims that are not already on the site. */
import { reader, getSettings, getHomepage, getServices, getCases, getMarketingAudit } from './keystatic';

const clean = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
const paras = (s: string) => s.split(/\r?\n\s*\r?\n/).map(clean).filter(Boolean);

async function load(site: URL) {
  const url = (path: string) => new URL(path, site).href;
  const [home, settings, services, cases, posts, audit] = await Promise.all([
    getHomepage(), getSettings(), getServices(), getCases(), reader.collections.posts.all(), getMarketingAudit(),
  ]);
  const recent = posts
    .filter((p) => p.entry.publishedDate)
    .sort((a, b) => ((b.entry.publishedDate ?? '') > (a.entry.publishedDate ?? '') ? 1 : -1));
  return { url, home, settings, services, cases, posts: recent, audit };
}

/* Only listed once the page is published in Keystatic. */
const auditLine = (d: Awaited<ReturnType<typeof load>>) =>
  `- [Marketing audit](${d.url('/services/marketing-audit')}): A two-week review of positioning, website conversion, measurement, search visibility and enquiry follow-up for B2B firms. Fixed price ${d.audit.price}${d.audit.vatNote ? ` ${d.audit.vatNote}` : ''}.`;

const SUMMARY =
  'Yann Hamonou is an independent B2B marketing consultant based in Stonehaven, Aberdeenshire, ' +
  'serving SMEs, startups and tech companies across Aberdeen, Aberdeenshire and Scotland. ' +
  'He combines senior marketing strategy with hands-on delivery: positioning, SEO and GEO, ' +
  'paid and organic media, websites and marketing leadership.';

function facts(d: Awaited<ReturnType<typeof load>>) {
  const { home } = d;
  return [
    `- Based in: Stonehaven, Aberdeenshire, Scotland. Works with clients across Aberdeen, Aberdeenshire, Scotland and remotely across the UK.`,
    `- Experience: 20+ years in B2B marketing strategy, SEO, positioning and lead generation.`,
    `- First step: a free 30-minute review, booked through ${d.url('/contact')}`,
    `- Phone: +44 (0) 785 3455816`,
    `- LinkedIn: https://www.linkedin.com/in/yannhamonou`,
  ].join('\n');
}

export async function buildLlmsTxt(site: URL) {
  const d = await load(site);
  const out: string[] = [];
  out.push('# Yann Hamonou', '', `> ${SUMMARY}`, '');
  out.push('Key facts:', '', facts(d), '');
  out.push(`A single-file version with every service, case study and FAQ in full is at ${d.url('/llms-full.txt')}.`, '');

  out.push('## Services', '');
  for (const s of d.services) out.push(`- [${clean(s.title)}](${d.url(`/services/${s.slug}`)}): ${clean(s.desc)}`);
  if (d.audit.published) out.push(auditLine(d));
  out.push(`- [Digital marketing Aberdeen](${d.url('/digital-marketing-aberdeen')}): How the services fit together for Aberdeen B2B companies.`);
  out.push('');

  out.push('## Case studies', '');
  for (const c of d.cases) {
    const stat = clean([c.stat, c.statSub].filter(Boolean).join(' '));
    out.push(`- [${clean(c.client)}](${d.url(`/work/${c.slug}`)}): ${clean(c.descriptor)}${stat ? `. Result: ${stat}` : ''}`);
  }
  out.push('');

  out.push('## About and contact', '');
  out.push(`- [About Yann Hamonou](${d.url('/about')}): Background, approach and experience.`);
  out.push(`- [Free 30-minute review](${d.url('/contact')}): How to book a call and what happens on it.`);
  out.push(`- [Homepage FAQ](${d.url('/#faq')}): Answers to common questions before a call.`);
  out.push('');

  out.push('## Optional', '');
  for (const p of d.posts.slice(0, 12)) {
    out.push(`- [${clean(p.entry.title)}](${d.url(`/journal/${p.slug}`)}): ${clean(p.entry.description)}`);
  }
  out.push(`- [Privacy policy](${d.url('/privacy')}): How enquiry data is handled.`);
  return out.join('\n') + '\n';
}

export async function buildLlmsFullTxt(site: URL) {
  const d = await load(site);
  const { home } = d;
  const out: string[] = [];
  out.push('# Yann Hamonou', '', `> ${SUMMARY}`, '');
  out.push('## Key facts', '', facts(d), '');

  out.push('## How I work', '');
  for (const p of paras(home.senior.body)) out.push(p, '');
  home.process.steps.forEach((s, i) => out.push(`${i + 1}. **${clean(s.title)}**: ${clean(s.body)}`));
  out.push('');

  out.push('## Services', '');
  for (const s of d.services) {
    out.push(`### ${clean(s.title)}`, '', `URL: ${d.url(`/services/${s.slug}`)}`, '');
    for (const t of [s.desc, s.intro, s.why]) if (clean(t)) out.push(clean(t), '');
    if (s.process.length) {
      out.push('Process:');
      s.process.forEach((p) => out.push(`- ${clean(p.title)}: ${clean(p.body)}`));
      out.push('');
    }
    if (s.deliverables.length) {
      out.push('Deliverables:');
      s.deliverables.forEach((x) => out.push(`- ${clean(x)}`));
      out.push('');
    }
    for (const f of s.faq) out.push(`**${clean(f.q)}** ${clean(f.a)}`, '');
  }

  if (d.audit.published) {
    out.push('### Marketing audit', '', auditLine(d).replace(/^- /, ''), '');
  }

  out.push('## Case studies', '');
  for (const c of d.cases) {
    out.push(`### ${clean(c.client)}`, '', `URL: ${d.url(`/work/${c.slug}`)}`);
    if (c.year) out.push(`Year: ${c.year}`);
    out.push(`Work: ${clean(c.descriptor)}`);
    const stat = clean([c.stat, c.statSub].filter(Boolean).join(' '));
    if (stat) out.push(`Headline result: ${stat}`);
    out.push('');
    if (clean(c.summary)) out.push(clean(c.summary), '');
    if (clean(c.challenge)) out.push(`Challenge: ${clean(c.challenge)}`, '');
    if (c.approach.length) { out.push('Approach:'); c.approach.forEach((a) => out.push(`- ${clean(a)}`)); out.push(''); }
    if (c.results.length) { out.push('Results:'); c.results.forEach((r) => out.push(`- ${clean(r)}`)); out.push(''); }
  }

  const quotes = d.settings.testimonials.filter((t) => clean(t.quote));
  if (quotes.length) {
    out.push('## What clients say', '');
    for (const t of quotes) out.push(`> ${clean(t.quote)}`, `> (${clean(t.name)}, ${clean(t.role)}, ${clean(t.company)})`, '');
  }

  out.push('## Frequently asked questions', '');
  for (const f of d.settings.faq) out.push(`**${clean(f.q)}**`, '', clean(f.a), '');

  out.push('## Journal', '');
  for (const p of d.posts) {
    out.push(`- [${clean(p.entry.title)}](${d.url(`/journal/${p.slug}`)}) (${p.entry.publishedDate}): ${clean(p.entry.description)}`);
  }
  return out.join('\n') + '\n';
}
