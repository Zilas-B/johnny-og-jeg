import { defineField, defineType } from 'sanity'

export const cta = defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      description: 'Fx "Bestil foredrag →".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Sti',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
