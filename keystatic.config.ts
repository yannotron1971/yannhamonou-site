import { config, collection, singleton, fields } from '@keystatic/core';

const isProduction = import.meta.env.PROD;

export default config({
  storage: isProduction
    ? {
        kind: 'github',
        repo: { owner: 'yannhamonou', name: 'yannhamonou-site' },
        branchPrefix: 'keystatic/',
      }
    : { kind: 'local' },

  ui: {
    brand: { name: 'Yann Hamonou' },
  },

  collections: {
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
