import { defineArrayMember, defineField, defineType } from 'sanity'

// Inline rich text: em/strong only — no block styles, no lists.
const inlineBlock = defineArrayMember({
  type: 'block',
  styles: [{ title: 'Normal', value: 'normal' }],
  lists: [],
})

function plainText(blocks?: Array<{ children?: Array<{ text?: string }> }>): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .map((block) => (block.children ?? []).map((span) => span.text ?? '').join(''))
    .join(' ')
    .trim()
}

// One row in a `.lside` "Knudepunkter" timeline: year + a short inline note.
export const kulturenTimelineEntry = defineType({
  name: 'kulturenTimelineEntry',
  title: 'Timeline entry',
  type: 'object',
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      description: 'E.g. “1872”, “1730s”, “2020+”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      description: 'Use *italics* and **bold** for emphasis.',
      type: 'array',
      of: [inlineBlock],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { year: 'year', text: 'text' },
    prepare: ({ year, text }) => ({
      title: year ?? '—',
      subtitle: plainText(text),
    }),
  },
})
