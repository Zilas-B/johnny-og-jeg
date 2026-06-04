import { ArrowRightIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock } from './_shared'

// `.next-side` band from Musikeren.html: "Vend pladen" footer with linked cards
// to sibling essays. Each card carries its own colour scheme (denim / brass),
// intrinsic to the band and distinct from the page accent.
export const nextEssay = defineType({
  name: 'nextEssay',
  title: 'Næste essay',
  type: 'object',
  icon: ArrowRightIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'Fx "— Vend pladen —".',
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
      name: 'cards',
      title: 'Kort',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'nextCard',
          title: 'Kort',
          fields: [
            defineField({ name: 'roman', title: 'Romertal', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'tag', title: 'Tag', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'cardHeading', title: 'Titel', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'cta', title: 'Handlingstekst', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', title: 'Sti', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'colorScheme',
              title: 'Farve',
              type: 'string',
              options: {
                list: [
                  { title: 'Barn (rød)', value: 'barn' },
                  { title: 'Denim (blå)', value: 'denim' },
                  { title: 'Brass (gul)', value: 'brass' },
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
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Næste essay',
      subtitle: `Næste essay · ${cards?.length ?? 0} kort`,
    }),
  },
})
