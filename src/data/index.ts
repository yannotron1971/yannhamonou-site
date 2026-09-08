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
   it reads as half the size, because it is. */
export type Logo = { src: string; w: number; h: number; darkInvert?: boolean; lightInk?: boolean; site?: string; colourOnDark?: boolean; scale?: number };

export const logos = {
  /* Ink measured off the artwork: Arnlea averages rgb(87,60,46), a warm brown,
     so it has something to show. Viewport3 averages rgb(0,0,0) — pure black,
     with no colour under the silhouette to reveal. */
  arnlea:          { src: '/logos/arnlea.webp',          w: 1130, h: 225, darkInvert: true,  colourOnDark: true, site: 'https://www.arnlea.com/' },
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

/* The four symptoms that bring an SME here. Written as things you would
   recognise in your own month rather than problems in the abstract, and each
   one paired with what it costs — a symptom nobody has priced is easy to live
   with. */
export const problems = [
  {
    symptom: 'You cannot tell which half of it is working',
    cost: 'The reports arrive full of impressions and sessions, and none of it reconciles with the enquiries that actually landed. So the budget stays where it is, because moving it is a guess either way.',
  },
  {
    symptom: 'Leads arrive by referral, or they do not arrive',
    cost: 'A good month follows a good conversation. A quiet one follows nothing you can point at. That makes hiring, forecasting and turning work down a matter of nerve rather than evidence.',
  },
  {
    symptom: 'Competitors you are better than keep coming up first',
    cost: 'They are not winning on the work. They are winning because the buyer found them at the moment they were looking, and never got as far as your name.',
  },
  {
    symptom: 'Nobody can say what a lead costs you',
    cost: 'Without that number every budget conversation runs on opinion, and marketing becomes the easiest line to cut when the year gets tight.',
  },
];

export const services = [
  {
    slug: 'positioning',
    num: '01',
    title: 'Positioning',
    desc: 'Stand out in your market with a message that resonates and converts.',
    long: 'Positioning is the highest-leverage work in marketing. Get it right and everything downstream — copy, ads, sales conversations — becomes easier. I run a structured positioning sprint that defines your category, ideal buyer, and differentiators.',
    headline: 'Define what makes your business different — before you spend on marketing that doesn\'t work',
    intro: 'Marketing positioning is the process of defining how your business is perceived by the people you want to buy from you. It answers three questions: who is this for, why should they choose you over the alternatives, and how do you communicate that clearly? Some companies skip this step. They build websites, run campaigns, and invest in SEO without first working out what they\'re saying — and to whom.',
    why: 'When positioning is missing, your website describes what you do but not why it matters. Leads come in from the wrong sectors. You compete on price because buyers can\'t see a meaningful difference. Sales cycles drag because buying committees can\'t justify the choice internally. These are all positioning problems — not execution problems.',
    process: [
      { num: '01', title: 'Understand', body: 'I start with your best customers: why they bought, what they were using before, and how they\'d describe you to a colleague. I map the competitive alternatives your buyers actually evaluate — not always who you\'d expect. Sometimes the real competitor is "do nothing" or "hire internally". This research surfaces what your business does well in the language real buyers use.' },
      { num: '02', title: 'Define', body: 'From the research, I isolate the attributes that are genuinely yours — not claims your competitors could equally make. I connect each to a concrete benefit the buyer cares about and choose the market frame where your strengths are most visible. The same service positioned differently competes in a completely different landscape.' },
      { num: '03', title: 'Articulate', body: 'The output is a positioning statement and messaging framework your team can actually use — specific claims, proof points, and buyer language for your website, proposals, sales calls, and content. Positioning is a decision, not a tattoo. It\'s designed to be revisited as your market evolves.' },
    ],
    deliverables: [
      'Competitive alternatives map',
      'Differentiating attributes with proof points',
      'Positioning statement',
      'Messaging framework (claims, proof, buyer language)',
      'Target customer profiles',
      'Implementation recommendations for website and content',
    ],
    proof: {
      stat: '+38%',
      statLabel: 'demo requests in 90 days',
      quote: 'Yann doesn\'t do fluff. He came in, understood our business quickly, and delivered a positioning and SEO strategy that\'s already showing results. I\'d recommend him to any SME serious about growth.',
      name: 'Claire Murray',
      role: 'Head of Business Development',
      company: 'Arnlea Systems',
      logo: logos.arnlea,
    },
    caseNote: 'Viewport3 was being compared to generic 3D scanning vendors, even though their subsea photogrammetry work is fundamentally different. Through a structured positioning sprint, we reframed them from "photogrammetry vendor" to "dimensional assurance partner" — identified seven provable differentiators and built a messaging framework drawn from how their best customers describe the service. The category shift moved them out of price competition entirely.',
    faq: [
      { q: 'Is positioning the same as branding?', a: 'No. Branding covers visual identity — logo, colour, tone. Positioning is the strategic decision about how you compete: who you\'re for, what you do better than alternatives, and why that matters to the buyer. Good positioning makes branding more effective. Branding without positioning is decoration.' },
      { q: 'Can\'t we figure out positioning ourselves?', a: 'Sometimes. But most founders and leadership teams are too close to their business to see it the way buyers do. The positioning process starts with customer interviews, not internal workshops, precisely because the most important insights come from outside the building.' },
      { q: 'How long does a positioning engagement take?', a: 'Typically 3–5 weeks for a focused sprint: customer interviews, competitive mapping, positioning development, and messaging framework. Ongoing refinement as you test messaging in the market is part of the engagement.' },
      { q: 'Do I need positioning before I work on SEO or paid media?', a: 'Not strictly, but it makes everything downstream more effective. If you don\'t know exactly who you\'re targeting and what makes you different, your SEO content will be generic and your ad copy won\'t convert. Positioning is the brief that all execution works from.' },
    ],
  },
  {
    slug: 'strategy',
    num: '02',
    title: 'Marketing Strategy',
    desc: 'Clear, practical strategy rooted in your business goals — not templates.',
    long: 'Most SMEs jump straight to tactics. Strategy first means every pound you spend is pointed at the right target. I audit your current position, map your competitive landscape, and build a 12-month roadmap that your team can actually execute.',
    headline: 'Stop wasting budget on tactics without a strategy behind them',
    intro: 'In today\'s competitive landscape, SMEs need more than tactical marketing — they need a clear, actionable strategy that connects every activity to revenue. Drawing from 20+ years of B2B experience across Scotland and the UK, I build practical marketing strategies that drive growth without overwhelming your resources.',
    why: 'Most marketing problems aren\'t channel problems. They\'re strategy problems: unclear positioning, the wrong audience, no measurement framework. Fix the upstream problem first and execution becomes straightforward.',
    process: [
      { num: '01', title: 'Marketing audit', body: 'I review everything you\'re currently doing — what\'s delivering results and what isn\'t. This includes competitor analysis and understanding how customers currently find and interact with your business. The audit reveals immediate opportunities and shapes what comes next.' },
      { num: '02', title: 'Strategy development', body: 'I build a strategy that fits your business goals and resources. We identify exactly who your ideal customers are and how to reach them. You get a practical, month-by-month plan that focuses budget on the channels most likely to produce results — with proper tracking so you can see what\'s working.' },
      { num: '03', title: 'Ongoing support', body: 'Marketing needs regular attention and adjustment. Through monthly check-ins, I review performance in plain English — no jargon. Expert direction without the cost of a full-time marketing manager.' },
    ],
    deliverables: [
      'Current-state marketing audit',
      'Competitor landscape map',
      '12-month priority roadmap',
      'Channel mix recommendations with budget allocation',
      'KPI framework and monthly targets',
      'Tracking and measurement setup',
    ],
    proof: {
      stat: '100%',
      statLabel: 'lead gen growth in 12 months',
      quote: 'Yann transformed our martech stack and used data insights to develop highly effective marketing campaigns. His efforts resulted in increased brand visibility and a 100% increase in lead generation performance over a period of just 12 months.',
      name: 'Debbie Mackenzie',
      role: 'Managing Director',
      company: 'Proactis Tenders',
      logo: logos.proactis,
    },
    faq: [
      { q: 'Why work with a consultant rather than hire in-house?', a: 'You get senior-level marketing expertise and execution capability at a fraction of the cost of a full-time hire. You also benefit from experience across multiple industries and proven frameworks — without the overhead of employment costs, management time, or the risk of a bad hire.' },
      { q: 'What makes your approach different?', a: 'I combine strategic thinking with practical execution. Unlike pure consultants who deliver a document and leave, I help implement the strategies we build together — which means I\'m accountable for results, not just recommendations.' },
      { q: 'How do you measure success?', a: 'Every engagement starts with clear, measurable objectives. Whether it\'s lead generation, market positioning, or digital presence, we track concrete metrics aligned with your business goals. No vanity metrics.' },
      { q: 'What are your fees?', a: 'A standalone strategy engagement typically starts from £1,500. Monthly retainers covering strategy and execution run £900–£2,000/month depending on scope. The free 30-minute review is the right starting point.' },
    ],
  },
  {
    slug: 'seo-aberdeen',
    num: '03',
    title: 'SEO & GEO',
    desc: 'Get found by the right buyers — in search and in AI-powered answers.',
    long: 'Aberdeen and Scotland SEO combined with Generative Engine Optimisation (GEO) ensures you appear in traditional search results AND the AI summaries that are increasingly stealing clicks. Technical SEO, content, and local signals — all covered.',
    headline: 'Rank in search engines and AI answers with expert SEO & GEO services',
    intro: '',
    why: '',
    process: [],
    deliverables: [],
    faq: [],
  },
  {
    slug: 'media',
    num: '04',
    title: 'Organic & Paid Media',
    desc: 'One plan across the channels you own and the ones you buy.',
    long: 'Organic and paid pull in the same direction when the same person runs them. I build the audience through organic social, email and content distribution, and buy reach where buying it is worth the money: Google for active demand, LinkedIn for the accounts you want, Meta for people who already visited.',
    headline: 'Reach your buyers where they already are, earned and bought',
    intro: 'Advertising can put qualified leads in front of you within a week, but only if someone manages it properly. I have run B2B campaigns across Google, Microsoft and LinkedIn on budgets up to £200,000 a year, and the same thing holds every time: paid buys attention now, organic compounds it. Run apart, the two duplicate each other and argue over the credit. Run together, the audience you build organically is the one you retarget, and the post that earned attention on its own is the one worth paying to amplify.',
    why: 'Most B2B paid media is optimised for clicks rather than pipeline. The audience is drawn too wide, the traffic lands on a page that was written for nobody in particular, and nothing connects lead quality back to the bidding. Most B2B organic has a different problem: a company page posting product updates to an audience of its own staff and its competitors. One fix covers both. Decide who you are talking to, say something they would repeat to a colleague, and measure what pays your invoices rather than what the platform likes to report.',
    process: [
      { num: '01', title: 'Plan both sides together', body: 'I audit what you are already running: spend, audiences, creative, and the organic accounts nobody has posted to since the last campaign. Then we decide which job each channel does. Google Search captures demand that already exists. LinkedIn reaches the job titles and accounts you want before they start looking. Organic social and email build the audience that makes the paid cheaper, because retargeting people who already know you costs a fraction of finding strangers.' },
      { num: '02', title: 'Build and launch', body: 'I handle campaign structure, ad copy, landing page direction, conversion tracking and attribution, alongside a posting cadence you can sustain after I leave. Attribution matters more in B2B than anywhere: a lead that came from LinkedIn last week and converted through Google today has to be recorded properly, or you switch off the channel that started the relationship.' },
      { num: '03', title: 'Optimise and report', body: 'Each week I go through audience segments, ad variations, match types and bids, and through what the organic posts actually did. Anything that earns attention without spend gets amplified with it. Once a month you get plain English: what we spent, what it produced, what changes next. The loop that makes any of this improve runs from your sales team back to the campaign settings.' },
    ],
    deliverables: [
      'Channel plan covering organic and paid together',
      'Audience targeting, segmentation and retargeting pools',
      'Ad copy, creative direction and organic posting cadence',
      'Conversion tracking and attribution setup',
      'Landing page CRO recommendations',
      'Weekly optimisation and monthly reporting',
    ],
    proof: {
      stat: '2×',
      statLabel: 'leads, lower cost per acquisition',
      quote: 'Working with Yann was a turning point. He cut through the noise and gave us a clear strategy we could actually execute. Within three months we saw measurable results in both organic traffic and lead quality.',
      name: 'Chris Harvey',
      role: 'CEO',
      company: 'Viewport3',
      logo: logos.viewport3,
    },
    faq: [
      { q: 'How does this differ from SEO & GEO?', a: 'SEO and GEO win you visibility in search and in AI answers, where someone is already looking for what you sell. This service covers everything else that reaches them: paid campaigns on Google, LinkedIn and Meta, and the organic social, email and content distribution that build an audience between purchases. Most engagements run both, because search captures demand and media creates it.' },
      { q: 'Which platform should I advertise on?', a: 'It depends where your buyers are and what stage they are at. Google Search captures active demand from people already looking for what you sell. LinkedIn reaches specific job titles and company types before they start searching. Meta works for retargeting visitors who did not convert. Most B2B businesses benefit from Google first, LinkedIn second, Meta third.' },
      { q: 'What budget do I need to get started?', a: 'A focused local or niche Google Search campaign can produce results on £1,000 to £2,000 a month in ad spend. LinkedIn costs more per click and reaches decision-makers more precisely, so £2,000 a month is a sensible floor. Below those levels there is too little data to optimise on, and you are paying to guess.' },
      { q: 'Is organic worth it if we are already advertising?', a: 'It is what makes the advertising cheaper. Retargeting an audience that already recognises you converts at a fraction of the cost of cold reach, and the organic posts tell you which messages are worth putting budget behind before you spend anything finding out.' },
      { q: 'How long before I see results?', a: 'Google Search campaigns can generate leads in the first week. LinkedIn usually takes four to six weeks to settle on the right audience and creative. Organic works on a longer clock again: three months of consistent posting before the audience is worth retargeting. Expect three months before you have enough data to make confident decisions across the lot.' },
      { q: 'Can you manage campaigns we have already started?', a: 'Yes, and most clients arrive that way — spending, but not converting. I start with a full account audit, find what is wasting budget, and restructure before adding a penny of spend.' },
    ],
  },
  {
    slug: 'web',
    num: '05',
    title: 'Web & CRO',
    desc: 'Websites that convert — built on Webflow, fast, and built to rank.',
    long: 'Your website is your best salesperson. I design and build conversion-focused websites that load fast, rank well, and guide visitors toward a single goal. Webflow as the platform means you stay in control without needing a developer for every change.',
    headline: 'Your website should be generating leads — not just existing online',
    intro: 'Most SME websites describe the business but don\'t convert visitors into enquiries. They load slowly, bury the value proposition, and send everyone to the same contact page regardless of what they were looking for. I design and build websites that are conversion-focused from the first wireframe — built on Webflow so you stay in control without needing a developer for every change.',
    why: 'A website that doesn\'t convert is a leaky bucket. You can spend whatever you like on SEO and paid media, but if the site doesn\'t guide visitors toward a clear next step — with the right message, at the right moment — you\'re paying to fill a bucket with a hole in it. CRO fixes the hole before you pour more traffic in.',
    process: [
      { num: '01', title: 'Audit and strategy', body: 'I start with a conversion audit of your existing site: where visitors are dropping off, which pages have the highest exit rates, and what\'s stopping people from making contact. This shapes the build brief. We also confirm the technical SEO requirements — page architecture, URL structure, site speed targets — so the new site doesn\'t sacrifice search visibility for design.' },
      { num: '02', title: 'Design and build', body: 'Built on Webflow, with technical SEO embedded from the start: semantic HTML, Core Web Vitals optimisation, structured data, and clean canonical structure. Every page is built around a single conversion goal. Landing pages for paid campaigns get their own variants, tested against each other to improve conversion rate over time.' },
      { num: '03', title: 'Connect and hand over', body: 'Integration with your existing tools: Google Analytics, Search Console, CRM, email platform, live chat. I train you on the Webflow CMS so you can update content without touching code. Post-launch, I monitor Core Web Vitals and conversion rates and flag anything that needs attention.' },
    ],
    deliverables: [
      'Conversion audit of existing site',
      'UX and information architecture recommendations',
      'Webflow design and build',
      'Technical SEO embedded from build',
      'CMS setup and team training',
      'Core Web Vitals optimisation',
      'Martech integration (GA4, CRM, email)',
    ],
    proof: {
      stat: '500%',
      statLabel: 'organic traffic growth',
      quote: 'Yann transformed our martech stack and used data insights to develop highly effective marketing campaigns. His efforts resulted in increased brand visibility and a 100% increase in lead generation performance.',
      name: 'Debbie Mackenzie',
      role: 'Managing Director',
      company: 'Proactis Tenders',
      logo: logos.proactis,
    },
    faq: [
      { q: 'Why Webflow and not WordPress?', a: 'Webflow gives you a visual CMS that\'s fast to build, easy for non-developers to update, and produces clean, performant code without a plugin ecosystem to maintain. It\'s also significantly faster than a typical WordPress install out of the box. For clients who have a specific reason to stay on WordPress, I can work with that too.' },
      { q: 'Do you do design or just development?', a: 'Both. I handle the full process from information architecture through visual design to the live Webflow build. If you have an existing brand identity I\'ll work within it; if not, I\'ll develop the visual direction as part of the project.' },
      { q: 'Can you improve our existing site without rebuilding it?', a: 'Often yes. A CRO audit can identify the highest-impact changes — sometimes a headline rewrite and a clearer CTA on the homepage moves the needle more than a full rebuild. I\'ll tell you honestly whether an audit-and-optimise or a rebuild is the right answer for your situation.' },
      { q: 'What does a website project cost?', a: 'A focused marketing site (home, services, about, contact) typically runs £3,000–£6,000. Larger sites with complex CMS structures, multiple landing pages, or e-commerce elements are scoped individually. The free 30-minute review is the right starting point.' },
    ],
  },
  {
    slug: 'leadership',
    num: '06',
    title: 'Marketing Leadership',
    desc: 'Someone senior running your marketing, a day or two a week.',
    long: 'Your marketing needs someone senior deciding what it does and answering for what it produces. I take that seat one or two days a week: setting the direction, running the plan, managing whoever executes it, and reporting to you or your board in plain English.',
    headline: 'Senior marketing direction, without a senior hire',
    intro: 'Plenty of SMEs have marketing activity and no marketing leadership. A junior marketer doing their best with no brief, or an agency that reports impressions and invoices monthly. The work happens, but nobody owns the question of whether it is the right work. That is the seat I take, one or two days a week instead of a salary.',
    why: 'A marketing director in Aberdeen costs £60,000 to £80,000 before employer costs, so most SMEs leave the role unfilled and the decisions fall to whoever is nearest. Budget follows whatever is easiest to measure. You brief an agency in a sentence, then judge it on whether the invoice felt worth paying. Campaigns start when someone has a free week. Every one of those is a decision nobody was appointed to make, and at this size making them is not a full-time job.',
    process: [
      { num: '01', title: 'Take stock', body: 'I start where a new marketing director would: what you have spent, what it produced, who does what, and which contracts you are already committed to. That means the numbers, including pipeline, sources and cost per lead where anyone has tracked it, and the people, including any agency or freelancer already on the books. You get an honest read on what works, what does not, and what nobody owns.' },
      { num: '02', title: 'Set the direction and own it', body: 'You get a plan with priorities, a budget mapped to them, and one number per activity that decides whether it continues. Then I run it: briefing whoever executes, holding agencies to the numbers they signed up to, and making the trade-offs when they arrive instead of parking them until the next quarter. You stay in the decisions that change the business and out of the weekly ones.' },
      { num: '03', title: 'Report, adjust, and hand over', body: 'Each month, a review you could take to a board or a bank: what we spent, what it produced, what changes next and why. The role should shrink as the function matures. Part of the job is telling you when you are ready to hire in-house, and writing the brief for that hire.' },
    ],
    deliverables: [
      'Fractional marketing director, one or two days a week',
      'Marketing plan, budget allocation and quarterly priorities',
      'Agency and freelancer selection, briefing and management',
      'Reporting pack for you, your board or your investors',
      'Team mentoring for an in-house marketer',
      'Recruitment support when the role becomes full-time',
    ],
    proof: {
      stat: '+38%',
      statLabel: 'demo request uplift at Viewport3',
      quote: 'Working with Yann was a turning point. He cut through the noise and gave us a clear strategy we could actually execute. Within three months we saw measurable results in both organic traffic and lead quality.',
      name: 'Chris Harvey',
      role: 'CEO',
      company: 'Viewport3',
      logo: logos.viewport3,
    },
    faq: [
      { q: 'How is this different from the strategy service?', a: 'Strategy is a project with an end: research, decisions, a plan you own. Leadership is the seat that runs the plan month after month and changes it when the evidence says so. Engagements often start as strategy and become leadership, because a plan with nobody running it goes back in a drawer.' },
      { q: 'How much of your week do we get?', a: 'One or two days, split across the week rather than taken in a block, so decisions do not wait five days and I am not managing agencies in arrears. The first month usually runs heavier while I get across your numbers and your people.' },
      { q: 'Do you replace our agency or our marketer?', a: 'Neither, most of the time. The execution is usually fine and the direction is missing, so I manage what you already have. If an agency is not delivering I will show you the numbers and help you replace them, but that is a finding rather than the starting assumption.' },
      { q: 'What happens when we are ready to hire in-house?', a: 'That is the intended ending. I write the role, sit in on interviews, and hand over a function with a plan, a budget and reporting already in place. Whoever takes it on gets a far easier first six months than someone inheriting a blank page.' },
    ],
  },
];

export const cases = [
  {
    slug: 'arnlea',
    client: 'Arnlea',
    year: '2025',
    descriptor: 'Inbound Growth',
    stat: '#1 Rank',
    statSub: '500% organic traffic growth',
    image: '/work/Arnlea-H.avif',
    logo: logos.arnlea,
    summary: 'Took Arnlea from invisible in search to top-3 rankings, generating 100+ qualified visits per month.',
  },
  {
    slug: 'viewport3',
    client: 'Viewport3',
    year: '2026',
    descriptor: 'Positioning & SEO',
    stat: '+38%',
    statSub: 'demo request uplift',
    image: '/work/clamp.avif',
    logo: logos.viewport3,
    summary: 'Repositioned Viewport3 from a generic tech agency to a specialist digital twin partner, driving demo request uplift.',
  },
  {
    slug: 'BowtieMaster',
    client: 'BowtieMaster',
    year: '2026',
    descriptor: 'SEO & PPC for lead gen',
    stat: 'x7 leads/month',
    statSub: 'demo request uplift',
    image: '',
    logo: logos.bowtiemaster,
    summary: 'Audited BowtieMaster website and Google Ads campaigns for lead generation, driving demo request uplift.',
  },
] as const;

export const ticker = [
  '100% organic traffic growth',
  '20+ years B2B experience',
  '#1 Google rank in 4 weeks',
  'Aberdeen · Scotland · Remote',
  'SEO & GEO specialist',
  'Free 30-min strategy review',
  'B2B focused',
  '100+ qualified leads/month',
];

export const numbers = [
  { num: '20+', label: 'Years B2B experience' },
  { num: '100%', label: 'Organic traffic growth' },
  { num: '#1', label: 'Google rank in 4 weeks' },
  { num: '100+', label: 'Qualified leads/month' },
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

export const testimonials: Testimonial[] = [
  {
    quote: 'Yann transformed our martech stack and used data insights to develop highly effective marketing campaigns. His efforts resulted in increased brand visibility and a 100% increase in lead generation performance over a period of just 12 months.',
    name: 'Debbie Mackenzie',
    role: 'Managing Director',
    company: 'Proactis Tenders',
    location: 'Scotland',
    logo: logos.proactis,
  },
  {
    quote: 'Working with Yann was a turning point. He cut through the noise and gave us a clear strategy we could actually execute. Within three months we saw measurable results in both organic traffic and lead quality.',
    name: 'Chris Harvey',
    role: 'CEO',
    company: 'Viewport3',
    location: 'Aberdeen',
    logo: logos.viewport3,
  },
  {
    quote: 'Yann doesn\'t do fluff. He came in, understood our business quickly, and delivered a positioning and SEO strategy that\'s already showing results. I\'d recommend him to any SME serious about growth.',
    name: 'Claire Murray',
    role: 'Head of Business Development',
    company: 'Arnlea Systems',
    location: 'Aberdeen',
    logo: logos.arnlea,
  },
];

export const faq = [
  {
    q: 'Do you work with companies outside Aberdeen?',
    a: 'Yes — I work remotely with clients across Scotland and the rest of the UK. Most of my work is delivered online, so location isn\'t a barrier.',
  },
  {
    q: 'What size of company do you typically work with?',
    a: 'B2B SMEs with 5–100 employees, typically with an existing sales team but a marketing function that\'s under-resourced or under-performing.',
  },
  {
    q: 'How does the free 30-minute strategy review work?',
    a: 'We talk through your current situation, your biggest growth challenge, and where you\'re losing opportunities. I\'ll share what I\'d prioritise. No pitch, no agenda — just a useful conversation.',
  },
  {
    q: 'Do you offer retainers or project-based work?',
    a: 'Both. I offer monthly retainers for ongoing strategy and execution, and fixed-scope projects for specific deliverables like a positioning sprint or SEO audit.',
  },
];
