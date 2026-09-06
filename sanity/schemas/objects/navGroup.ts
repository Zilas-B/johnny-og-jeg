import { defineArrayMember, defineField, defineType } from 'sanity'

export const navGroup = defineType({
  name: 'navGroup',
  title: 'Navigation group',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Path (if a plain link)',
      description: 'Use either a path here OR sub-items below — not both.',
      type: 'string',
    }),
    defineField({
      name: 'children',
      title: 'Sub-items',
      description: 'If filled in, the group renders as a dropdown.',
      type: 'array',
      of: [defineArrayMember({ type: 'navLink' })],
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value) => {
      const v = value as { href?: string; children?: unknown[] } | undefined
      const hasHref = Boolean(v?.href?.trim())
      const hasChildren = Boolean(v?.children?.length)
      if (hasHref && hasChildren) {
        return 'Choose either a path or sub-items — not both.'
      }
      if (!hasHref && !hasChildren) {
        return 'The group needs either a path or at least one sub-item.'
      }
      return true
    }),
  preview: {
    select: { title: 'label', href: 'href', children: 'children' },
    prepare: ({ title, href, children }) => ({
      title,
      subtitle: href || `${(children as unknown[] | undefined)?.length ?? 0} sub-item(s)`,
    }),
  },
})
