import { BulbOutlineIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock, proseBlock } from './_shared'

// `.stations` band from Cash og Jesus.html: a kicker/heading/deck intro followed
// by a list of numbered "stations". Each station has a left number-block (roman +
// years + location) and a right column of heading / where-label / prose, plus an
// optional blockquote (stations IV & V have none).
export const stations = defineType({
  name: 'stations',
  title: 'Stations',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'E.g. “— Stationer på en faldet vej —”.',
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
      title: 'Stations',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stationItem',
          title: 'Station',
          fields: [
            defineField({ name: 'roman', title: 'Roman numeral', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'years', title: 'Years', description: 'E.g. “— 1935 —”.', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'location', title: 'Location (tag)', description: 'E.g. “Dyess · AR”.', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'heading', title: 'Title (H3)', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'where', title: 'Where line', description: 'E.g. “Dyess Baptist Church · Mississippi River Delta”.', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'array',
              of: [proseBlock],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'quote',
              title: 'Quote (optional)',
              description: 'Blockquote with attribution. Leave empty on stations without a quote.',
              type: 'object',
              fields: [
                defineField({ name: 'text', title: 'Quote', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
                defineField({ name: 'attribution', title: 'Attribution', type: 'string', validation: (Rule) => Rule.required() }),
              ],
            }),
          ],
          preview: { select: { title: 'heading', subtitle: 'years' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { heading: 'heading', items: 'items' },
    prepare: ({ heading, items }) => ({
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Stations',
      subtitle: `Stations · ${items?.length ?? 0} stations`,
    }),
  },
})
