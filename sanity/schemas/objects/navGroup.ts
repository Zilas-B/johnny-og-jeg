import { defineArrayMember, defineField, defineType } from 'sanity'

export const navGroup = defineType({
  name: 'navGroup',
  title: 'Navigationsgruppe',
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
      title: 'Sti (hvis simpelt link)',
      description: 'Brug enten en sti her ELLER underpunkter nedenfor — ikke begge.',
      type: 'string',
    }),
    defineField({
      name: 'children',
      title: 'Underpunkter',
      description: 'Hvis udfyldt vises gruppen som dropdown.',
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
        return 'Vælg enten sti eller underpunkter — ikke begge.'
      }
      if (!hasHref && !hasChildren) {
        return 'Gruppen skal enten have en sti eller mindst ét underpunkt.'
      }
      return true
    }),
  preview: {
    select: { title: 'label', href: 'href', children: 'children' },
    prepare: ({ title, href, children }) => ({
      title,
      subtitle: href || `${(children as unknown[] | undefined)?.length ?? 0} underpunkt(er)`,
    }),
  },
})
