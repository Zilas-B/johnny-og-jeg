import { defineField, defineType } from 'sanity'

export const footerQuote = defineType({
  name: 'footerQuote',
  title: 'Footer quote',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      description: 'E.g. “JR Cash”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
