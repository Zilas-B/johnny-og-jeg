import { defineField, defineType } from 'sanity'

export const tickerItem = defineType({
  name: 'tickerItem',
  title: 'Ticker-element',
  type: 'object',
  fields: [
    defineField({
      name: 'year',
      title: 'Årstal',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'milestone',
      title: 'Milepæl',
      description: 'Fx "I WALK THE LINE".',
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
