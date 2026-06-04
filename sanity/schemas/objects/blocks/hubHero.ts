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
  title: 'Forside — hero',
  type: 'object',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'kicker',
          title: 'Kicker',
          description: 'Valgfri linje over titlen. Designet på forsiden viser ingen kicker — lad være tom.',
          type: 'string',
        }),
        defineField({
          name: 'title',
          title: 'Titel',
          description: 'Skriv "Johnny og jeg" — "og" gengives med en rød ampersand.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'deck',
          title: 'Deck',
          description: 'Italic intro-afsnit. Første bogstav får drop-cap.',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'meta',
          title: 'Meta-linjer',
          description: 'Op til 3 metadata-strenge, fx "Et essay af Mads", "Læsetid ~12 min."',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule) => Rule.max(3),
        }),
      ],
    }),
    defineField({
      name: 'signatureCard',
      title: 'Signaturkort',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'stamp',
          title: 'Stempel',
          description: 'Cirkulært stempel-tekst, fx "Sign. JR Cash 1955—2003".',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'foreLabel',
          title: 'Fore-label',
          description: 'Lille label over titlen, fx "— Forord —".',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'quote',
          title: 'Titel-citat',
          description: 'Fx "Hello. I’m Johnny Cash."',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'body',
          title: 'Brødtekst',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'scripture',
          title: 'Skriftsted',
          description: 'Citat fra Bibelen + reference.',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Tekst',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'reference',
              title: 'Reference',
              description: 'Fx "Rom. 1:16".',
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
    prepare: ({ title }) => ({ title: title || 'Forside — hero', subtitle: 'Hero' }),
  },
})
