import { defineField, defineType } from 'sanity'

export const tickerItem = defineType({
  name: 'tickerItem',
  title: 'Milestone',
  type: 'object',
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'milestone',
      title: 'Milestone',
      description: 'E.g. “I WALK THE LINE”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { year: 'year', milestone: 'milestone' },
    prepare: ({ year, milestone }) => ({
      title: milestone,
      subtitle: year,
    }),
  },
})
