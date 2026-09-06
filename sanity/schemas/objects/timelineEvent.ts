import { defineArrayMember, defineField, defineType } from 'sanity'

export const timelineEvent = defineType({
  name: 'timelineEvent',
  title: 'Timeline event',
  type: 'object',
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'place',
      title: 'Place',
      description: 'E.g. “Kingsland · Arkansas”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [defineArrayMember({ type: 'block', styles: [{ title: 'Normal', value: 'normal' }], lists: [] })],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { year: 'year', heading: 'heading', place: 'place' },
    prepare: ({ year, heading, place }) => ({
      title: `${year} — ${heading}`,
      subtitle: place,
    }),
  },
})
