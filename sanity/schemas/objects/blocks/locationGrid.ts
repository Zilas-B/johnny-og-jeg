import { PinIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock, proseBlock } from './_shared'

// `.ameri-map` band from Cash og Amerika.html: a kicker/heading/deck intro and a
// 4-up grid of place cards (tag + name + coordinates + short description). A
// decorative star-rosette is rendered by the component.
export const locationGrid = defineType({
  name: 'locationGrid',
  title: 'Steds-gitter',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'Fx "— Et atlas i sange —".',
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
      title: 'Steder',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'locationCard',
          title: 'Sted',
          fields: [
            defineField({ name: 'placeTag', title: 'Steds-tag', description: 'Fx "Mississippi River · AR".', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'name', title: 'Navn (H4)', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'coords', title: 'Koordinater', description: 'Fx "35.5870° N · 90.2090° W".', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'body', title: 'Beskrivelse', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'name', subtitle: 'placeTag' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { heading: 'heading', cards: 'cards' },
    prepare: ({ heading, cards }) => ({
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Steds-gitter',
      subtitle: `Steder · ${cards?.length ?? 0} stk.`,
    }),
  },
})
