import { defineArrayMember, defineField, defineType } from 'sanity'

export const footerColumn = defineType({
  name: 'footerColumn',
  title: 'Footer-kolonne',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Overskrift',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({ type: 'navLink' })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'title', links: 'links' },
    prepare: ({ title, links }) => ({
      title,
      subtitle: `${(links as unknown[] | undefined)?.length ?? 0} link(s)`,
    }),
  },
})
