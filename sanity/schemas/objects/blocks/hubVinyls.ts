import { PlayIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// Home-only block (Step 7e). The "Manden i tre spor" section from
// `Johnny og jeg.html`: a kicker/heading/deck header above a row of three
// vinyl tiles (existing `vinylTile` objects, one per "side" of the project).
export const hubVinyls = defineType({
  name: 'hubVinyls',
  title: 'Front page — Vinyl Tiles',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'E.g. “— Tre rubrikker · Side A · Side B · Side C —”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
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
      title: 'Vinyl Tiles',
      description: 'Three Vinyl Tiles — one for each “side” of the project.',
      type: 'array',
      of: [defineArrayMember({ type: 'vinylTile' })],
      validation: (Rule) => Rule.required().length(3),
    }),
  ],
  preview: {
    select: { title: 'heading', items: 'items' },
    prepare: ({ title, items }) => ({
      title: title || 'Front page — Vinyl Tiles',
      subtitle: `Vinyl Tiles · ${items?.length ?? 0} of 3`,
    }),
  },
})
