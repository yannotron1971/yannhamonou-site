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
      path: 'content/settings',
      schema: {
        navPhone: fields.text({ label: 'Nav phone number' }),
        testimonials: fields.array(
          fields.object({
            quote: fields.text({ label: 'Quote', multiline: true }),
            name: fields.text({ label: 'Name' }),
            role: fields.text({ label: 'Role' }),
            company: fields.text({ label: 'Company' }),
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
