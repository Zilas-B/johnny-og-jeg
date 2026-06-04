import { BookIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// Inline rich text: em/strong only — for headings and one-line accent fields.
const inlineBlock = defineArrayMember({
  type: 'block',
  styles: [{ title: 'Normal', value: 'normal' }],
  lists: [],
})

// Multi-paragraph prose with em/strong — for the hero deck + outro body.
const proseBlock = defineArrayMember({
  type: 'block',
  styles: [{ title: 'Normal', value: 'normal' }],
  lists: [],
})

// Reused action-button shape (mirrors kulturenPage / landscape `emptyActions`).
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

// The Historien page — a single bespoke document (not block-composed): hero +
// derived timeline strip + six alternating era sections + outro. Routed at
// /historien via the [slug] dispatcher (SLUG_TYPE_QUERY matches the fixed path).
export const historienPage = defineType({
  name: 'historienPage',
  title: 'Historien',
  type: 'document',
  icon: BookIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'eras', title: 'Epoker' },
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
          description: 'Fx "USA · Historien · Anno 1776 — nutid".',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'title',
          title: 'Titel',
          description: 'Fx "Historien".',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'titleSub',
          title: 'Titel — underlinje',
          description: 'Poster-linjen under titlen, fx "en republik i seks akter".',
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
        defineField({
          name: 'sideLabel',
          title: 'Side-boks — label',
          description: 'Fx "— Bladre i —".',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'sideHeading',
          title: 'Side-boks — overskrift',
          description: 'Fx "Seks epoker.". Selve listen genereres fra epokerne.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // ---- Eras ----
    defineField({
      name: 'eras',
      title: 'Epoker',
      description: 'Akterne i rækkefølge. Akt II, IV og VI vises mørke med spejlvendt foto.',
      type: 'array',
      of: [defineArrayMember({ type: 'historienEra' })],
      group: 'eras',
      validation: (Rule) => Rule.required().min(1),
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
          name: 'cardHeading',
          title: 'Kort — overskrift',
          description: 'Fx "Hvor Cash møder historien.".',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'cardItems',
          title: 'Kort — liste',
          description: 'Sang + årstal. Sangtitlen med **fed**.',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'text',
                  title: 'Tekst',
                  description: 'Fx "**Man in Black** — sort for de glemte".',
                  type: 'array',
                  of: [inlineBlock],
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'year',
                  title: 'Årstal',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
              ],
              preview: {
                select: { text: 'text', subtitle: 'year' },
                prepare: ({ text, subtitle }) => ({
                  title:
                    (Array.isArray(text)
                      ? text
                          .map((b: { children?: Array<{ text?: string }> }) =>
                            (b.children ?? []).map((s) => s.text ?? '').join(''),
                          )
                          .join('')
                      : '') || 'Linje',
                  subtitle,
                }),
              },
            }),
          ],
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
    prepare: () => ({ title: 'Historien' }),
  },
})
