import { CalendarIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock } from './_shared'

// Home-only block (Step 7e). The "Et liv på tværs" section from
// `Johnny og jeg.html`: a kicker + emphasised heading + intro, then an
// eight-event timeline (existing `timelineEvent` objects) rendered as two rows
// of four.
export const historicalThread = defineType({
  name: 'historicalThread',
  title: 'Front page — historical thread',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      description: 'Use *italic* to highlight a word in red.',
      type: 'array',
      of: [inlineBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'array',
      of: [inlineBlock],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      description: 'Eight events — rendered as two rows of four.',
      type: 'array',
      of: [defineArrayMember({ type: 'timelineEvent' })],
      validation: (Rule) => Rule.required().length(8),
    }),
  ],
  preview: {
    select: { heading: 'heading', timeline: 'timeline' },
    prepare: ({ heading, timeline }) => ({
      title:
        (heading?.[0]?.children ?? []).map((s: { text?: string }) => s.text ?? '').join('') ||
        'Front page — historical thread',
      subtitle: `Historical thread · ${timeline?.length ?? 0} events`,
    }),
  },
})
