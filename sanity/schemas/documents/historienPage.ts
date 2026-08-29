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
    { name: 'eras', title: 'Eras' },
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
          description: 'E.g. “USA · Historien · Anno 1776 — nutid”.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          description: 'E.g. “Historien”.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'titleSub',
          title: 'Title — sub-line',
          description: 'The poster line under the title, e.g. “en republik i seks akter”.',
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
        defineField({
          name: 'sideLabel',
          title: 'Side box — label',
          description: 'E.g. “— Bladre i —”.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'sideHeading',
          title: 'Side box — heading',
          description: 'E.g. “Seks epoker.”. The list itself is generated from the eras.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // ---- Eras ----
    defineField({
      name: 'eras',
      title: 'Eras',
      description: 'The acts in order. Acts II, IV and VI are shown dark with a mirrored photo.',
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
          name: 'cardHeading',
          title: 'Card — heading',
          description: 'E.g. “Hvor Cash møder historien.”.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'cardItems',
          title: 'Card — list',
          description: 'Song + year. The song title in **bold**.',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'text',
                  title: 'Text',
                  description: 'E.g. “**Man in Black** — sort for de glemte”.',
                  type: 'array',
                  of: [inlineBlock],
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'year',
                  title: 'Year',
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
                      : '') || 'Line',
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
