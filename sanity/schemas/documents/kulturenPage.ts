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
  title: 'Knapper',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'object',
      fields: [
        defineField({ name: 'text', title: 'Tekst', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'href', title: 'Sti', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({
          name: 'style',
          title: 'Stil',
          type: 'string',
          options: {
            list: [
              { title: 'Primær', value: 'primary' },
              { title: 'Sekundær', value: 'secondary' },
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
    { name: 'chips', title: 'Felt-gitter' },
    { name: 'intro', title: 'Intro-essay' },
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
          description: 'Fx "USA · Kulturen · Et essay i otte landskaber".',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'title',
          title: 'Titel',
          description: 'Brug *kursiv* for det røde ord, fx "Republikken og dens *billeder*.".',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'subhead',
          title: 'Underrubrik',
          description: 'Fx "Forskellige amerikanske kulturer, før og nu.".',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'deck',
          title: 'Deck',
          description: 'Indledende afsnit (typisk to). Brug *kursiv* til fremhævning.',
          type: 'array',
          of: [proseBlock],
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // ---- Chip grid header ----
    defineField({
      name: 'chips',
      title: 'Felt-gitter',
      type: 'object',
      group: 'chips',
      description: 'Overskriften over de otte landskabs-felter. Selve felterne hentes fra landskaberne.',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          description: 'Fx "— Landskaberne · **klik for at hoppe ned** —".',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'count',
          title: 'Tæller',
          description: 'Fx "otte felter, *én republik*".',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // ---- Intro essay ----
    defineField({
      name: 'intro',
      title: 'Intro-essay',
      type: 'object',
      group: 'intro',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'kicker',
          title: 'Kicker',
          description: 'Fx "— Hvorfor otte landskaber? —".',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'heading',
          title: 'Overskrift',
          description: 'Brug *kursiv* for det fremhævede ord.',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'signature',
          title: 'Signatur',
          description: 'Fx "— en lytters notesbog —".',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'body',
          title: 'Brødtekst',
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
          title: 'Overskrift',
          description: 'Brug *kursiv* for det fremhævede ord.',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'body',
          title: 'Brødtekst',
          type: 'array',
          of: [proseBlock],
          validation: (Rule) => Rule.required(),
        }),
        actionField,
        defineField({
          name: 'cardLead',
          title: 'Kort — label',
          description: 'Fx "— De otte arkiver —".',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'cardHeading',
          title: 'Kort — overskrift',
          description: 'Fx "Spring direkte ind.". Selve listen genereres fra landskaberne.',
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
