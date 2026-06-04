import { CalendarIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

import { inlineBlock } from './_shared'

// Home-only block (Step 7e). The "Et liv på tværs" section from
// `Johnny og jeg.html`: a kicker + emphasised heading + intro, then an
// eight-event timeline (existing `timelineEvent` objects) rendered as two rows
// of four.
export const historicalThread = defineType({
  name: 'historicalThread',
  title: 'Forside — historisk tråd',
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
      title: 'Overskrift',
      description: 'Brug *kursiv* for at fremhæve ord i rød.',
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
      title: 'Tidslinje',
      description: 'Otte begivenheder — gengivet som to rækker à fire.',
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
        'Forside — historisk tråd',
      subtitle: `Historisk tråd · ${timeline?.length ?? 0} begivenheder`,
    }),
  },
})
