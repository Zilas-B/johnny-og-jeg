import { BookIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

// `.scripture-strip` band from Cash og Jesus.html: a thin full-width accent band
// with an italic scripture line and a monospace reference.
export const scriptureStrip = defineType({
  name: 'scriptureStrip',
  title: 'Skriftbånd',
  type: 'object',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Citat',
      description: 'Fx "For jeg skammer mig ikke ved evangeliet.".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reference',
      title: 'Reference',
      description: 'Fx "Rom. 1:16".',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'quote', subtitle: 'reference' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Skriftbånd',
      subtitle: subtitle ? `Skriftbånd · ${subtitle}` : 'Skriftbånd',
    }),
  },
})
