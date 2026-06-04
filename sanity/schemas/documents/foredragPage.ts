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
        title: 'Overskrift',
        description: 'Brug *kursiv* for accent-ordet.',
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
    { name: 'programs', title: 'Programmer' },
    { name: 'practical', title: 'Det praktiske' },
    { name: 'venues', title: 'Steder' },
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
        defineField({ name: 'title', title: 'Titel', type: 'string', validation: req }),
        defineField({ name: 'titleSmall', title: 'Titel — underlinje', type: 'string', validation: req }),
        defineField({
          name: 'deck',
          title: 'Deck',
          description: 'Brug *kursiv* til fremhævning.',
          type: 'array',
          of: [proseBlock],
          validation: req,
        }),
        defineField({
          name: 'metaCells',
          title: 'Meta-celler',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'k', title: 'Label', type: 'string', validation: req }),
                defineField({ name: 'v', title: 'Værdi', type: 'string', validation: req }),
              ],
              preview: { select: { title: 'v', subtitle: 'k' } },
            }),
          ],
          validation: req,
        }),
        defineField({
          name: 'ticket',
          title: 'Billet-stub',
          type: 'object',
          validation: req,
          fields: [
            defineField({ name: 'stampTop', title: 'Stempel — top', type: 'string', validation: req }),
            defineField({ name: 'stampBig', title: 'Stempel — fremhævet', type: 'string', validation: req }),
            defineField({ name: 'stampBottom', title: 'Stempel — bund', type: 'string', validation: req }),
            defineField({ name: 'headLhs', title: 'Hoved — venstre', type: 'text', rows: 2, validation: req }),
            defineField({ name: 'headNum', title: 'Hoved — nummer', type: 'string', validation: req }),
            defineField({ name: 'heading', title: 'Overskrift', type: 'text', rows: 2, validation: req }),
            defineField({
              name: 'lines',
              title: 'Linjer',
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
            defineField({ name: 'priceLabel', title: 'Pris — label', type: 'string', validation: req }),
            defineField({ name: 'price', title: 'Pris', type: 'string', validation: req }),
            defineField({ name: 'priceUnit', title: 'Pris — enhed', type: 'string', validation: req }),
            defineField({ name: 'ctaText', title: 'Knap — tekst', type: 'string', validation: req }),
            defineField({ name: 'ctaHref', title: 'Knap — sti', type: 'string', initialValue: '#book' }),
          ],
        }),
      ],
    }),

    // ---- Programs ----
    sectionHead('programsHead', 'Programmer — sektionshoved'),
    defineField({
      name: 'programs',
      title: 'Programmer',
      type: 'array',
      group: 'programs',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'program',
          fields: [
            defineField({ name: 'side', title: 'Side (fx "Side A")', type: 'string', validation: req }),
            defineField({ name: 'roman', title: 'Romertal (fx "Nº I")', type: 'string', validation: req }),
            defineField({ name: 'theme', title: 'Tema (fx "Musikeren")', type: 'string', validation: req }),
            defineField({
              name: 'heading',
              title: 'Overskrift',
              type: 'array',
              of: [inlineBlock],
              validation: req,
            }),
            defineField({ name: 'sub', title: 'Underrubrik', type: 'string', validation: req }),
            defineField({ name: 'body', title: 'Brødtekst', type: 'text', rows: 4, validation: req }),
            defineField({
              name: 'arc',
              title: 'Forløb',
              type: 'array',
              of: [defineArrayMember({ type: 'string' })],
              validation: req,
            }),
            defineField({ name: 'duration', title: 'Varighed', type: 'string', validation: req }),
            defineField({ name: 'bestFor', title: 'Bedst til', type: 'string', validation: req }),
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
      title: 'Det praktiske',
      type: 'object',
      group: 'practical',
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
        defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3, validation: req }),
        defineField({
          name: 'cells',
          title: 'Celler',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'k', title: 'Tal (fx "01")', type: 'string', validation: req }),
                defineField({ name: 'label', title: 'Label', type: 'string', validation: req }),
                defineField({ name: 'heading', title: 'Overskrift', type: 'string', validation: req }),
                defineField({ name: 'body', title: 'Brødtekst', type: 'text', rows: 3, validation: req }),
              ],
              preview: { select: { title: 'heading', subtitle: 'label' } },
            }),
          ],
          validation: req,
        }),
      ],
    }),

    // ---- Venues + testimonial ----
    sectionHead('venuesHead', 'Steder — sektionshoved'),
    defineField({
      name: 'venues',
      title: 'Steder',
      type: 'array',
      group: 'venues',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'yr', title: 'År', type: 'string', validation: req }),
            defineField({ name: 'place', title: 'Sted', type: 'string', validation: req }),
            defineField({ name: 'city', title: 'By', type: 'string', validation: req }),
          ],
          preview: { select: { title: 'place', subtitle: 'city' } },
        }),
      ],
    }),
    defineField({
      name: 'testimonial',
      title: 'Udtalelse',
      type: 'object',
      group: 'venues',
      validation: req,
      fields: [
        defineField({ name: 'quote', title: 'Citat', type: 'text', rows: 4, validation: req }),
        defineField({ name: 'attribName', title: 'Navn', type: 'string', validation: req }),
        defineField({ name: 'attribPlace', title: 'Sted', type: 'string', validation: req }),
        defineField({ name: 'attribWhen', title: 'Tidspunkt', type: 'string', validation: req }),
        defineField({ name: 'alsoLabel', title: '"Også booket af" — label', type: 'string', validation: req }),
        defineField({
          name: 'alsoOrgs',
          title: '"Også booket af" — organisationer',
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
        defineField({ name: 'heading', title: 'Overskrift', type: 'text', rows: 2, validation: req }),
        defineField({
          name: 'body',
          title: 'Brødtekst',
          type: 'array',
          of: [proseBlock],
          validation: req,
        }),
        defineField({ name: 'scripture', title: 'Skriftsted', type: 'string', validation: req }),
        defineField({ name: 'scriptureRef', title: 'Skriftsted — reference', type: 'string', validation: req }),
        defineField({ name: 'formTitle', title: 'Formular — titel', type: 'string', validation: req }),
        defineField({ name: 'formStamp', title: 'Formular — stempel', type: 'string', validation: req }),
        defineField({ name: 'formPostmark', title: 'Formular — afsender', type: 'string', validation: req }),
        defineField({ name: 'formSuccess', title: 'Formular — kvittering', type: 'string', validation: req }),
      ],
    }),

    // ---- FAQ ----
    sectionHead('faqHead', 'FAQ — sektionshoved', false),
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
            defineField({ name: 'q', title: 'Spørgsmål', type: 'string', validation: req }),
            defineField({ name: 'a', title: 'Svar', type: 'text', rows: 3, validation: req }),
          ],
          preview: { select: { title: 'q' } },
        }),
      ],
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Foredrag' }) },
})
