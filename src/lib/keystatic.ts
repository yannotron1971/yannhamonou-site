import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

export type Post = Awaited<ReturnType<typeof reader.collections.posts.read>>;
export type PostEntry = Awaited<ReturnType<typeof reader.collections.posts.all>>[number];

/* ── Site settings ──
   The settings singleton is the editable source for testimonials and the FAQ.
   Both used to be duplicated in src/data/index.ts, and the two copies had
   drifted: the same Viewport3 quote was signed Chris Harvey in the code and
   Stuart McKenzie in the CMS, and the Arnlea quote Claire Murray against Colin
   Robertson. One source now, and the code keeps only what an editor should not
   have to know — how each logo file wants to be drawn.

   The `logo` field is a key, not a file: the artwork carries intrinsic size,
   inversion and colour rules that belong beside the asset, so the editor picks
   which mark and this resolves how to draw it. */
import { logos, type Testimonial } from '../data/index';

export async function getSettings() {
  const settings = await reader.singletons.settings.read();
  if (!settings) throw new Error('content/settings/index.yaml could not be read.');

  const testimonials: Testimonial[] = settings.testimonials.map((t) => ({
    quote: t.quote,
    name: t.name,
    role: t.role,
    company: t.company,
    location: t.location || undefined,
    logo: t.logo && t.logo !== 'none' ? logos[t.logo as keyof typeof logos] : undefined,
  }));

  return {
    navPhone: settings.navPhone,
    figures: settings.figures.map((f) => ({ num: f.num, label: f.label })),
    testimonials,
    faq: settings.faq.map((f) => ({ q: f.q, a: f.a })),
  };
}

/* ── Homepage ──
   The page's own words, so the argument can be edited by the person making
   it. Cases, services and client logos stay in src/data: those are entities
   that several pages share, and they want to be collections rather than
   fields on one page's record. */
export async function getHomepage() {
  const home = await reader.singletons.homepage.read();
  if (!home) throw new Error('content/homepage/index.yaml could not be read — the homepage has no copy without it.');
  return home;
}

/* Headlines are written with their line breaks, because where they break is
   part of how they are set. Returns the lines so the template can put the
   <br> in itself — nothing here injects markup from the CMS. */
export const lines = (text: string) => text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
