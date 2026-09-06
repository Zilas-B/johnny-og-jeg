import { defineArrayMember, defineField, defineType } from 'sanity'

// Inline rich text: em/strong only — for the era heading (h2 with an accent word)
// and the cash-note song line. Mirrors the `inlineBlock` pattern used elsewhere.
const inlineBlock = defineArrayMember({
  type: 'block',
  styles: [{ title: 'Normal', value: 'normal' }],
  lists: [],
})

// Multi-paragraph prose with em/strong, for the era body + cash-note paragraph.
const proseBlock = defineArrayMember({
  type: 'block',
  styles: [{ title: 'Normal', value: 'normal' }],
  lists: [],
})

// Flatten inline Portable Text to a plain string for Studio previews.
function plainText(blocks?: Array<{ children?: Array<{ text?: string }> }>): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .map((block) => (block.children ?? []).map((span) => span.text ?? '').join(''))
    .join(' ')
    .trim()
}

// One act of the Historien page: a stamped photo (or two-photo collage), the
// era prose, a Cash-note sidebar, and placeholder archive posts. Whether the
// section renders dark + photo-reversed is derived from its array index in the
// renderer (acts II/IV/VI), so it is not a stored field.
export const historienEra = defineType({
  name: 'historienEra',
  title: 'Era',
  type: 'object',
  fields: [
    defineField({
      name: 'romanNumeral',
      title: 'Act number (Roman numeral)',
      description: 'E.g. “I”. Used in “— Akt I —”, the stamp and the #era-1 anchor.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'period',
      title: 'Period',
      description: 'E.g. “1776 — 1830”. Shown in the stamp, the year chip, the hero list and the timeline.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'navName',
      title: 'Name — hero list',
      description: 'The full name in the “Bladre i” list, e.g. “Den unge republik”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'timelineName',
      title: 'Name — timeline',
      description: 'The condensed name in the timeline strip, e.g. “Kløften & krigen”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      description: 'H2. Use *italics* for the accent word, e.g. “Den unge *republik*.”.',
      type: 'array',
      of: [inlineBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'deck',
      title: 'Deck',
      description: 'The italicised subheading, one sentence.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body text',
      description: 'The era’s paragraphs. Use **bold** and *italics* for emphasis.',
      type: 'array',
      of: [proseBlock],
      validation: (Rule) => Rule.required(),
    }),

    // ---- Photo(s) ----
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'shape',
          title: 'Shape',
          description: 'Image format (ignored when a collage photo is set).',
          type: 'string',
          options: {
            list: [
              { title: 'Wide (16/10)', value: 'wide' },
              { title: 'Tall (3/4)', value: 'tall' },
              { title: 'Square (1/1)', value: 'sq' },
            ],
            layout: 'radio',
          },
          initialValue: 'wide',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageCollage',
      title: 'Collage photo (optional)',
      description: 'When set, the two photos render as a tilted collage (as in Act IV).',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'creditLeft',
      title: 'Credit — left',
      description: 'E.g. “Forfatningens fortale, 1787”. The star is added automatically.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'creditRight',
      title: 'Credit — right',
      description: 'E.g. “Public domain”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // ---- Cash-note ----
    defineField({
      name: 'cashnote',
      title: 'Cash note',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          description: 'E.g. “— Cash om denne tid —”.',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'song',
          title: 'Song line',
          description: 'Song titles in **bold**. E.g. “**Man in Black** · 1971”.',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'body',
          title: 'Body text',
          description: 'The italicised paragraph. Use *italics* for quotes.',
          type: 'array',
          of: [proseBlock],
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // ---- Archive posts (placeholders) ----
    defineField({
      name: 'posts',
      title: 'Archive entries',
      description: 'Placeholder entries beneath the era (typically two).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'kind', title: 'Tag', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'date', title: 'Date', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', title: 'Path', type: 'string', initialValue: '#' }),
            defineField({ name: 'empty', title: 'Empty (coming-soon state)', type: 'boolean', initialValue: true }),
          ],
          preview: { select: { title: 'title', subtitle: 'kind' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { roman: 'romanNumeral', heading: 'heading', period: 'period', media: 'image' },
    prepare: ({ roman, heading, period, media }) => ({
      title: `Act ${roman ?? '—'} · ${plainText(heading) || ''}`.trim(),
      subtitle: period ?? '',
      media,
    }),
  },
})
