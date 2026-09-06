import { defineField, defineType } from 'sanity'

export const vinylTrack = defineType({
  name: 'vinylTrack',
  title: 'Song',
  type: 'object',
  fields: [
    defineField({
      name: 'track',
      title: 'Position',
      description: 'On the record, e.g. “A1”, “B2”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      description: 'E.g. “2:42”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { track: 'track', title: 'title', duration: 'duration' },
    prepare: ({ track, title, duration }) => ({
      title: `${track} · ${title}`,
      subtitle: duration,
    }),
  },
})
