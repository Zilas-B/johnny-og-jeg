import { EarthGlobeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// Inline rich text: paragraphs with em/strong only — no block styles, no lists.
// Mirrors the `inlineBlock` used in homePage.ts.
const inlineBlock = defineArrayMember({
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

// The named accent presets (TechStack Decision log 2026-05-26). Each maps to a
// CSS variable in tokens.css. Naturen and friends currently ship `barn`.
const ACCENT_PRESETS = [
  { title: 'Barn (rød)', value: 'barn' },
  { title: 'Denim (blå)', value: 'denim' },
  { title: 'Brass (gul)', value: 'brass' },
]

export const landscape = defineType({
  name: 'landscape',
  title: 'Landskab',
  type: 'document',
  icon: EarthGlobeIcon,
  groups: [
    { name: 'identity', title: 'Identitet', default: true },
    { name: 'hero', title: 'Hero' },
    { name: 'empty', title: 'Arkiv (tom tilstand)' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ---- Identitet (required) ----
    defineField({
      name: 'name',
      title: 'Navn',
      description: 'Titlen med *kursiv* for det røde ord, fx "*Naturen*." eller "Den *forgyldte* republik.".',
      type: 'array',
      of: [inlineBlock],
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortName',
      title: 'Kort navn',
      description: 'Vist i søskende-gitteret, fx "Den forgyldte", "Syd & Nord", "Drømmefabrik".',
      type: 'string',
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-slug',
      description: 'ASCII, fx "naturen", "den-forgyldte-republik".',
      type: 'slug',
      options: { source: (doc) => plainText(doc.name as never), maxLength: 96 },
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Rækkefølge',
      description: 'Tal 1–8. Styrer sortering i søskende-gitteret.',
      type: 'number',
      group: 'identity',
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: 'romanNumeral',
      title: 'Romertal',
      description: 'Fx "I", "VIII".',
      type: 'string',
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'toponym',
      title: 'Toponym',
      description: 'Det korte tema-ord, fx "Kontinentet". Bruges i brødkrummen.',
      type: 'string',
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'period',
      title: 'Periode',
      description: 'Fx "1607 — nu".',
      type: 'string',
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'accentColor',
      title: 'Accentfarve',
      description: 'Følger pt. designet (barn-rød) på alle landskaber.',
      type: 'string',
      options: { list: ACCENT_PRESETS, layout: 'radio' },
      initialValue: 'barn',
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),

    // ---- Hero (optional; page guards on `deck`) ----
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      description: 'Fx "Arkiv · Naturen".',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'motto',
      title: 'Motto',
      description: 'Fx "Kontinentet og vildmarken.".',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'deck',
      title: 'Deck',
      description: 'Indledende afsnit. Brug *kursiv* og **fed** til fremhævning.',
      type: 'array',
      of: [inlineBlock],
      group: 'hero',
    }),
    defineField({
      name: 'topicsLabel',
      title: 'Emner — label',
      description: 'Fx "Emner:".',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'topics',
      title: 'Emner',
      description: 'Vises adskilt af " · ".',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'hero',
    }),
    defineField({
      name: 'crumbBackText',
      title: 'Brødkrumme — tilbage-tekst',
      description: 'Fx "← Kulturen".',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'crumbBackHref',
      title: 'Brødkrumme — tilbage-sti',
      description: 'Fx "/kulturen".',
      type: 'string',
      group: 'hero',
    }),

    // ---- Arkiv / tom tilstand (optional) ----
    defineField({
      name: 'emptyMeta',
      title: 'Meta-linje',
      description: 'Vises i overskriftens højre side når der ingen indlæg er, fx "0 indlæg · arkivet åbnes".',
      type: 'string',
      group: 'empty',
    }),
    defineField({
      name: 'emptyLabel',
      title: 'Tom — label',
      description: 'Fx "— ingen indlæg endnu —".',
      type: 'string',
      group: 'empty',
    }),
    defineField({
      name: 'emptyHeading',
      title: 'Tom — overskrift',
      description: 'Fx "Arkivet *åbner* her.".',
      type: 'array',
      of: [inlineBlock],
      group: 'empty',
    }),
    defineField({
      name: 'emptyBody',
      title: 'Tom — brødtekst',
      type: 'array',
      of: [inlineBlock],
      group: 'empty',
    }),
    defineField({
      name: 'emptyActions',
      title: 'Tom — knapper',
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
          preview: {
            select: { title: 'text', subtitle: 'style' },
          },
        }),
      ],
      group: 'empty',
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: { name: 'name', romanNumeral: 'romanNumeral', toponym: 'toponym' },
    prepare: ({ name, romanNumeral, toponym }) => ({
      title: plainText(name) || 'Landskab',
      subtitle: `Landskab ${romanNumeral ?? '—'} · ${toponym ?? ''}`,
    }),
  },
})
