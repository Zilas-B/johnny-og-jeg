import { StarIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock, proseBlock } from './_shared'

// `.hymn-hero` band from Cash og Jesus.html. A dark hero (accent-deep bg) with a
// left text column and a right stained-glass figure. The glass art itself is
// pure CSS in the component; only its two caption strings are authored.
export const hymnHero = defineType({
  name: 'hymnHero',
  title: 'Hero Block (hymn)',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'E.g. “Side B · Hymnal No. 14”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'romanNumeral',
      title: 'Roman numeral',
      description: 'E.g. “II.”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      description: 'H1. Use *italic* for the emphasised (brass) word, e.g. “Cash *og* Jesus.”.',
      type: 'array',
      of: [inlineBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lede',
      title: 'Lede',
      description: 'The first paragraph gets a drop cap.',
      type: 'array',
      of: [proseBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metaItems',
      title: 'Meta line',
      description: 'Shown separated by vertical bars. The value is highlighted in bold.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Text', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'value', title: 'Bold value', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'glassCaptionTop',
      title: 'Glass figure — caption above',
      description: 'E.g. “— Hymnal · No. 14 —”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'glassQuote',
      title: 'Glass figure — quote',
      description: 'E.g. “Were You There When They Crucified My Lord”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Hero Block (hymn)',
      subtitle: 'Hero Block (hymn)',
    }),
  },
})
