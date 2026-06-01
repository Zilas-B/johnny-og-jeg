import { DocumentTextIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

// Archive entry ("indlæg") belonging to a landscape. No entries are authored in
// Step 5 — the feed renders the empty state. The type exists so the feed code
// path is real and editors can start filling archives in later steps.
export const archiveEntry = defineType({
  name: 'archiveEntry',
  title: 'Arkiv-indlæg',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'landscape',
      title: 'Landskab',
      type: 'reference',
      to: [{ type: 'landscape' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Udgivet',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Anmeldelse', value: 'anmeldelse' },
          { title: 'Fund', value: 'fund' },
          { title: 'Fodnote', value: 'fodnote' },
          { title: 'Note', value: 'note' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Resumé',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { title: 'title', kind: 'kind', landscape: 'landscape.romanNumeral' },
    prepare: ({ title, kind, landscape }) => ({
      title,
      subtitle: [landscape ? `Landskab ${landscape}` : null, kind].filter(Boolean).join(' · '),
    }),
  },
})
