import { EarthAmericasIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// Inline rich text: em/strong only — no block styles, no lists. For headings
// and one-line fields where the em word renders in the accent colour.
const inlineBlock = defineArrayMember({
  type: 'block',
  styles: [{ title: 'Normal', value: 'normal' }],
  lists: [],
})

// Multi-paragraph prose with em/strong. Used for the intro/outro/hero bodies.
const proseBlock = defineArrayMember({
  type: 'block',
  styles: [{ title: 'Normal', value: 'normal' }],
  lists: [],
})

// Reused action-button shape (mirrors landscape `emptyActions`).
const actionField = defineField({
  name: 'actions',
  title: 'Buttons',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'object',
      fields: [
        defineField({ name: 'text', title: 'Text', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'href', title: 'Path', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({
          name: 'style',
          title: 'Style',
          type: 'string',
          options: {
            list: [
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' },
            ],
            layout: 'radio',
          },
          validation: (Rule) => Rule.required(),
        }),
      ],
      preview: { select: { title: 'text', subtitle: 'style' } },
    }),
  ],
})

export const kulturenPage = defineType({
  name: 'kulturenPage',
  title: 'Kulturen',
  type: 'document',
  icon: EarthAmericasIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'chips', title: 'Chip grid' },
    { name: 'intro', title: 'Intro essay' },
    { name: 'outro', title: 'Outro' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ---- Hero ----
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow',
          description: 'E.g. “USA · Kulturen · Et essay i otte landskaber”.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          description: 'Use *italics* for the red word, e.g. “Republikken og dens *billeder*.”.',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'subhead',
          title: 'Subhead',
          description: 'E.g. “Forskellige amerikanske kulturer, før og nu.”.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'deck',
          title: 'Deck',
          description: 'Opening paragraphs (usually two). Use *italics* for emphasis.',
          type: 'array',
          of: [proseBlock],
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // ---- Chip grid header ----
    defineField({
      name: 'chips',
      title: 'Chip grid',
      type: 'object',
      group: 'chips',
      description: 'The heading above the eight landscape chips. The chips themselves come from the landscapes.',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          description: 'E.g. “— Landskaberne · **klik for at hoppe ned** —”.',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'count',
          title: 'Counter',
          description: 'E.g. “otte felter, *én republik*”.',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // ---- Intro essay ----
    defineField({
      name: 'intro',
      title: 'Intro essay',
      type: 'object',
      group: 'intro',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'kicker',
          title: 'Kicker',
          description: 'E.g. “— Hvorfor otte landskaber? —”.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'heading',
          title: 'Heading',
          description: 'Use *italics* for the emphasised word.',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'signature',
          title: 'Signature',
          description: 'E.g. “— en lytters notesbog —”.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'body',
          title: 'Body text',
          type: 'array',
          of: [proseBlock],
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // ---- Outro ----
    defineField({
      name: 'outro',
      title: 'Outro',
      type: 'object',
      group: 'outro',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'kicker',
          title: 'Kicker',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'heading',
          title: 'Heading',
          description: 'Use *italics* for the emphasised word.',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'body',
          title: 'Body text',
          type: 'array',
          of: [proseBlock],
          validation: (Rule) => Rule.required(),
        }),
        actionField,
        defineField({
          name: 'cardLead',
          title: 'Card — label',
          description: 'E.g. “— De otte arkiver —”.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'cardHeading',
          title: 'Card — heading',
          description: 'E.g. “Spring direkte ind.”. The list itself is generated from the landscapes.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Kulturen' }),
  },
})
