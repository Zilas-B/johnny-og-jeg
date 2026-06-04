import { OlistIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock, proseBlock } from './_shared'

// `.eras` band from Musikeren.html: a kicker/heading/deck intro followed by a
// stepped list of items. Each item has a year-stamped left column (years /
// label / tag) and a right column of prose + a grid of "cut" link cards.
export const steppedList = defineType({
  name: 'steppedList',
  title: 'Trinliste (epoker)',
  type: 'object',
  icon: OlistIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'Fx "— Fire epoker, én stemme —".',
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
      name: 'items',
      title: 'Trin',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'eraItem',
          title: 'Trin',
          fields: [
            defineField({ name: 'years', title: 'Årstal', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'label', title: 'Titel', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'tag',
              title: 'Tag-linjer',
              description: 'Hver linje: en label og en fremhævet værdi.',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'value', title: 'Fed værdi', type: 'string', validation: (Rule) => Rule.required() }),
                  ],
                  preview: { select: { title: 'label', subtitle: 'value' } },
                }),
              ],
            }),
            defineField({
              name: 'body',
              title: 'Brødtekst',
              type: 'array',
              of: [proseBlock],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'cuts',
              title: 'Spor',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'cutItem',
                  title: 'Spor',
                  fields: [
                    defineField({ name: 'cutLabel', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'cutTitle', title: 'Titel', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'cutDuration', title: 'År · varighed', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({
                      name: 'cutHref',
                      title: 'Link',
                      type: 'url',
                      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
                    }),
                  ],
                  preview: { select: { title: 'cutTitle', subtitle: 'cutLabel' } },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'label', subtitle: 'years' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { heading: 'heading', items: 'items' },
    prepare: ({ heading, items }) => ({
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Trinliste',
      subtitle: `Trinliste · ${items?.length ?? 0} trin`,
    }),
  },
})
