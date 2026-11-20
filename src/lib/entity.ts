/* The approved entity description (Yann, 20 Nov 2026). One source for the
   JSON-LD, llms.txt and anywhere else that says who Yann is, so AI tools see
   the same wording everywhere. Change it here, not in the pages. */

export const ENTITY_SENTENCES = [
  'Yann Hamonou is an independent B2B marketing consultant based in Stonehaven, working with SMEs, technology and engineering companies in Aberdeen, Aberdeenshire and across Scotland and the UK.',
  'He specialises in positioning, marketing strategy, SEO and AI search visibility, and he also designs and builds websites in Webflow and Astro.',
  'His client work covers energy, subsea and industrial engineering (Arnlea, Viewport3) and safety and risk SaaS for oil and gas and the process industries (BowtieMaster, Incident Insight).',
  'Before consulting, he spent seven years as director of Cognac Pierre Lecat in France, where he launched a new brand and exported it worldwide.',
] as const;

/* Person: all four sentences. Business: the first three. */
export const ENTITY_DESCRIPTION = ENTITY_SENTENCES.join(' ');
export const BUSINESS_DESCRIPTION = ENTITY_SENTENCES.slice(0, 3).join(' ');

export const KNOWS_ABOUT = [
  'B2B marketing',
  'Positioning',
  'Marketing strategy',
  'Search engine optimisation',
  'AI search visibility',
  'Generative engine optimisation',
  'Website design and development',
  'Webflow',
  'Astro',
  'B2B SaaS marketing',
  'Energy sector marketing',
  'Subsea engineering',
  'Oil and gas',
  'Process industries',
  'Brand launch and export marketing',
];
