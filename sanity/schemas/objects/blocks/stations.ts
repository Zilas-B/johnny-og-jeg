import { BulbOutlineIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock, proseBlock } from './_shared'

// `.stations` band from Cash og Jesus.html: a kicker/heading/deck intro followed
// by a list of numbered "stations". Each station has a left number-block (roman +
// years + location) and a right column of heading / where-label / prose, plus an
// optional blockquote (stations IV & V have none).
export const stations = defineType({
  name: 'stations',
  title: 'Stationer',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'Fx "— Stationer på en faldet vej —".',
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
      title: 'Stationer',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stationItem',
          title: 'Station',
          fields: [
            defineField({ name: 'roman', title: 'Romertal', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'years', title: 'Årstal', description: 'Fx "— 1935 —".', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'location', title: 'Sted (tag)', description: 'Fx "Dyess · AR".', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'heading', title: 'Titel (H3)', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'where', title: 'Hvor-linje', description: 'Fx "Dyess Baptist Church · Mississippi River Delta".', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'body',
              title: 'Brødtekst',
              type: 'array',
              of: [proseBlock],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'quote',
              title: 'Citat (valgfrit)',
              description: 'Blockquote med kildeangivelse. Udelades på stationer uden citat.',
              type: 'object',
              fields: [
                defineField({ name: 'text', title: 'Citat', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
                defineField({ name: 'attribution', title: 'Kildeangivelse', type: 'string', validation: (Rule) => Rule.required() }),
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
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Stationer',
      subtitle: `Stationer · ${items?.length ?? 0} stk.`,
    }),
  },
})
