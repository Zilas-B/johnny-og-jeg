import { CogIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'masthead', title: 'Masthead', default: true },
    { name: 'navigation', title: 'Navigation' },
    { name: 'footer', title: 'Footer' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'masthead',
      title: 'Masthead',
      type: 'masthead',
      group: 'masthead',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nav',
      title: 'Navigation',
      type: 'array',
      group: 'navigation',
      of: [defineArrayMember({ type: 'navGroup' })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'cta',
      title: 'CTA button',
      type: 'cta',
      group: 'navigation',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerMark',
      title: 'Footer mark',
      description: 'Text in the top left corner of the footer, e.g. “Johnny & jeg”.',
      type: 'string',
      group: 'footer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerBlurb',
      title: 'Footer blurb',
      type: 'text',
      rows: 3,
      group: 'footer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerQuote',
      title: 'Footer quote',
      type: 'footerQuote',
      group: 'footer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer columns',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({ type: 'footerColumn' })],
      validation: (Rule) => Rule.required().length(3),
    }),
    defineField({
      name: 'footerBottomCopyright',
      title: 'Bottom line — copyright',
      description: 'Use “✶” to insert a star separator (rendered with muted styling).',
      type: 'string',
      group: 'footer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerBottomTagline',
      title: 'Bottom line — tagline',
      description: 'Use “✶” to insert a star separator (rendered with muted styling).',
      type: 'string',
      group: 'footer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO — sitewide defaults',
      description:
        'Used as the default <title>, description and Open Graph image for pages that do not define their own metadata (e.g. /studio, /styleguide). Pages with their own SEO override these.',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
