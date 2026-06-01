import { defineField, defineType } from 'sanity'

export const footerQuote = defineType({
  name: 'footerQuote',
  title: 'Footer-citat',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Citat',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      description: 'Fx "JR Cash".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
