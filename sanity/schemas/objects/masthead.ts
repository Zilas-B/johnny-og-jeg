import { defineField, defineType } from 'sanity'

export const masthead = defineType({
  name: 'masthead',
  title: 'Masthead',
  type: 'object',
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'The line above the title, e.g. “— en personlig hyldest —”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Wordmark',
      description: 'The site’s title, e.g. “Johnny & jeg”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sub',
      title: 'Subtitle',
      description: 'The line below the title, e.g. “Musikken · Troen · Amerika”.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'leftLine1',
      title: 'Left, line 1',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'leftLine2',
      title: 'Left, line 2',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rightLine1',
      title: 'Right, line 1',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rightLine2',
      title: 'Right, line 2',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
