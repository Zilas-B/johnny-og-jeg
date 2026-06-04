import { StarIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock, proseBlock } from './_shared'

// `.hymn-hero` band from Cash og Jesus.html. A dark hero (accent-deep bg) with a
// left text column and a right stained-glass figure. The glass art itself is
// pure CSS in the component; only its two caption strings are authored.
export const hymnHero = defineType({
  name: 'hymnHero',
  title: 'Salme-hero',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'Fx "Side B · Hymnal No. 14".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'romanNumeral',
      title: 'Romertal',
      description: 'Fx "II.".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Overskrift',
      description: 'H1. Brug *kursiv* for det fremhævede (brass) ord, fx "Cash *og* Jesus.".',
      type: 'array',
      of: [inlineBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lede',
      title: 'Indledning',
      description: 'Første afsnit får drop-cap.',
      type: 'array',
      of: [proseBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metaItems',
      title: 'Meta-linje',
      description: 'Vises adskilt af lodrette streger. Værdien fremhæves med fed.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Tekst', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'value', title: 'Fed værdi', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'glassCaptionTop',
      title: 'Glas-figur — overtekst',
      description: 'Fx "— Hymnal · No. 14 —".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'glassQuote',
      title: 'Glas-figur — citat',
      description: 'Fx "Were You There When They Crucified My Lord".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Salme-hero',
      subtitle: 'Salme-hero',
    }),
  },
})
