import { PlayIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock, proseBlock } from './_shared'

// `.vinyl-hero` + `.sound-ticker` band from Musikeren.html. Dark hero with a
// spinning vinyl graphic and a scrolling sound-ticker beneath it. The ticker is
// decorative chrome of the hero, so it lives in this block (never relocated).
export const vinylHero = defineType({
  name: 'vinylHero',
  title: 'Vinyl-hero',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'Fx "Side A · 33⅓ RPM".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'romanNumeral',
      title: 'Romertal',
      description: 'Fx "I.".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Overskrift',
      description: 'H1. Brug *kursiv* for det røde ord, fx "*Musik*eren.".',
      type: 'array',
      of: [inlineBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lede',
      title: 'Indledning',
      description: 'Første afsnit får drop-cap.',
      type: 'array',
      of: [proseBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metaItems',
      title: 'Meta-linje',
      description: 'Vises adskilt af lodrette streger. Værdien fremhæves med fed.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Tekst', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'value', title: 'Fed værdi', type: 'string' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'vinylTop',
      title: 'Vinyl-label — top',
      description: 'Fx "— Sun Records —".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'vinylTitle',
      title: 'Vinyl-label — titel',
      description: 'Fx "Musikeren".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'vinylBottom',
      title: 'Vinyl-label — bund',
      description: 'Fx "Memphis · TN".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tickerItems',
      title: 'Sound-ticker',
      description: 'Tekststykker i det rullende bånd. Adskilles automatisk af ✶ og gentages.',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({
      title: (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') || 'Vinyl-hero',
      subtitle: 'Vinyl-hero',
    }),
  },
})
