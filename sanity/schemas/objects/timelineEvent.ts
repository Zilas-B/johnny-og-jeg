import { defineArrayMember, defineField, defineType } from 'sanity'

export const timelineEvent = defineType({
  name: 'timelineEvent',
  title: 'Tidslinje-begivenhed',
  type: 'object',
  fields: [
    defineField({
      name: 'year',
      title: 'Årstal',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'place',
      title: 'Sted',
      description: 'Fx "Kingsland · Arkansas".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Overskrift',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
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
