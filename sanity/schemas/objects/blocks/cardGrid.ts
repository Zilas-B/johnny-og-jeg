import { ThLargeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock, proseBlock } from './_shared'

// `.anatomy` band from Musikeren.html: kicker/heading/deck intro plus a four-up
// grid of numbered cards (roman numeral / tag / heading / body).
export const cardGrid = defineType({
  name: 'cardGrid',
  title: 'Kort-gitter',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'Fx "— Anatomien af et sound —".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Overskrift',
      description: 'H2. Brug *kursiv* for fremhævet ord.',
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
      title: 'Kort',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'gridCard',
          title: 'Kort',
          fields: [
            defineField({ name: 'roman', title: 'Romertal', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'tag', title: 'Tag', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'cardHeading', title: 'Overskrift', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'cardBody',
              title: 'Brødtekst',
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
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Kort-gitter',
      subtitle: `Kort-gitter · ${cards?.length ?? 0} kort`,
    }),
  },
})
