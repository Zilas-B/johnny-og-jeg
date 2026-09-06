import { OlistIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock, proseBlock } from './_shared'

// `.eras` band from Musikeren.html: a kicker/heading/deck intro followed by a
// stepped list of items. Each item has a year-stamped left column (years /
// label / tag) and a right column of prose + a grid of "cut" link cards.
export const steppedList = defineType({
  name: 'steppedList',
  title: 'Stepped list (eras)',
  type: 'object',
  icon: OlistIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'E.g. “— Fire epoker, én stemme —”.',
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
      name: 'items',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'eraItem',
          title: 'Step',
          fields: [
            defineField({ name: 'years', title: 'Years', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'label', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'tag',
              title: 'Tag lines',
              description: 'Each line: a label and a highlighted value.',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'value', title: 'Bold value', type: 'string', validation: (Rule) => Rule.required() }),
                  ],
                  preview: { select: { title: 'label', subtitle: 'value' } },
                }),
              ],
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'array',
              of: [proseBlock],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'cuts',
              title: 'Songs',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'cutItem',
                  title: 'Song',
                  fields: [
                    defineField({ name: 'cutLabel', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'cutTitle', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'cutDuration', title: 'Year · duration', type: 'string', validation: (Rule) => Rule.required() }),
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
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Stepped list',
      subtitle: `Stepped list · ${items?.length ?? 0} steps`,
    }),
  },
})
