import { CogIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Indstillinger for sitet',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'masthead', title: 'Masthead', default: true },
    { name: 'navigation', title: 'Navigation' },
    { name: 'footer', title: 'Footer' },
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
      title: 'CTA-knap',
      type: 'cta',
      group: 'navigation',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerMark',
      title: 'Footer-mark',
      description: 'Tekst i øverste venstre hjørne af footeren, fx "Johnny & jeg".',
      type: 'string',
      group: 'footer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerBlurb',
      title: 'Footer-blurb',
      type: 'text',
      rows: 3,
      group: 'footer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerQuote',
      title: 'Footer-citat',
      type: 'footerQuote',
      group: 'footer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer-kolonner',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({ type: 'footerColumn' })],
      validation: (Rule) => Rule.required().length(3),
    }),
    defineField({
      name: 'footerBottomCopyright',
      title: 'Bundlinje — copyright',
      description: 'Brug "✶" for at indsætte stjerne-separator (renderes med dæmpet styling).',
      type: 'string',
      group: 'footer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerBottomTagline',
      title: 'Bundlinje — tagline',
      description: 'Brug "✶" for at indsætte stjerne-separator (renderes med dæmpet styling).',
      type: 'string',
      group: 'footer',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Indstillinger for sitet' }),
  },
})
