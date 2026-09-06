import { ArrowRightIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock } from './_shared'

// `.next-side` band from Musikeren.html: "Vend pladen" footer with linked cards
// to sibling essays. Each card carries its own colour scheme (denim / brass),
// intrinsic to the band and distinct from the page accent.
export const nextEssay = defineType({
  name: 'nextEssay',
  title: 'Next essay',
  type: 'object',
  icon: ArrowRightIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'E.g. “— Vend pladen —”.',
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
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'nextCard',
          title: 'Card',
          fields: [
            defineField({ name: 'roman', title: 'Roman numeral', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'tag', title: 'Tag', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'cardHeading', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'cta', title: 'Call to action', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', title: 'Path', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'colorScheme',
              title: 'Colour',
              type: 'string',
              options: {
                list: [
                  { title: 'Barn (red)', value: 'barn' },
                  { title: 'Denim (blue)', value: 'denim' },
                  { title: 'Brass (yellow)', value: 'brass' },
                ],
                layout: 'radio',
              },
              initialValue: 'denim',
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
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Next essay',
      subtitle: `Next essay · ${cards?.length ?? 0} cards`,
    }),
  },
})
