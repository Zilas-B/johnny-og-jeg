import { BlockquoteIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock } from './_shared'

// `.lyric` band from Musikeren.html: a dark, centered pull-quote with decorative
// accent quote-marks (added by the renderer) and a star-separated attribution.
export const pullQuote = defineType({
  name: 'pullQuote',
  title: 'Pull quote',
  type: 'object',
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'E.g. “— Et hørestykke —”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      description: 'Each paragraph becomes one line. Use *italic* for emphasis.',
      type: 'array',
      of: [inlineBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      description: 'Pieces separated by ✶, e.g. “Folsom Prison Blues”, “1955”, “skrevet i Tyskland”.',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'background',
      title: 'Background',
      description: 'The band’s background colour. Defaults to dark (ink).',
      type: 'string',
      options: {
        list: [
          { title: 'Ink (dark)', value: 'ink' },
          { title: 'Accent (deep)', value: 'accentDeep' },
        ],
        layout: 'radio',
      },
      initialValue: 'ink',
    }),
    defineField({
      name: 'borderTone',
      title: 'Border colour',
      description: 'The colour of the top and bottom borders. Defaults to the page accent.',
      type: 'string',
      options: {
        list: [
          { title: 'Accent', value: 'accent' },
          { title: 'Brass (yellow)', value: 'brass' },
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
        (quote?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Pull quote',
      subtitle: 'Pull quote',
    }),
  },
})
