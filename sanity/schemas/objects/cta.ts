import { defineField, defineType } from 'sanity'

export const cta = defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      description: 'E.g. “Bestil foredrag →”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Path',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
