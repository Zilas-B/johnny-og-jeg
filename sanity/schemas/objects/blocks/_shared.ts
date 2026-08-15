import { defineArrayMember, defineField } from 'sanity'

// Shared Portable Text array members for the block menu (Step 7b).
//
// `inlineBlock` — em/strong only, no block styles or lists. For headings
//   rendered through InlineText (the design's signature red-emphasis word).
// `proseBlock` — body copy: normal paragraphs, em/strong, plus an external-link
//   annotation. Musikeren's era prose links out to Wikipedia/YouTube, so the
//   link mark + its PortableText serializer ship together.

export const inlineBlock = defineArrayMember({
  type: 'block',
  styles: [{ title: 'Normal', value: 'normal' }],
  lists: [],
  marks: {
    decorators: [
      { title: 'Kursiv', value: 'em' },
      { title: 'Fed', value: 'strong' },
    ],
    annotations: [],
  },
})

export const proseBlock = defineArrayMember({
  type: 'block',
  styles: [{ title: 'Normal', value: 'normal' }],
  lists: [],
  marks: {
    decorators: [
      { title: 'Kursiv', value: 'em' },
      { title: 'Fed', value: 'strong' },
    ],
    annotations: [
      defineField({
        name: 'link',
        title: 'Link',
        type: 'object',
        fields: [
          defineField({
            name: 'href',
            title: 'URL',
            type: 'url',
            validation: (Rule) =>
              Rule.required().uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
          }),
        ],
      }),
    ],
  },
})
