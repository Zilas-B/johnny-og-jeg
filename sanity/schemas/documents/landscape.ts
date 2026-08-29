import { EarthGlobeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// Inline rich text: paragraphs with em/strong only — no block styles, no lists.
// Mirrors the `inlineBlock` used in homePage.ts.
const inlineBlock = defineArrayMember({
  type: 'block',
  styles: [{ title: 'Normal', value: 'normal' }],
  lists: [],
})

// Rich essay block for the Kulturen `.land` section: normal paragraphs plus a
// subsection heading (h4) and a pull-quote callout style. Marks em/strong only.
const kulturenEssayBlock = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'Subheading', value: 'h4' },
    { title: 'Pull quote', value: 'pull' },
  ],
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
  { title: 'Barn (red)', value: 'barn' },
  { title: 'Denim (blue)', value: 'denim' },
  { title: 'Brass (yellow)', value: 'brass' },
]

export const landscape = defineType({
  name: 'landscape',
  title: 'Landscape',
  type: 'document',
  icon: EarthGlobeIcon,
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'hero', title: 'Hero' },
    { name: 'empty', title: 'Archive (empty state)' },
    { name: 'kulturen', title: 'Kulturen section' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ---- Identitet (required) ----
    defineField({
      name: 'name',
      title: 'Name',
      description: 'The title, with *italics* around the red word, e.g. “*Naturen*.” or “Den *forgyldte* republik.”.',
      type: 'array',
      of: [inlineBlock],
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortName',
      title: 'Short name',
      description: 'Shown in the sibling grid, e.g. “Den forgyldte”, “Syd & Nord”, “Drømmefabrik”.',
      type: 'string',
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      description: 'ASCII, e.g. “naturen”, “den-forgyldte-republik”.',
      type: 'slug',
      options: { source: (doc) => plainText(doc.name as never), maxLength: 96 },
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      description: 'A number from 1 to 8. Controls the sort order in the sibling grid.',
      type: 'number',
      group: 'identity',
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: 'romanNumeral',
      title: 'Roman numeral',
      description: 'E.g. “I”, “VIII”.',
      type: 'string',
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'toponym',
      title: 'Toponym',
      description: 'The short theme word, e.g. “Kontinentet”. Used in the breadcrumb.',
      type: 'string',
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'period',
      title: 'Period',
      description: 'E.g. “1607 — nu”.',
      type: 'string',
      group: 'identity',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent colour',
      description: 'Currently follows the design (barn red) on every landscape.',
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
      description: 'E.g. “Arkiv · Naturen”.',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'motto',
      title: 'Motto',
      description: 'E.g. “Kontinentet og vildmarken.”.',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'deck',
      title: 'Deck',
      description: 'Opening paragraph. Use *italics* and **bold** for emphasis.',
      type: 'array',
      of: [inlineBlock],
      group: 'hero',
    }),
    defineField({
      name: 'topicsLabel',
      title: 'Topics — label',
      description: 'E.g. “Emner:”.',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'topics',
      title: 'Topics',
      description: 'Displayed separated by “ · ”.',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'hero',
    }),
    defineField({
      name: 'crumbBackText',
      title: 'Breadcrumb — back text',
      description: 'E.g. “← Kulturen”.',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'crumbBackHref',
      title: 'Breadcrumb — back path',
      description: 'E.g. “/kulturen”.',
      type: 'string',
      group: 'hero',
    }),

    // ---- Arkiv / tom tilstand (optional) ----
    defineField({
      name: 'emptyMeta',
      title: 'Meta line',
      description: 'Shown at the right of the heading when there are no entries, e.g. “0 indlæg · arkivet åbnes”.',
      type: 'string',
      group: 'empty',
    }),
    defineField({
      name: 'emptyLabel',
      title: 'Empty — label',
      description: 'E.g. “— ingen indlæg endnu —”.',
      type: 'string',
      group: 'empty',
    }),
    defineField({
      name: 'emptyHeading',
      title: 'Empty — heading',
      description: 'E.g. “Arkivet *åbner* her.”.',
      type: 'array',
      of: [inlineBlock],
      group: 'empty',
    }),
    defineField({
      name: 'emptyBody',
      title: 'Empty — body text',
      type: 'array',
      of: [inlineBlock],
      group: 'empty',
    }),
    defineField({
      name: 'emptyActions',
      title: 'Empty — buttons',
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
          preview: {
            select: { title: 'text', subtitle: 'style' },
          },
        }),
      ],
      group: 'empty',
    }),

    // ---- Kulturen (.land) section (optional; rendered on the Kulturen page) ----
    defineField({
      name: 'kulturenBgVariant',
      title: 'Background',
      description: 'The section’s background on the Kulturen page. “Dark” switches the accent to brass.',
      type: 'string',
      options: {
        list: [
          { title: 'Paper', value: 'paper' },
          { title: 'Paper (darker)', value: 'paper-2' },
          { title: 'Dark (brass accent)', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'paper',
      group: 'kulturen',
    }),
    defineField({
      name: 'kulturenEssay',
      title: 'Essay',
      description:
        'This landscape’s essay on the Kulturen page. The first paragraph gets a drop cap. Styles: Normal, Subheading (h4), Pull quote.',
      type: 'array',
      of: [kulturenEssayBlock],
      group: 'kulturen',
    }),
    defineField({
      name: 'kulturenSidebar',
      title: 'Side boxes',
      description: 'Boxes in the right-hand column, in display order. The “to the archive” button is added automatically.',
      type: 'array',
      of: [
        defineArrayMember({ type: 'kulturenSideNote' }),
        defineArrayMember({ type: 'kulturenTimeline' }),
      ],
      group: 'kulturen',
    }),
    defineField({
      name: 'kulturenArchiveCta',
      title: 'Archive button (text)',
      description: 'The text on the “to the archive” button, e.g. “Til Naturen-arkivet →”. Leave empty to generate it.',
      type: 'string',
      group: 'kulturen',
    }),
    defineField({
      name: 'kulturenCardTag',
      title: 'Outro card — short description',
      description: 'Shown in the outro list after the name, e.g. “kontinent & vildmark”.',
      type: 'string',
      group: 'kulturen',
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
      title: plainText(name) || 'Landscape',
      subtitle: `Landscape ${romanNumeral ?? '—'} · ${toponym ?? ''}`,
    }),
  },
})
