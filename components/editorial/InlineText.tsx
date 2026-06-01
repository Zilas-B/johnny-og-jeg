import { Fragment } from 'react'

// Renders inline Portable Text (em/strong spans) WITHOUT block wrappers, so it
// can live inside an <h1>/<h2>/<h3>. The shared PortableText wrapper always
// emits <p> blocks — use that for multi-paragraph body copy, this for headings.

type Span = { _type?: string; _key?: string; text?: string; marks?: string[] }
type Block = { _key?: string; children?: Span[] }

export function InlineText({ value }: { value?: Block[] | null }) {
  if (!value || value.length === 0) return null
  return (
    <>
      {value.map((block, bi) => (
        <Fragment key={block._key ?? bi}>
          {bi > 0 ? ' ' : null}
          {(block.children ?? []).map((span, si) => {
            const text = span.text ?? ''
            const key = span._key ?? si
            if (span.marks?.includes('em')) return <em key={key}>{text}</em>
            if (span.marks?.includes('strong')) return <strong key={key}>{text}</strong>
            return <Fragment key={key}>{text}</Fragment>
          })}
        </Fragment>
      ))}
    </>
  )
}

export function plainText(value?: Block[] | null): string {
  if (!value) return ''
  return value
    .map((block) => (block.children ?? []).map((span) => span.text ?? '').join(''))
    .join(' ')
    .trim()
}
