import { BlockquoteIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock } from './_shared'

// `.lyric` band from Musikeren.html: a dark, centered pull-quote with decorative
// accent quote-marks (added by the renderer) and a star-separated attribution.
export const pullQuote = defineType({
  name: 'pullQuote',
  title: 'Citat-band',
  type: 'object',
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'Fx "— Et hørestykke —".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Citat',
      description: 'Hvert afsnit bliver en linje. Brug *kursiv* for fremhævning.',
      type: 'array',
      of: [inlineBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Kildeangivelse',
      description: 'Stykker adskilt af ✶, fx "Folsom Prison Blues", "1955", "skrevet i Tyskland".',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'background',
      title: 'Baggrund',
      description: 'Bandets baggrundsfarve. Standard er mørk (ink).',
      type: 'string',
      options: {
        list: [
          { title: 'Ink (mørk)', value: 'ink' },
          { title: 'Accent (dyb)', value: 'accentDeep' },
        ],
        layout: 'radio',
      },
      initialValue: 'ink',
    }),
    defineField({
      name: 'borderTone',
      title: 'Kantfarve',
      description: 'Farven på over- og underkant. Standard følger sidens accent.',
      type: 'string',
      options: {
        list: [
          { title: 'Accent', value: 'accent' },
          { title: 'Brass (gul)', value: 'brass' },
        ],
        layout: 'radio',
      },
      initialValue: 'accent',
    }),
  ],
  preview: {
    select: { quote: 'quote' },
    prepare: ({ quote }) => ({
      title:
        (quote?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Citat-band',
      subtitle: 'Citat-band',
    }),
  },
})
