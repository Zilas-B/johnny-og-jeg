import { DocumentTextIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// Slugged, block-composed page (Step 7b). Serves the essay family (Musikeren,
// Cash og Jesus, Cash og Amerika) through the `[slug]` dispatcher's `page`
// branch. The body is a reorderable, curated menu of designed blocks — adding a
// new block type is a code deploy; the editor places/reorders/toggles existing
// blocks. `homePage`/`landscape`/`kulturenPage` are untouched.
const ACCENT_PRESETS = [
  { title: 'Barn (rød)', value: 'barn' },
  { title: 'Denim (blå)', value: 'denim' },
  { title: 'Brass (gul)', value: 'brass' },
]

export const page = defineType({
  name: 'page',
  title: 'Side (essay)',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'content', title: 'Indhold', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      description: 'Intern titel (Studio-lister) og SEO-fallback, fx "Musikeren".',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-slug',
      description: 'ASCII, fx "musikeren", "cash-og-jesus".',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'accentColor',
      title: 'Accentfarve',
      type: 'string',
      options: { list: ACCENT_PRESETS, layout: 'radio' },
      initialValue: 'barn',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'blocks',
      title: 'Blokke',
      description: 'Sidens sektioner i visningsrækkefølge. Træk for at omarrangere.',
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
      title: title || 'Side',
      subtitle: `Side · ${blocks?.length ?? 0} blokke`,
    }),
  },
})
