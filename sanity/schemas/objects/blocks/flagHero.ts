import { ImageIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { proseBlock } from './_shared'

// `.flag-hero` band from Cash og Amerika.html: a flag-photo background (the
// project's first raster image, best-practices §7), a left text column, and a
// right "telegram" card. The H1 carries two distinct non-accent colours — `og`
// barn-red, `Amerika.` brass — which the shared inlineBlock/InlineText (single
// `em` accent) cannot express, so the heading is modelled as three bespoke
// string parts and the component renders the .amp/.gold spans (documented
// deviation from the inlineBlock-heading convention).
export const flagHero = defineType({
  name: 'flagHero',
  title: 'Flag-hero',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'Fx "Side C · The Ragged Old Flag".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'romanNumeral',
      title: 'Romertal',
      description: 'Fx "III.".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingLead',
      title: 'Overskrift — start',
      description: 'Første ord, almindelig farve. Fx "Cash".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingAmp',
      title: 'Overskrift — bindeord (rød)',
      description: 'Midterord i barn-rød. Fx "og".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingGold',
      title: 'Overskrift — slutord (brass)',
      description: 'Sidste ord i brass. Fx "Amerika.".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lede',
      title: 'Lede',
      description: 'Indledende afsnit med drop-cap på første bogstav.',
      type: 'array',
      of: [proseBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metaItems',
      title: 'Meta-linjer',
      description: 'Læsetid, antal spor m.m. Værdien vises i fed.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'metaItem',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'value', title: 'Værdi (fed, valgfri)', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Baggrundsbillede (flag)',
      description: 'Falmet flag-foto bag hero-teksten. Går gennem Sanity-billedpipelinen (§7).',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'telegram',
      title: 'Telegram-kort',
      type: 'object',
      fields: [
        defineField({ name: 'headLeft', title: 'Hoved — venstre', description: 'Fx "Western Union".', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'headTitle', title: 'Hoved — titel', description: 'Fx "RAGGED OLD FLAG".', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'headYear', title: 'Hoved — år', description: 'Fx "1974".', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({
          name: 'lines',
          title: 'Telegram-linjer',
          description: 'Hver linje får automatisk "·STOP·" tilføjet i visningen.',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({ name: 'sig', title: 'Signatur', description: 'Fx "— J. R. Cash".', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'postmarkTop', title: 'Poststempel — top', description: 'Fx "US".', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'postmarkMid', title: 'Poststempel — midt (kursiv)', description: 'Fx "Mail".', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'postmarkBottom', title: 'Poststempel — bund', description: 'Fx "1974".', type: 'string', validation: (Rule) => Rule.required() }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { lead: 'headingLead', amp: 'headingAmp', gold: 'headingGold' },
    prepare: ({ lead, amp, gold }) => ({
      title: [lead, amp, gold].filter(Boolean).join(' ') || 'Flag-hero',
      subtitle: 'Flag-hero',
    }),
  },
})
