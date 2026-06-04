import { BookIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import { inlineBlock } from './_shared'

// Home-only block (Step 7e). The "En salme for republikken" pull-quote band
// from `Johnny og jeg.html`: a kicker, a blockquote, and an attribution line.
export const hymn = defineType({
  name: 'hymn',
  title: 'Forside — salme',
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
      title: 'Citat',
      type: 'array',
      of: [inlineBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribuering',
      description: 'Fx "Mads ✶ Forord til “Johnny og jeg” ✶ 2026".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { attribution: 'attribution' },
    prepare: ({ attribution }) => ({ title: 'Forside — salme', subtitle: attribution }),
  },
})
