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
      defineField({ name: 'title', title: 'Category title', type: 'string', validation: req }),
      defineField({
        name: 'count',
        title: 'Counter line',
        description: 'E.g. “— **00** brikker på bordet endnu —”.',
        type: 'array',
        of: [inlineBlock],
        validation: req,
      }),
      defineField({ name: 'glyph', title: 'Glyph', type: 'string', validation: req }),
      defineField({ name: 'heading', title: 'Heading', type: 'string', validation: req }),
      defineField({ name: 'body', title: 'Body text', type: 'text', rows: 3, validation: req }),
      defineField({ name: 'pending', title: 'Status badge', type: 'string', validation: req }),
      defineField({ name: 'previewLabel', title: 'Preview — label', type: 'string', validation: req }),
      defineField({
        name: 'preview',
        title: 'Preview — titles',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            fields: [
              defineField({ name: 'yr', title: 'Year', type: 'string', validation: req }),
              defineField({
                name: 'text',
                title: 'Text',
                description: 'The title in **bold**.',
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
    { name: 'filters', title: 'Filter bar' },
    { name: 'books', title: 'Books' },
    { name: 'empty', title: 'Games & Film' },
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
        defineField({ name: 'titleLead', title: 'Title — before &', type: 'string', validation: req }),
        defineField({ name: 'titleTrail', title: 'Title — after &', type: 'string', validation: req }),
        defineField({
          name: 'deck',
          title: 'Deck',
          description: 'Use *italics* for emphasis.',
          type: 'array',
          of: [proseBlock],
          validation: req,
        }),
        defineField({
          name: 'litmap',
          title: 'Literary map',
          type: 'object',
          validation: req,
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: req }),
              ],
              validation: req,
            }),
            defineField({ name: 'capTag', title: 'Caption — tag', type: 'string', validation: req }),
            defineField({
              name: 'caption',
              title: 'Caption',
              description: 'Use *italics* for emphasis.',
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
      title: 'Filter bar',
      type: 'object',
      group: 'filters',
      validation: req,
      fields: [
        defineField({
          name: 'lhs',
          title: 'Left label',
          description: 'E.g. “— Kategori · **vælg en hylde** —”.',
          type: 'array',
          of: [inlineBlock],
          validation: req,
        }),
        defineField({ name: 'alleCount', title: 'Counter — All', type: 'string', validation: req }),
        defineField({ name: 'bogerCount', title: 'Counter — Books', type: 'string', validation: req }),
        defineField({ name: 'spilCount', title: 'Counter — Games', type: 'string', validation: req }),
        defineField({ name: 'filmCount', title: 'Counter — Film', type: 'string', validation: req }),
        defineField({ name: 'rhs', title: 'Right label', type: 'string', validation: req }),
      ],
    }),

    // ---- Books ----
    defineField({
      name: 'booksTitle',
      title: 'Books — category title',
      type: 'string',
      group: 'books',
      validation: req,
    }),
    defineField({
      name: 'booksCount',
      title: 'Books — counter line',
      description: 'E.g. “— **03** ud af 14 lagt på siden —”.',
      type: 'array',
      of: [inlineBlock],
      group: 'books',
      validation: req,
    }),
    defineField({
      name: 'books',
      title: 'Books',
      type: 'array',
      group: 'books',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'book',
          fields: [
            defineField({ name: 'catTag', title: 'Category tag', type: 'string', validation: req }),
            defineField({ name: 'roman', title: 'Number (e.g. “Nº I”)', type: 'string', validation: req }),
            defineField({
              name: 'coverImage',
              title: 'Cover',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: req })],
              validation: req,
            }),
            defineField({ name: 'buyHref', title: 'Buy link (Saxo)', type: 'url', validation: req }),
            defineField({
              name: 'rating',
              title: 'Rating (stars)',
              type: 'number',
              options: { list: [1, 2, 3, 4, 5] },
              validation: (Rule) => Rule.required().min(1).max(5),
            }),
            defineField({ name: 'readWhen', title: 'Read', type: 'string', validation: req }),
            defineField({ name: 'pages', title: 'Pages', type: 'string', validation: req }),
            defineField({ name: 'language', title: 'Original language', type: 'string', validation: req }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: req }),
            defineField({ name: 'author', title: 'Author', type: 'string', validation: req }),
            defineField({ name: 'year', title: 'Year', type: 'string', validation: req }),
            defineField({
              name: 'metaRow',
              title: 'Meta row',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string', validation: req }),
                    defineField({ name: 'value', title: 'Value', type: 'string', validation: req }),
                  ],
                  preview: { select: { title: 'value', subtitle: 'label' } },
                }),
              ],
              validation: req,
            }),
            defineField({ name: 'lead', title: 'Lead', type: 'text', rows: 3, validation: req }),
            defineField({
              name: 'body',
              title: 'Body text',
              description: 'Use **bold** and *italics* for emphasis.',
              type: 'array',
              of: [proseBlock],
              validation: req,
            }),
            defineField({ name: 'verdictLine', title: 'Verdict — line', type: 'text', rows: 2, validation: req }),
            defineField({ name: 'recoLabel', title: 'Recommendation — label', type: 'string', validation: req }),
            defineField({ name: 'recoText', title: 'Recommendation — text', type: 'string', validation: req }),
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
    emptyCategory('spil', 'Games'),
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
          title: 'Heading',
          description: 'Use *italics* for the accent word.',
          type: 'array',
          of: [inlineBlock],
          validation: req,
        }),
        defineField({
          name: 'body',
          title: 'Body text',
          type: 'array',
          of: [proseBlock],
          validation: req,
        }),
        defineField({
          name: 'actions',
          title: 'Buttons',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'text', title: 'Text', type: 'string', validation: req }),
                defineField({ name: 'href', title: 'Path', type: 'string', validation: req }),
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
          title: 'Add card',
          type: 'object',
          validation: req,
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: req }),
            defineField({ name: 'heading', title: 'Heading', type: 'text', rows: 2, validation: req }),
            defineField({ name: 'body', title: 'Body text', type: 'text', rows: 3, validation: req }),
            defineField({ name: 'placeholder', title: 'Field — placeholder', type: 'string', validation: req }),
            defineField({ name: 'small', title: 'Note', type: 'string', validation: req }),
          ],
        }),
      ],
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Bøger, spil, film' }) },
})
