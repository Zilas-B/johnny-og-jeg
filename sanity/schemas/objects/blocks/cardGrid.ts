import { ThLargeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock, proseBlock } from './_shared'

// `.anatomy` band from Musikeren.html: kicker/heading/deck intro plus a four-up
// grid of numbered cards (roman numeral / tag / heading / body).
export const cardGrid = defineType({
  name: 'cardGrid',
  title: 'Card grid',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'E.g. “— Anatomien af et sound —”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      description: 'H2. Use *italic* for the emphasised word.',
      type: 'array',
      of: [inlineBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'deck',
      title: 'Deck',
      type: 'array',
      of: [proseBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'gridCard',
          title: 'Card',
          fields: [
            defineField({ name: 'roman', title: 'Roman numeral', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'tag', title: 'Tag', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'cardHeading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'cardBody',
              title: 'Body',
              type: 'array',
              of: [proseBlock],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: 'cardHeading', subtitle: 'tag' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { heading: 'heading', cards: 'cards' },
    prepare: ({ heading, cards }) => ({
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Card grid',
      subtitle: `Card grid · ${cards?.length ?? 0} cards`,
    }),
  },
})
