import { defineField, defineType } from 'sanity'

export const masthead = defineType({
  name: 'masthead',
  title: 'Masthead',
  type: 'object',
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      description: 'Linjen over titlen, fx "— en personlig hyldest —".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Wordmark',
      description: 'Sidens titel, fx "Johnny & jeg".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sub',
      title: 'Undertitel',
      description: 'Linjen under titlen, fx "Musikken · Troen · Amerika".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'leftLine1',
      title: 'Venstre, linje 1',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'leftLine2',
      title: 'Venstre, linje 2',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rightLine1',
      title: 'Højre, linje 1',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rightLine2',
      title: 'Højre, linje 2',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
