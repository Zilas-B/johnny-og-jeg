import { defineArrayMember, defineField, defineType } from 'sanity'

// A `.lside` sidebar box that renders a year/note list (the "Knudepunkter" box).
export const kulturenTimeline = defineType({
  name: 'kulturenTimeline',
  title: 'Timeline box',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      description: 'The box’s heading, e.g. “— Knudepunkter —”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'entries',
      title: 'Entries',
      type: 'array',
      of: [defineArrayMember({ type: 'kulturenTimelineEntry' })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { label: 'label', entries: 'entries' },
    prepare: ({ label, entries }) => ({
      title: label ?? 'Timeline',
      subtitle: `${(entries ?? []).length} entries`,
    }),
  },
})
