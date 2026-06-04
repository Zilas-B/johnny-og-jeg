import { ThListIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock, proseBlock } from './_shared'

// `.themes` band from Cash og Amerika.html: a kicker/heading/deck intro followed
// by a list of numbered "themes". Each theme has a left block (roman num + years
// + title + key tags) and a right column of prose plus an optional "song pin"
// link-out card.
export const themes = defineType({
  name: 'themes',
  title: 'Temaer',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'Fx "— Fem amerikanske tråde —".',
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
      title: 'Temaer',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'themeItem',
          title: 'Tema',
          fields: [
            defineField({ name: 'num', title: 'Romertal', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'when', title: 'Årstal', description: 'Fx "— 1932—2003 —".', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'title', title: 'Titel (H3)', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'keys',
              title: 'Nøgleord',
              description: 'Tags der vises i venstre kolonne.',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'body',
              title: 'Brødtekst',
              type: 'array',
              of: [proseBlock],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'song',
              title: 'Sang-pin (valgfri)',
              description: 'Link-out kort til et spor. Udelades hvis temaet ikke har ét.',
              type: 'object',
              fields: [
                defineField({ name: 'label', title: 'Label', description: 'Fx "— spor C1 · 1976 —".', type: 'string', validation: (Rule) => Rule.required() }),
                defineField({ name: 'title', title: 'Sangtitel', type: 'string', validation: (Rule) => Rule.required() }),
                defineField({
                  name: 'href',
                  title: 'Link (valgfrit)',
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
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Temaer',
      subtitle: `Temaer · ${items?.length ?? 0} stk.`,
    }),
  },
})
