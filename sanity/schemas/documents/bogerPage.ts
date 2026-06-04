import { BookIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

const inlineBlock = defineArrayMember({
  type: 'block',
  styles: [{ title: 'Normal', value: 'normal' }],
  lists: [],
})
const proseBlock = defineArrayMember({
  type: 'block',
  styles: [{ title: 'Normal', value: 'normal' }],
  lists: [],
})

// Shared "required" shorthand — see foredragPage.ts for the typing rationale.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const req = (Rule: any) => Rule.required()

// An empty-category placeholder (Spil + Film share this shape).
function emptyCategory(name: string, title: string) {
  return defineField({
    name,
    title,
    type: 'object',
    validation: req,
    fields: [
      defineField({ name: 'title', title: 'Kategori-titel', type: 'string', validation: req }),
      defineField({
        name: 'count',
        title: 'Tæller-linje',
        description: 'Fx "— **00** brikker på bordet endnu —".',
        type: 'array',
        of: [inlineBlock],
        validation: req,
      }),
      defineField({ name: 'glyph', title: 'Glyf', type: 'string', validation: req }),
      defineField({ name: 'heading', title: 'Overskrift', type: 'string', validation: req }),
      defineField({ name: 'body', title: 'Brødtekst', type: 'text', rows: 3, validation: req }),
      defineField({ name: 'pending', title: 'Status-badge', type: 'string', validation: req }),
      defineField({ name: 'previewLabel', title: 'Preview — label', type: 'string', validation: req }),
      defineField({
        name: 'preview',
        title: 'Preview — titler',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            fields: [
              defineField({ name: 'yr', title: 'År', type: 'string', validation: req }),
              defineField({
                name: 'text',
                title: 'Tekst',
                description: 'Titlen med **fed**.',
                type: 'array',
                of: [inlineBlock],
                validation: req,
              }),
            ],
            preview: { select: { subtitle: 'yr' } },
          }),
        ],
        validation: req,
      }),
    ],
  })
}

