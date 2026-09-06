import { PlayIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock, proseBlock } from './_shared'

// `.vinyl-hero` + `.sound-ticker` band from Musikeren.html. Dark hero with a
// spinning vinyl graphic and a scrolling sound-ticker beneath it. The ticker is
// decorative chrome of the hero, so it lives in this block (never relocated).
export const vinylHero = defineType({
  name: 'vinylHero',
  title: 'Hero Block (vinyl)',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'E.g. “Side A · 33⅓ RPM”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'romanNumeral',
      title: 'Roman numeral',
      description: 'E.g. “I.”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      description: 'H1. Use *italic* for the red word, e.g. “*Musik*eren.”.',
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
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'vinylTop',
      title: 'Vinyl label — top',
      description: 'E.g. “— Sun Records —”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'vinylTitle',
      title: 'Vinyl label — title',
      description: 'E.g. “Musikeren”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'vinylBottom',
      title: 'Vinyl label — bottom',
      description: 'E.g. “Memphis · TN”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tickerItems',
      title: 'Sound ticker',
      description: 'Text pieces in the scrolling strip. Automatically separated by ✶ and repeated.',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Hero Block (vinyl)',
      subtitle: 'Hero Block (vinyl)',
    }),
  },
})
