import { config, collection, singleton, fields } from '@keystatic/core';

const isProduction = import.meta.env.PROD;

export default config({
  storage: isProduction
    ? {
        kind: 'github',
        /* The owner is the account that actually holds the repo. It read
           'yannhamonou', which 404s — in production Keystatic would have
           authenticated against a repository that does not exist and the
           admin UI would have failed to read or write anything. */
        repo: { owner: 'yannotron1971', name: 'yannhamonou-site' },
        branchPrefix: 'keystatic/',
      }
    : { kind: 'local' },

  ui: {
    brand: { name: 'Yann Hamonou' },
  },

  collections: {
    /* Services and case studies are entities, not page copy: each one has its
       own URL, and several pages list them. The slug is the folder name, so
       renaming an entry in the UI would change its URL — which is why the
       slug field is the one thing here that is not free text. */
    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'content/services/*/',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Title' }, slug: { label: 'URL segment' } }),
        num: fields.text({ label: 'Number (01–06)' }),
        desc: fields.text({ label: 'One-line description', multiline: true }),
        long: fields.text({ label: 'Longer description', multiline: true }),
        headline: fields.text({ label: 'Page headline', multiline: true }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        why: fields.text({ label: 'Why it matters', multiline: true }),
        process: fields.array(
          fields.object({
            num: fields.text({ label: 'Step number' }),
            title: fields.text({ label: 'Step title' }),
            body: fields.text({ label: 'Step body', multiline: true }),
          }),
          { label: 'Process', itemLabel: (p) => `${p.fields.num.value} ${p.fields.title.value}` }
        ),
        deliverables: fields.array(fields.text({ label: 'Deliverable' }), {
          label: 'Deliverables',
          itemLabel: (p) => p.value,
        }),
        caseNote: fields.text({ label: 'Case note', multiline: true }),
        proof: fields.object({
          quote: fields.text({ label: 'Quote', multiline: true }),
          name: fields.text({ label: 'Name' }),
          role: fields.text({ label: 'Role' }),
          company: fields.text({ label: 'Company' }),
          logo: fields.select({ label: 'Client logo',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Arnlea', value: 'arnlea' },
                { label: 'Viewport3', value: 'viewport3' },
                { label: 'Bowtie Master', value: 'bowtiemaster' },
                { label: 'Incident Insight', value: 'incidentInsight' },
                { label: 'Proactis Tenders', value: 'proactis' },
              ],
            defaultValue: 'none' }),
        }, { label: 'Proof quote' }),
        faq: fields.array(
          fields.object({
            q: fields.text({ label: 'Question' }),
            a: fields.text({ label: 'Answer', multiline: true }),
          }),
          { label: 'FAQ', itemLabel: (p) => p.fields.q.value }
        ),
      },
    }),

    work: collection({
      label: 'Case studies',
      slugField: 'client',
      path: 'content/work/*/',
      format: { data: 'yaml' },
      schema: {
        client: fields.slug({ name: { label: 'Client' }, slug: { label: 'URL segment' } }),
        /* Explicit, because two of these share a year and a folder listing is
           alphabetical — which silently reordered the work page when these
           stopped being an array. */
        order: fields.integer({ label: 'Order', defaultValue: 1 }),
        year: fields.text({ label: 'Year' }),
        descriptor: fields.text({ label: 'What the work was' }),
        stat: fields.text({ label: 'Headline figure' }),
        statSub: fields.text({ label: 'Figure label' }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        image: fields.text({ label: 'Image path (optional)' }),
        /* An image that carries meaning needs a description. Left empty the
           plate falls back to its placeholder rather than shipping an
           undescribed photograph. */
        imageAlt: fields.text({ label: 'Image description (alt text)', multiline: true }),
        /* Square and portrait originals both crop to 16:9 here, so the case
           studies sit in one ratio. This says which part survives. */
        imageFocus: fields.select({
          label: 'Crop focus',
          options: [
            { label: 'Centre', value: 'center' },
            { label: 'Top', value: 'top' },
            { label: 'Bottom', value: 'bottom' },
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          defaultValue: 'center',
        }),
        logo: fields.select({ label: 'Client logo',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Arnlea', value: 'arnlea' },
                { label: 'Viewport3', value: 'viewport3' },
                { label: 'Bowtie Master', value: 'bowtiemaster' },
                { label: 'Incident Insight', value: 'incidentInsight' },
                { label: 'Proactis Tenders', value: 'proactis' },
              ],
          defaultValue: 'none' }),
        /* At-a-glance facts, so AI tools can read who, what, where and how
           long without parsing the prose. Left empty, a row is not shown. */
        industry: fields.text({ label: 'Industry' }),
        location: fields.text({ label: 'Client location' }),
        role: fields.text({ label: "Yann's role", multiline: true }),
        duration: fields.text({ label: 'Duration' }),
        challenge: fields.text({ label: 'The challenge', multiline: true }),
        approach: fields.array(fields.text({ label: 'Step' }), {
          label: 'The approach', itemLabel: (p) => p.value,
        }),
        results: fields.array(fields.text({ label: 'Result' }), {
          label: 'The results', itemLabel: (p) => p.value,
        }),
      },
    }),

    posts: collection({
      label: 'Journal',
      slugField: 'title',
      path: 'content/posts/*/',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        publishedDate: fields.date({ label: 'Published Date' }),
        modifiedDate: fields.date({ label: 'Modified Date' }),
        /* Path under /public, e.g. /images/signal/post-ai-search.webp. Shown
           greyscale on cards and returns to colour on hover. */
        coverImage: fields.text({ label: 'Cover image path (optional)' }),
        coverAlt: fields.text({ label: 'Cover image description' }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Strategy', value: 'strategy' },
            { label: 'SEO & GEO', value: 'seo' },
            { label: 'Paid Media', value: 'paid' },
            { label: 'Content', value: 'content' },
            { label: 'Industry', value: 'industry' },
          ],
          defaultValue: 'strategy',
        }),
        body: fields.markdoc({ label: 'Body' }),
      },
    }),
  },

  singletons: {
    /* Everything the homepage says, in the order the page says it (Signal
       Poster layout, Nov 2026). Headings are here too, not just body copy: an
       argument you cannot change without a developer is not really yours.
       Services, case studies, testimonials, FAQ and posts come from their own
       collections and settings, so they are not repeated here. */
    homepage: singleton({
      label: 'Homepage',
      path: 'content/homepage/',
      schema: {
        metaTitle: fields.text({ label: 'Browser / search title' }),
        metaDescription: fields.text({ label: 'Search description', multiline: true }),

        hero: fields.object({
          /* Small mono line set inside the h1, above the poster headline. It
             carries the phrase the homepage ranks for, so keep it literal. */
          kicker: fields.text({ label: 'Line above the headline (part of the h1, keep "marketing consultant" and "Aberdeen")' }),
          headline: fields.text({ label: 'Headline (h1)', multiline: true }),
          sub: fields.text({ label: 'One line under the headline', multiline: true }),
          ctaLabel: fields.text({ label: 'Button label' }),
          place: fields.text({ label: 'Place caption, top right (one line per line break)', multiline: true }),
        }, { label: 'Hero' }),

        clientsLabel: fields.text({ label: 'Client logos caption' }),

        challenges: fields.object({
          heading: fields.text({ label: 'Heading' }),
          intro: fields.text({ label: 'One line under the heading', multiline: true }),
          items: fields.array(fields.text({ label: 'Pain point' }), {
            label: 'Pain points (four read best)',
            itemLabel: (p) => p.value,
          }),
        }, { label: 'Challenges' }),

        servicesIntro: fields.object({
          heading: fields.text({ label: 'Heading' }),
          intro: fields.text({ label: 'Intro', multiline: true }),
        }, { label: 'Services' }),

        senior: fields.object({
          heading: fields.text({ label: 'Statement heading' }),
          body: fields.text({ label: 'Body (blank line between paragraphs)', multiline: true }),
          facts: fields.array(fields.text({ label: 'Fact' }), { label: 'Short fact list', itemLabel: (p) => p.value }),
        }, { label: 'Senior marketing band' }),

        proof: fields.object({
          statValue: fields.text({ label: 'Big number (digits only, counts up)' }),
          statSuffix: fields.text({ label: 'After the number, e.g. %' }),
          statLabel: fields.text({ label: 'What the number means', multiline: true }),
          casesLabel: fields.text({ label: 'Case studies caption' }),
        }, { label: 'Proof' }),

        process: fields.object({
          heading: fields.text({ label: 'Heading' }),
          steps: fields.array(
            fields.object({
              title: fields.text({ label: 'Step title' }),
              body: fields.text({ label: 'Step body', multiline: true }),
            }),
            { label: 'Steps (three)', itemLabel: (p) => p.fields.title.value }
          ),
        }, { label: 'How we work' }),

        pricing: fields.object({
          heading: fields.text({ label: 'Price line' }),
          body: fields.text({ label: 'Explanation', multiline: true }),
          facts: fields.array(fields.text({ label: 'Fact' }), { label: 'Short fact list', itemLabel: (p) => p.value }),
        }, { label: 'Pricing band' }),

        about: fields.object({
          heading: fields.text({ label: 'Heading' }),
          body: fields.text({ label: 'Body (blank line between paragraphs)', multiline: true }),
        }, { label: 'About' }),

        journal: fields.object({
          heading: fields.text({ label: 'Heading' }),
          moreLabel: fields.text({ label: 'Link label' }),
        }, { label: 'Journal' }),

        faqIntro: fields.object({
          heading: fields.text({ label: 'Heading' }),
        }, { label: 'FAQ' }),

        cta: fields.object({
          heading: fields.text({ label: 'Heading' }),
          body: fields.text({ label: 'Body', multiline: true }),
          buttonLabel: fields.text({ label: 'Form button label' }),
        }, { label: 'Closing band' }),
      },
    }),

    /* The marketing audit page (src/pages/services/marketing-audit.astro).
       The copy lives in the template; what is still being decided lives here.
       While "published" is off the page is noindex, left out of the sitemap
       and llms.txt, and not linked from anywhere. */
    marketingAudit: singleton({
      label: 'Marketing audit page',
      path: 'content/marketing-audit/',
      schema: {
        published: fields.checkbox({
          label: 'Published',
          description: 'Off: the page works at its URL but search engines, the sitemap, llms.txt and the services list ignore it.',
          defaultValue: false,
        }),
        price: fields.text({ label: 'Price as shown, e.g. £1,500' }),
        priceValue: fields.text({ label: 'Price as a number for schema, e.g. 1500' }),
        vatNote: fields.text({ label: 'VAT note after the price, e.g. plus VAT (leave empty for none)' }),
        creditDays: fields.text({ label: 'Days after the readout to credit the fee against a retainer' }),
      },
    }),

    settings: singleton({
      label: 'Site Settings',
      /* The trailing slash is load-bearing. Without it Keystatic looks for a
         file at content/settings.yaml, does not find one, and the reader
         returns null with no error — which is why this singleton had never
         been read by anything and its contents had drifted from the copies in
         src/data. */
      path: 'content/settings/',
      schema: {
        navPhone: fields.text({ label: 'Nav phone number' }),
        /* Site-wide credentials, not homepage copy: the same four figures
           run on the homepage proposition and on the About page, and two
           copies of a number is how they end up disagreeing. */
        figures: fields.array(
          fields.object({
            num: fields.text({ label: 'Figure' }),
            label: fields.text({ label: 'Label' }),
          }),
          { label: 'Headline figures', itemLabel: (p) => `${p.fields.num.value} ${p.fields.label.value}` }
        ),
        testimonials: fields.array(
          fields.object({
            quote: fields.text({ label: 'Quote', multiline: true }),
            name: fields.text({ label: 'Name' }),
            role: fields.text({ label: 'Role' }),
            company: fields.text({ label: 'Company' }),
            location: fields.text({ label: 'Location' }),
            /* The logo artwork carries per-file rendering rules — intrinsic
               size, whether it inverts on dark, whether it has colour to keep.
               Those belong with the file, so the editor picks which mark to
               use and the code supplies how to draw it. */
            logo: fields.select({
              label: 'Client logo',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Arnlea', value: 'arnlea' },
                { label: 'Viewport3', value: 'viewport3' },
                { label: 'Bowtie Master', value: 'bowtiemaster' },
                { label: 'Incident Insight', value: 'incidentInsight' },
                { label: 'Proactis Tenders', value: 'proactis' },
              ],
              defaultValue: 'none',
            }),
          }),
          { label: 'Testimonials', itemLabel: (p) => p.fields.name.value }
        ),
        faq: fields.array(
          fields.object({
            q: fields.text({ label: 'Question' }),
            a: fields.text({ label: 'Answer', multiline: true }),
          }),
          { label: 'FAQ', itemLabel: (p) => p.fields.q.value }
        ),
      },
    }),
  },
});
