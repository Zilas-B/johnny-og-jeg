import { ThListIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock, proseBlock } from './_shared'

// `.themes` band from Cash og Amerika.html: a kicker/heading/deck intro followed
// by a list of numbered "themes". Each theme has a left block (roman num + years
// + title + key tags) and a right column of prose plus an optional "song pin"
// link-out card.
export const themes = defineType({
  name: 'themes',
  title: 'Themes',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'E.g. “— Fem amerikanske tråde —”.',
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
      title: 'Themes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'themeItem',
          title: 'Theme',
          fields: [
            defineField({ name: 'num', title: 'Roman numeral', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'when', title: 'Years', description: 'E.g. “— 1932—2003 —”.', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'title', title: 'Title (H3)', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'keys',
              title: 'Keywords',
              description: 'Tags shown in the left column.',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'array',
              of: [proseBlock],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'song',
              title: 'Song pin (optional)',
              description: 'Link-out card to a Song. Leave empty if the theme has none.',
              type: 'object',
              fields: [
                defineField({ name: 'label', title: 'Label', description: 'E.g. “— spor C1 · 1976 —”.', type: 'string', validation: (Rule) => Rule.required() }),
                defineField({ name: 'title', title: 'Song title', type: 'string', validation: (Rule) => Rule.required() }),
                defineField({
                  name: 'href',
                  title: 'Link (optional)',
                  type: 'url',
                  validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
                }),
              ],
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'when' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { heading: 'heading', items: 'items' },
    prepare: ({ heading, items }) => ({
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Themes',
      subtitle: `Themes · ${items?.length ?? 0} themes`,
    }),
  },
})
