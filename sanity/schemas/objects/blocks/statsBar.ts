import { BarChartIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// `.republic-bar` band from Cash og Amerika.html: a dark full-width strip of
// labelled stat cells (5 in the template). Each cell has a small mono label
// (`top`) above a larger italic value (`big`).
export const statsBar = defineType({
  name: 'statsBar',
  title: 'Statistik-bånd',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'cells',
      title: 'Celler',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'statCell',
          fields: [
            defineField({ name: 'top', title: 'Label', description: 'Fx "Født i".', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'big', title: 'Værdi', description: 'Fx "Arkansas · Delta".', type: 'string', validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'big', subtitle: 'top' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { cells: 'cells' },
    prepare: ({ cells }) => ({
      title: 'Statistik-bånd',
      subtitle: `${cells?.length ?? 0} celler`,
    }),
  },
})
