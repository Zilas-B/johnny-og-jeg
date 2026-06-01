import { defineField, defineType } from 'sanity'

export const vinylTrack = defineType({
  name: 'vinylTrack',
  title: 'Spor',
  type: 'object',
  fields: [
    defineField({
      name: 'track',
      title: 'Spor-nr.',
      description: 'Fx "A1", "B2".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Længde',
      description: 'Fx "2:42".',
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
