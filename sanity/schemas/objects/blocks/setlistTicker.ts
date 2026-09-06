import { ClockIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// Home-only block (Step 7e). The scrolling "setlist" marquee from
// `Johnny og jeg.html` — a strip of year/milestone pairs (existing `tickerItem`
// objects) that `SetlistTicker` duplicates for a seamless loop.
export const setlistTicker = defineType({
  name: 'setlistTicker',
  title: 'Front page — Milestone Carousel',
  type: 'object',
  icon: ClockIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Milestones',
      type: 'array',
      of: [defineArrayMember({ type: 'tickerItem' })],
      validation: (Rule) => Rule.required().min(4),
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }) => ({
      title: 'Front page — Milestone Carousel',
      subtitle: `Milestone Carousel · ${items?.length ?? 0} milestones`,
    }),
  },
})
