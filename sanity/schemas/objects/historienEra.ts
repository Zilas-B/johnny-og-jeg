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
  title: 'Epoke',
  type: 'object',
  fields: [
    defineField({
      name: 'romanNumeral',
      title: 'Aktnummer (romertal)',
      description: 'Fx "I". Bruges i "— Akt I —", stemplet og ankeret #era-1.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'period',
      title: 'Periode',
      description: 'Fx "1776 — 1830". Vises i stempel, års-chip, hero-liste og tidslinje.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'navName',
      title: 'Navn — hero-liste',
      description: 'Det fulde navn i "Bladre i"-listen, fx "Den unge republik".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'timelineName',
      title: 'Navn — tidslinje',
      description: 'Det komprimerede navn i tidslinjestriben, fx "Kløften & krigen".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Overskrift',
      description: 'H2 med *kursiv* for accent-ordet, fx "Den unge *republik*.".',
      type: 'array',
      of: [inlineBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'deck',
      title: 'Deck',
      description: 'Den kursiverede underrubrik, én sætning.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Brødtekst',
      description: 'Epokens afsnit. Brug **fed** og *kursiv* til fremhævning.',
      type: 'array',
      of: [proseBlock],
      validation: (Rule) => Rule.required(),
    }),

    // ---- Photo(s) ----
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'shape',
          title: 'Form',
          description: 'Billedformat (ignoreres når der er et collage-foto).',
          type: 'string',
          options: {
            list: [
              { title: 'Bred (16/10)', value: 'wide' },
              { title: 'Høj (3/4)', value: 'tall' },
              { title: 'Kvadratisk (1/1)', value: 'sq' },
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
      title: 'Collage-foto (valgfrit)',
      description: 'Når sat vises de to fotos som en skæv collage (som Akt IV).',
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
    }),
    defineField({
      name: 'creditLeft',
      title: 'Kredit — venstre',
      description: 'Fx "Forfatningens fortale, 1787". Stjernen tilføjes automatisk.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'creditRight',
      title: 'Kredit — højre',
      description: 'Fx "Public domain".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // ---- Cash-note ----
    defineField({
      name: 'cashnote',
      title: 'Cash-note',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          description: 'Fx "— Cash om denne tid —".',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'heading',
          title: 'Overskrift',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'song',
          title: 'Sang-linje',
          description: 'Sangtitler med **fed**. Fx "**Man in Black** · 1971".',
          type: 'array',
          of: [inlineBlock],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'body',
          title: 'Brødtekst',
          description: 'Det kursiverede afsnit. Brug *kursiv* til citater.',
          type: 'array',
          of: [proseBlock],
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // ---- Archive posts (placeholders) ----
    defineField({
      name: 'posts',
      title: 'Arkiv-indlæg',
      description: 'Pladsholder-indlæg under epoken (typisk to).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'kind', title: 'Mærkat', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'title', title: 'Titel', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'date', title: 'Dato', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'href', title: 'Sti', type: 'string', initialValue: '#' }),
            defineField({ name: 'empty', title: 'Tom (kommer-tilstand)', type: 'boolean', initialValue: true }),
          ],
          preview: { select: { title: 'title', subtitle: 'kind' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { roman: 'romanNumeral', heading: 'heading', period: 'period', media: 'image' },
    prepare: ({ roman, heading, period, media }) => ({
      title: `Akt ${roman ?? '—'} · ${plainText(heading) || ''}`.trim(),
      subtitle: period ?? '',
      media,
    }),
  },
})
