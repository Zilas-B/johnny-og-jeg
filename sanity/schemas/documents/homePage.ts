import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// Forsiden (Step 7e). Migrated from a fixed named-field schema to the
// reorderable `blocks[]` model proven on the essays in Step 7b. Stays a
// singleton rendered at `/` (not via `[slug]`); the body draws only from the
// six home-only block types, rendered through the shared `BlockRenderer`.
export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page — Johnny og jeg',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'blocks',
      title: 'Blocks',
      description: 'The front page’s sections in display order. Drag to reorder.',
      type: 'array',
      of: [
        defineArrayMember({ type: 'hubHero' }),
        defineArrayMember({ type: 'setlistTicker' }),
        defineArrayMember({ type: 'hubVinyls' }),
        defineArrayMember({ type: 'historicalThread' }),
        defineArrayMember({ type: 'hymn' }),
        defineArrayMember({ type: 'contact' }),
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
    prepare: () => ({ title: 'Home Page — Johnny og jeg' }),
  },
})
