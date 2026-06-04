import { EnvelopeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import { inlineBlock } from './_shared'

// Home-only block (Step 7e). The closing "Skriv til mig" section from
// `Johnny og jeg.html`: editorial copy + a booking call-out on the left, the
// (presentational) contact form on the right. Only the editorial copy is
// authored — the form fields are functional UI hardcoded in `ContactSection`.
export const contact = defineType({
  name: 'contact',
  title: 'Forside — kontakt',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
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
      name: 'deck',
      title: 'Deck',
      type: 'array',
      of: [inlineBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bookingLabel',
      title: 'Foredrag — label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bookingHeading',
      title: 'Foredrag — overskrift',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bookingBody',
      title: 'Foredrag — tekst',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bookingLinkText',
      title: 'Foredrag — knaptekst',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bookingLinkHref',
      title: 'Foredrag — knapsti',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Forside — kontakt', subtitle: 'Kontakt' }),
  },
})
