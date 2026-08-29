import { DocumentTextIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// Slugged, block-composed page (Step 7b). Serves the essay family (Musikeren,
// Cash og Jesus, Cash og Amerika) through the `[slug]` dispatcher's `page`
// branch. The body is a reorderable, curated menu of designed blocks — adding a
// new block type is a code deploy; the editor places/reorders/toggles existing
// blocks. `homePage`/`landscape`/`kulturenPage` are untouched.
const ACCENT_PRESETS = [
  { title: 'Barn (red)', value: 'barn' },
  { title: 'Denim (blue)', value: 'denim' },
  { title: 'Brass (yellow)', value: 'brass' },
]

export const page = defineType({
  name: 'page',
  title: 'Page (essay)',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Internal title (Studio lists) and SEO fallback, e.g. “Musikeren”.',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      description: 'ASCII, e.g. “musikeren”, “cash-og-jesus”.',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent colour',
      type: 'string',
      options: { list: ACCENT_PRESETS, layout: 'radio' },
      initialValue: 'barn',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'blocks',
      title: 'Blocks',
      description: 'The page’s sections in display order. Drag to reorder.',
      type: 'array',
      of: [
        defineArrayMember({ type: 'vinylHero' }),
        defineArrayMember({ type: 'steppedList' }),
        defineArrayMember({ type: 'cardGrid' }),
        defineArrayMember({ type: 'pullQuote' }),
        defineArrayMember({ type: 'nextEssay' }),
        defineArrayMember({ type: 'hymnHero' }),
        defineArrayMember({ type: 'scriptureStrip' }),
        defineArrayMember({ type: 'stations' }),
        defineArrayMember({ type: 'hymnal' }),
        defineArrayMember({ type: 'flagHero' }),
        defineArrayMember({ type: 'statsBar' }),
        defineArrayMember({ type: 'themes' }),
        defineArrayMember({ type: 'locationGrid' }),
      ],
      group: 'content',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title', blocks: 'blocks' },
    prepare: ({ title, blocks }) => ({
      title: title || 'Page',
      subtitle: `Page · ${blocks?.length ?? 0} blocks`,
    }),
  },
})
