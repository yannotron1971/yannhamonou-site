/* Client logo artwork. `darkInvert` marks logos drawn in dark ink — they need
   inverting on the dark theme, and always on top of a photo/gradient.
   `lightInk` is the mirror case: artwork drawn in white, which needs flipping
   on a light ground or it disappears into it.
   `site` is the client's own website: where a mark appears outside a link of
   its own, it becomes one. Verified against each company's live site rather
   than guessed from the name.
   `colourOnDark` is for dark-ink artwork that is dark *and coloured* rather
   than black: silhouetted at rest like any other, but it has a hue to come
   back to on hover, so it lifts into it instead of staying a silhouette.
   `scale` corrects optical size. Marks are matched on height, which works
   until one of them is a stacked lockup: at the same height as a 5:1 wordmark
   it reads as half the size, because it is.
   `splitAt` is for lockups whose mark and wordmark are drawn in different
   inks, where one filter cannot serve both. It is the fraction of the width
   where the mark ends, and it makes the component render the artwork as two
   clipped layers so each half can be treated on its own. */
export type Logo = { src: string; w: number; h: number; darkInvert?: boolean; lightInk?: boolean; site?: string; colourOnDark?: boolean; scale?: number; splitAt?: number };

export const logos = {
  /* Ink measured off the artwork, per half rather than over the whole file:
     the three bars are rgb(241,115,10), a strong orange, and the wordmark is
     rgb(29,39,59), near-navy. Averaging the two gives the warm brown this
     comment used to claim, which is a colour that appears nowhere in the mark.
     That is why it splits: on hover the bars return to orange and the wordmark
     stays white, instead of the whole lockup lifting into a muddy blue-grey.
     The bars end at x=205 and the wordmark starts at x=274, so the cut is the
     middle of that gap: 239/1130. Viewport3 averages rgb(0,0,0) — pure black,
     with no colour under the silhouette to reveal. */
  arnlea:          { src: '/logos/arnlea.webp',          w: 1130, h: 225, darkInvert: true,  colourOnDark: true, splitAt: 0.2115, site: 'https://www.arnlea.com/' },
  /* 2.19:1 against Arnlea's 5.02:1 — a stacked lockup, so height alone leaves
     it looking half the size of the wordmarks beside it. */
  viewport3:       { src: '/logos/viewport3.png',        w: 1944, h: 894, darkInvert: true,  scale: 1.3, site: 'https://viewport3.com/' },
  bowtiemaster:    { src: '/logos/Bowtie.webp',          w: 3023, h: 693, darkInvert: false, site: 'https://bowtiemaster.com/' },
  incidentInsight: { src: '/logos/IncidentInsight.avif', w: 1102, h: 276, darkInvert: false, site: 'https://incident-insight.com/' },
  /* The supplied artwork is the inverted cut: white wordmark, orange mark. It
     sits on the dark grounds every testimonial currently uses; `lightInk`
     covers it if one of those ever turns light. The mark links to Tenders
     Direct, which is where the Proactis Tenders business actually lives. */
  proactis:        { src: '/logos/proactis-tenders.svg',  w: 662,  h: 112, lightInk: true, site: 'https://www.tendersdirect.co.uk/' },
} satisfies Record<string, Logo>;


/* Services and case studies are Keystatic collections now: content/services
   and content/work, read through src/lib/keystatic.ts. They have their own
   URLs and several pages list them, so they are entities rather than copy,
   and keeping a second definition here is what let the testimonials drift.

   What remains is what is genuinely code: the logo artwork and the rules for
   drawing each file, and the two small lists below. */
export const ticker = [
  '100% lead generation growth',
  '20+ years B2B experience',
  '#1 Google rank in 4 weeks',
  'Aberdeen · Scotland · Remote',
  'SEO & GEO specialist',
  'Free 30-min strategy review',
  'B2B focused',
  '100+ qualified leads/month',
];


export const clients = [
  { name: 'Arnlea',           ...logos.arnlea },
  { name: 'Viewport3',        ...logos.viewport3 },
  { name: 'BowtieMaster',     ...logos.bowtiemaster },
  { name: 'Incident Insight', ...logos.incidentInsight },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  location?: string;
  logo?: Logo;
};

/* Testimonials and the FAQ live in content/settings; the homepage's copy and
   its symptoms in content/homepage. Both were duplicated here until the two
   copies disagreed about who had said what. The Testimonial type above is
   still the shape the reader maps into. */
