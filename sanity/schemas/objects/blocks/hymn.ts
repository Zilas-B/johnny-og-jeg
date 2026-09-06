import { BookIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import { inlineBlock } from './_shared'

// Home-only block (Step 7e). The "En salme for republikken" pull-quote band
// from `Johnny og jeg.html`: a kicker, a blockquote, and an attribution line.
export const hymn = defineType({
  name: 'hymn',
  title: 'Front page — hymn',
  type: 'object',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'array',
      of: [inlineBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      description: 'E.g. Mads ✶ Forord til “Johnny og jeg” ✶ 2026.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { attribution: 'attribution' },
    prepare: ({ attribution }) => ({ title: 'Front page — hymn', subtitle: attribution }),
  },
})
