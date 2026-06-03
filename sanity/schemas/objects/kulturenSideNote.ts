import { defineArrayMember, defineField, defineType } from 'sanity'

// Inline rich text: em/strong only — no block styles, no lists. Multiple blocks
// render as separate paragraphs inside the box (used by the "Beboere" box on
// Syd vs. Nord, which has two paragraphs).
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

// A `.lside` sidebar box with a label and prose value (Beboere, Krigen krydser
// her, Set herfra, Cash krydser her). The `emphasis: cash` variant renders the
// barn/brass-bordered ".lside.cash" Johnny-Cash-crossing box.
export const kulturenSideNote = defineType({
  name: 'kulturenSideNote',
  title: 'Side-boks',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      description: 'Boksens overskrift, fx "— Beboere —", "— Set herfra —".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Tekst',
      description: 'Brug *kursiv* og **fed** til fremhævning. Flere afsnit gengives adskilt.',
      type: 'array',
      of: [inlineBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'emphasis',
      title: 'Fremhævning',
      description: '"Cash" giver den barn/brass-indrammede "Cash krydser her"-boks.',
      type: 'string',
      options: {
        list: [
          { title: 'Standard', value: 'default' },
          { title: 'Cash krydser her', value: 'cash' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { label: 'label', value: 'value', emphasis: 'emphasis' },
    prepare: ({ label, value, emphasis }) => ({
      title: label ?? 'Side-boks',
      subtitle: emphasis === 'cash' ? `Cash · ${plainText(value)}` : plainText(value),
    }),
  },
})
