import { defineField, defineType } from 'sanity'

export const navLink = defineType({
  name: 'navLink',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'mark',
      title: 'Mark',
      description: 'Lille tegn foran labelen, fx "○", "I", "II", "A". Valgfri.',
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
      title: 'Sti',
      description: 'Intern sti, fx "/musikeren".',
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
