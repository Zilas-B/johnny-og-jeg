import { ImageIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { proseBlock } from './_shared'

// `.flag-hero` band from Cash og Amerika.html: a left text column and a right
// "telegram" card. The flag-photo background was removed in #6. The H1 carries
// two distinct non-accent colours — `og` barn-red, `Amerika.` brass — which
// the shared inlineBlock/InlineText (single `em` accent) cannot express, so the
// heading is modelled as three bespoke string parts and the component renders
// the .amp/.gold spans (documented deviation from the inlineBlock-heading
// convention).
export const flagHero = defineType({
  name: 'flagHero',
  title: 'Hero Block (flag)',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'E.g. “Side C · The Ragged Old Flag”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'romanNumeral',
      title: 'Roman numeral',
      description: 'E.g. “III.”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingLead',
      title: 'Heading — first word',
      description: 'First word, in the regular colour. E.g. “Cash”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingAmp',
      title: 'Heading — middle word (red)',
      description: 'Middle word in barn red. E.g. “og”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingGold',
      title: 'Heading — last word (brass)',
      description: 'Last word in brass. E.g. “Amerika.”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lede',
      title: 'Lede',
      description: 'Opening paragraph with a drop cap on the first letter.',
      type: 'array',
      of: [proseBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metaItems',
      title: 'Meta lines',
      description: 'Reading time, number of Songs and the like. The value is shown in bold.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'metaItem',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'value', title: 'Value (bold, optional)', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'telegram',
      title: 'Telegram card',
      type: 'object',
      fields: [
        defineField({ name: 'headLeft', title: 'Header — left', description: 'E.g. “Western Union”.', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'headTitle', title: 'Header — title', description: 'E.g. “RAGGED OLD FLAG”.', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'headYear', title: 'Header — year', description: 'E.g. “1974”.', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({
          name: 'lines',
          title: 'Telegram lines',
          description: 'Each line automatically gets “·STOP·” appended when displayed.',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({ name: 'sig', title: 'Signature', description: 'E.g. “— J. R. Cash”.', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'postmarkTop', title: 'Postmark — top', description: 'E.g. “US”.', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'postmarkMid', title: 'Postmark — middle (italic)', description: 'E.g. “Mail”.', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'postmarkBottom', title: 'Postmark — bottom', description: 'E.g. “1974”.', type: 'string', validation: (Rule) => Rule.required() }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { lead: 'headingLead', amp: 'headingAmp', gold: 'headingGold' },
    prepare: ({ lead, amp, gold }) => ({
      title: [lead, amp, gold].filter(Boolean).join(' ') || 'Hero Block (flag)',
      subtitle: 'Hero Block (flag)',
    }),
  },
})
