import { HomeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import { inlineBlock } from './_shared'

// Home-only block (Step 7e). The hub's opening section from
// `Johnny og jeg.html`: a two-column hero (title + deck + meta on the left, a
// signature card `<aside>` on the right). Hero and signature card live in one
// block because `HubHero` renders them as a single grid — they can't be
// reordered apart.
export const hubHero = defineType({
  name: 'hubHero',
  title: 'Front page — Hero Block',
  type: 'object',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'hero',
      title: 'Text column',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'kicker',
          title: 'Kicker',
          description: 'Optional line above the title. The front page design shows no kicker — leave empty.',
          type: 'string',
        }),
        defineField({
          name: 'title',
          title: 'Title',
          description: 'Write “Johnny og jeg” — “og” is rendered as a red ampersand.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'deck',
          title: 'Deck',
          description: 'Italic intro paragraph. The first letter gets a drop cap.',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'meta',
          title: 'Meta lines',
          description: 'Up to 3 metadata strings, e.g. “Et essay af Mads”, “Læsetid ~12 min.”',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule) => Rule.max(3),
        }),
      ],
    }),
    defineField({
      name: 'signatureCard',
      title: 'Hero Foreword',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'foreLabel',
          title: 'Foreword label',
          description: 'Small label above the title, e.g. “— Forord —”.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'quote',
          title: 'Title quote',
          description: 'E.g. “Hello. I’m Johnny Cash.”',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'scripture',
          title: 'Scripture',
          description: 'A Bible quote plus its reference.',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'reference',
              title: 'Reference',
              description: 'E.g. “Rom. 1:16”.',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'hero.title' },
    prepare: ({ title }) => ({ title: title || 'Front page — Hero Block', subtitle: 'Hero Block' }),
  },
})
