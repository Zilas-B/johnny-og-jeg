import { PresentationIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// Inline rich text: em/strong only — for headings/decks with an accent word.
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

// Shared "required" shorthand. Sanity's per-field Rule types differ (String /
// Array / Object / Text…), so this is intentionally loosely typed — each field
// supplies its own contextual Rule at the call site.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const req = (Rule: any) => Rule.required()

// Reused "centred section head" shape (kicker + heading + optional deck).
function sectionHead(name: string, title: string, withDeck = true) {
  return defineField({
    name,
    title,
    type: 'object',
    validation: (Rule) => Rule.required(),
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
      ...(withDeck
        ? [defineField({ name: 'deck', title: 'Deck', type: 'array', of: [proseBlock] })]
        : []),
    ],
  })
}

// The Foredrag page — a fixed bespoke `foredragPage` singleton (not block-
// composed). Routed at /foredrag via the [slug] dispatcher. The booking form
// itself is a visual shell (fields hardcoded in BookingForm.tsx); only its
// surrounding editorial copy is modelled here.
export const foredragPage = defineType({
  name: 'foredragPage',
  title: 'Foredrag',
  type: 'document',
  icon: PresentationIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'programs', title: 'Programmes' },
    { name: 'practical', title: 'Practicalities' },
    { name: 'venues', title: 'Venues' },
    { name: 'booking', title: 'Booking' },
    { name: 'faq', title: 'FAQ' },
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
        defineField({ name: 'title', title: 'Title', type: 'string', validation: req }),
        defineField({ name: 'titleSmall', title: 'Title — sub-line', type: 'string', validation: req }),
        defineField({
          name: 'deck',
          title: 'Deck',
          description: 'Use *italics* for emphasis.',
          type: 'array',
          of: [proseBlock],
          validation: req,
        }),
        defineField({
          name: 'metaCells',
          title: 'Meta cells',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'k', title: 'Label', type: 'string', validation: req }),
                defineField({ name: 'v', title: 'Value', type: 'string', validation: req }),
              ],
              preview: { select: { title: 'v', subtitle: 'k' } },
            }),
          ],
          validation: req,
        }),
        defineField({
          name: 'ticket',
          title: 'Ticket stub',
          type: 'object',
          validation: req,
          fields: [
            defineField({ name: 'stampTop', title: 'Stamp — top', type: 'string', validation: req }),
            defineField({ name: 'stampBig', title: 'Stamp — emphasised', type: 'string', validation: req }),
            defineField({ name: 'stampBottom', title: 'Stamp — bottom', type: 'string', validation: req }),
            defineField({ name: 'headLhs', title: 'Head — left', type: 'text', rows: 2, validation: req }),
            defineField({ name: 'headNum', title: 'Head — number', type: 'string', validation: req }),
            defineField({ name: 'heading', title: 'Heading', type: 'text', rows: 2, validation: req }),
            defineField({
              name: 'lines',
              title: 'Lines',
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
            defineField({ name: 'priceLabel', title: 'Price — label', type: 'string', validation: req }),
            defineField({ name: 'price', title: 'Price', type: 'string', validation: req }),
            defineField({ name: 'priceUnit', title: 'Price — unit', type: 'string', validation: req }),
            defineField({ name: 'ctaText', title: 'Button — text', type: 'string', validation: req }),
            defineField({ name: 'ctaHref', title: 'Button — path', type: 'string', initialValue: '#book' }),
          ],
        }),
      ],
    }),

    // ---- Programs ----
    sectionHead('programsHead', 'Programmes — section head'),
    defineField({
      name: 'programs',
      title: 'Programmes',
      type: 'array',
      group: 'programs',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'program',
          fields: [
            defineField({ name: 'side', title: 'Side (e.g. “Side A”)', type: 'string', validation: req }),
            defineField({ name: 'roman', title: 'Roman numeral (e.g. “Nº I”)', type: 'string', validation: req }),
            defineField({ name: 'theme', title: 'Theme (e.g. “Musikeren”)', type: 'string', validation: req }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'array',
              of: [inlineBlock],
              validation: req,
            }),
            defineField({ name: 'sub', title: 'Subhead', type: 'string', validation: req }),
            defineField({ name: 'body', title: 'Body text', type: 'text', rows: 4, validation: req }),
            defineField({
              name: 'arc',
              title: 'Arc',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              validation: req,
            }),
            defineField({ name: 'duration', title: 'Duration', type: 'string', validation: req }),
            defineField({ name: 'bestFor', title: 'Best for', type: 'string', validation: req }),
          ],
          preview: {
            select: { title: 'theme', subtitle: 'sub' },
          },
        }),
      ],
    }),

    // ---- Practical ----
    defineField({
      name: 'practical',
      title: 'Practicalities',
      type: 'object',
      group: 'practical',
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
        defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3, validation: req }),
        defineField({
          name: 'cells',
          title: 'Cells',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'k', title: 'Number (e.g. “01”)', type: 'string', validation: req }),
                defineField({ name: 'label', title: 'Label', type: 'string', validation: req }),
                defineField({ name: 'heading', title: 'Heading', type: 'string', validation: req }),
                defineField({ name: 'body', title: 'Body text', type: 'text', rows: 3, validation: req }),
              ],
              preview: { select: { title: 'heading', subtitle: 'label' } },
            }),
          ],
          validation: req,
        }),
      ],
    }),

    // ---- Venues + testimonial ----
    sectionHead('venuesHead', 'Venues — section head'),
    defineField({
      name: 'venues',
      title: 'Venues',
      type: 'array',
      group: 'venues',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'yr', title: 'Year', type: 'string', validation: req }),
            defineField({ name: 'place', title: 'Venue', type: 'string', validation: req }),
            defineField({ name: 'city', title: 'City', type: 'string', validation: req }),
          ],
          preview: { select: { title: 'place', subtitle: 'city' } },
        }),
      ],
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'object',
      group: 'venues',
      validation: req,
      fields: [
        defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: req }),
        defineField({ name: 'attribName', title: 'Name', type: 'string', validation: req }),
        defineField({ name: 'attribPlace', title: 'Venue', type: 'string', validation: req }),
        defineField({ name: 'attribWhen', title: 'When', type: 'string', validation: req }),
        defineField({ name: 'alsoLabel', title: '“Also booked by” — label', type: 'string', validation: req }),
        defineField({
          name: 'alsoOrgs',
          title: '“Also booked by” — organisations',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
          validation: req,
        }),
      ],
    }),

    // ---- Booking ----
    defineField({
      name: 'booking',
      title: 'Booking',
      type: 'object',
      group: 'booking',
      validation: req,
      fields: [
        defineField({ name: 'kicker', title: 'Kicker', type: 'string', validation: req }),
        defineField({ name: 'heading', title: 'Heading', type: 'text', rows: 2, validation: req }),
        defineField({
          name: 'body',
          title: 'Body text',
          type: 'array',
          of: [proseBlock],
          validation: req,
        }),
        defineField({ name: 'scripture', title: 'Scripture', type: 'string', validation: req }),
        defineField({ name: 'scriptureRef', title: 'Scripture — reference', type: 'string', validation: req }),
        defineField({ name: 'formTitle', title: 'Form — title', type: 'string', validation: req }),
        defineField({ name: 'formStamp', title: 'Form — stamp', type: 'string', validation: req }),
        defineField({ name: 'formPostmark', title: 'Form — postmark', type: 'string', validation: req }),
        defineField({ name: 'formSuccess', title: 'Form — confirmation', type: 'string', validation: req }),
      ],
    }),

    // ---- FAQ ----
    sectionHead('faqHead', 'FAQ — section head', false),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      group: 'faq',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'q', title: 'Question', type: 'string', validation: req }),
            defineField({ name: 'a', title: 'Answer', type: 'text', rows: 3, validation: req }),
          ],
          preview: { select: { title: 'q' } },
        }),
      ],
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Foredrag' }) },
})
