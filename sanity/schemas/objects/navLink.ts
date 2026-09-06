import { defineField, defineType } from 'sanity'

export const navLink = defineType({
  name: 'navLink',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'mark',
      title: 'Mark',
      description: 'Small mark before the label, e.g. “○”, “I”, “II”, “A”. Optional.',
      type: 'string',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Path',
      description: 'Internal path, e.g. “/musikeren”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href', mark: 'mark' },
    prepare: ({ title, subtitle, mark }) => ({
      title: mark ? `${mark} · ${title}` : title,
      subtitle,
    }),
  },
})