export const bogerPage = defineType({
  name: 'bogerPage',
  title: 'Bøger, spil, film',
  type: 'document',
  icon: BookIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'filters', title: 'Filter-bar' },
    { name: 'books', title: 'Bøger' },
    { name: 'empty', title: 'Spil & Film' },
    { name: 'invite', title: 'Invitation' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ---- Hero ----
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      validation: req,
      fields: [
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', validation: req }),
        defineField({ name: 'titleLead', title: 'Titel — før &', type: 'string', validation: req }),
        defineField({ name: 'titleTrail', title: 'Titel — efter &', type: 'string', validation: req }),
        defineField({
          name: 'deck',
          title: 'Deck',
          description: 'Brug *kursiv* til fremhævning.',
          type: 'array',
          of: [proseBlock],
          validation: req,
        }),
        defineField({
          name: 'litmap',
          title: 'Litterært kort',
          type: 'object',
          validation: req,
          fields: [
            defineField({
              name: 'image',
              title: 'Billede',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt-tekst', type: 'string', validation: req }),
              ],
              validation: req,
            }),
            defineField({ name: 'capTag', title: 'Billedtekst — mærkat', type: 'string', validation: req }),
            defineField({
              name: 'caption',
              title: 'Billedtekst',
              description: 'Brug *kursiv* til fremhævning.',
              type: 'array',
              of: [inlineBlock],
              validation: req,
            }),
          ],
        }),
      ],
    }),

    // ---- Filter bar ----
    defineField({
      name: 'filters',
      title: 'Filter-bar',
      type: 'object',
      group: 'filters',
      validation: req,
      fields: [
        defineField({
          name: 'lhs',
          title: 'Venstre label',
          description: 'Fx "— Kategori · **vælg en hylde** —".',
          type: 'array',
          of: [inlineBlock],
          validation: req,
        }),
        defineField({ name: 'alleCount', title: 'Tæller — Alle', type: 'string', validation: req }),
        defineField({ name: 'bogerCount', title: 'Tæller — Bøger', type: 'string', validation: req }),
        defineField({ name: 'spilCount', title: 'Tæller — Spil', type: 'string', validation: req }),
        defineField({ name: 'filmCount', title: 'Tæller — Film', type: 'string', validation: req }),
        defineField({ name: 'rhs', title: 'Højre label', type: 'string', validation: req }),
      ],
    }),

    // ---- Books ----
    defineField({
      name: 'booksTitle',
      title: 'Bøger — kategori-titel',
      type: 'string',
      group: 'books',
      validation: req,
    }),
    defineField({
      name: 'booksCount',
      title: 'Bøger — tæller-linje',
      description: 'Fx "— **03** ud af 14 lagt på siden —".',
      type: 'array',
      of: [inlineBlock],
      group: 'books',
      validation: req,
    }),
    defineField({
      name: 'books',
      title: 'Bøger',
      type: 'array',
      group: 'books',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'book',
          fields: [
            defineField({ name: 'catTag', title: 'Kategori-mærkat', type: 'string', validation: req }),
            defineField({ name: 'roman', title: 'Nummer (fx "Nº I")', type: 'string', validation: req }),
            defineField({
              name: 'coverImage',
              title: 'Forside',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt-tekst', type: 'string', validation: req })],
              validation: req,
            }),
            defineField({ name: 'buyHref', title: 'Køb-link (Saxo)', type: 'url', validation: req }),
            defineField({
              name: 'rating',
              title: 'Vurdering (stjerner)',
              type: 'number',
              options: { list: [1, 2, 3, 4, 5] },
              validation: (Rule) => Rule.required().min(1).max(5),
            }),
            defineField({ name: 'readWhen', title: 'Læst', type: 'string', validation: req }),
            defineField({ name: 'pages', title: 'Sider', type: 'string', validation: req }),
            defineField({ name: 'language', title: 'Originalsprog', type: 'string', validation: req }),
            defineField({ name: 'title', title: 'Titel', type: 'string', validation: req }),
            defineField({ name: 'author', title: 'Forfatter', type: 'string', validation: req }),
            defineField({ name: 'year', title: 'Årstal', type: 'string', validation: req }),
            defineField({
              name: 'metaRow',
              title: 'Meta-række',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string', validation: req }),
                    defineField({ name: 'value', title: 'Værdi', type: 'string', validation: req }),
                  ],
                  preview: { select: { title: 'value', subtitle: 'label' } },
                }),
              ],
              validation: req,
            }),
            defineField({ name: 'lead', title: 'Lead', type: 'text', rows: 3, validation: req }),
            defineField({
              name: 'body',
              title: 'Brødtekst',
              description: 'Brug **fed** og *kursiv* til fremhævning.',
              type: 'array',
              of: [proseBlock],
              validation: req,
            }),
            defineField({ name: 'verdictLine', title: 'Dom — linje', type: 'text', rows: 2, validation: req }),
            defineField({ name: 'recoLabel', title: 'Anbefaling — etiket', type: 'string', validation: req }),
            defineField({ name: 'recoText', title: 'Anbefaling — tekst', type: 'string', validation: req }),
            defineField({
              name: 'tags',
              title: 'Tags',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              validation: req,
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'author', media: 'coverImage' } },
        }),
      ],
    }),

    // ---- Spil + Film ----
    emptyCategory('spil', 'Spil'),
    emptyCategory('film', 'Film'),

    // ---- Invitation ----
    defineField({
      name: 'invite',
      title: 'Invitation',
      type: 'object',
      group: 'invite',
      validation: req,
      fields: [
        defineField({ name: 'kicker', title: 'Kicker', type: 'string', validation: req }),
        defineField({
          name: 'heading',
          title: 'Overskrift',
          description: 'Brug *kursiv* for accent-ordet.',
          type: 'array',
          of: [inlineBlock],
          validation: req,
        }),
        defineField({
          name: 'body',
          title: 'Brødtekst',
          type: 'array',
          of: [proseBlock],
          validation: req,
        }),
        defineField({
          name: 'actions',
          title: 'Knapper',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'text', title: 'Tekst', type: 'string', validation: req }),
                defineField({ name: 'href', title: 'Sti', type: 'string', validation: req }),
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
                  validation: req,
                }),
              ],
              preview: { select: { title: 'text', subtitle: 'style' } },
            }),
          ],
          validation: req,
        }),
        defineField({
          name: 'addCard',
          title: 'Tilføj-kort',
          type: 'object',
          validation: req,
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: req }),
            defineField({ name: 'heading', title: 'Overskrift', type: 'text', rows: 2, validation: req }),
            defineField({ name: 'body', title: 'Brødtekst', type: 'text', rows: 3, validation: req }),
            defineField({ name: 'placeholder', title: 'Felt — placeholder', type: 'string', validation: req }),
            defineField({ name: 'small', title: 'Note', type: 'string', validation: req }),
          ],
        }),
      ],
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Bøger, spil, film' }) },
})
