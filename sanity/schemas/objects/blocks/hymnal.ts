import { ThListIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock, proseBlock } from './_shared'

// `.hymnal` band from Cash og Jesus.html: a playlist styled as a printed hymnal —
// a kicker/heading/deck intro and a two-column grid of "hymnal pages". Each column
// has a header + subhead and a list of song rows linking out (YouTube etc.).
export const hymnal = defineType({
  name: 'hymnal',
  title: 'Hymnal',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'E.g. “— Hymnal No. 14 · Cash & Jesus —”.',
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
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'hymnalColumn',
          title: 'Column',
          fields: [
            defineField({ name: 'header', title: 'Header', description: 'E.g. “Side B · Salmerne”.', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'subhead', title: 'Subheading', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'rows',
              title: 'Songs',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'hymnRow',
                  title: 'Song',
                  fields: [
                    defineField({ name: 'number', title: 'No.', description: 'E.g. “B1”.', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'sub', title: 'Album · year', description: 'E.g. “Hymns · 1959”.', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({ name: 'duration', title: 'Duration', description: 'E.g. “4:11”.', type: 'string', validation: (Rule) => Rule.required() }),
                    defineField({
                      name: 'href',
                      title: 'Link',
                      type: 'url',
                      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
                    }),
                  ],
                  preview: { select: { title: 'title', subtitle: 'sub' } },
                }),
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: { select: { title: 'header', subtitle: 'subhead' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { heading: 'heading', columns: 'columns' },
    prepare: ({ heading, columns }) => ({
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Hymnal',
      subtitle: `Hymnal · ${columns?.length ?? 0} columns`,
    }),
  },
})
