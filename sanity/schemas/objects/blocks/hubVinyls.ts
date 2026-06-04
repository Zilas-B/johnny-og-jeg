import { PlayIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// Home-only block (Step 7e). The "Manden i tre spor" section from
// `Johnny og jeg.html`: a kicker/heading/deck header above a row of three
// vinyl tiles (existing `vinylTile` objects, one per "side" of the project).
export const hubVinyls = defineType({
  name: 'hubVinyls',
  title: 'Forside — vinyl-felter',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'Fx "— Tre rubrikker · Side A · Side B · Side C —".',
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
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Felter',
      description: 'Tre felter — én for hver "side" af projektet.',
      type: 'array',
      of: [defineArrayMember({ type: 'vinylTile' })],
      validation: (Rule) => Rule.required().length(3),
    }),
  ],
  preview: {
    select: { title: 'heading', items: 'items' },
    prepare: ({ title, items }) => ({
      title: title || 'Forside — vinyl-felter',
      subtitle: `Vinyl-felter · ${items?.length ?? 0} felter`,
    }),
  },
})
