import {
  PortableText as BasePortableText,
  type PortableTextComponents,
} from '@portabletext/react'

import styles from './PortableText.module.css'

// The generated Sanity types for block content mark `children` as optional,
// which conflicts with `@portabletext/react`'s strict `PortableTextBlock`
// type. The runtime payload is the same shape — we just need TS to stop
// fighting over the optionality. Accept any block-like object here.
type BlockLike = { _type: string; _key?: string }

type Props = {
  value: BlockLike[] | BlockLike | null | undefined
  withDropCap?: boolean
  className?: string
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    // Subsection heading inside an essay (e.g. Kulturen's Mindretallene section).
    h4: ({ children }) => <h4 className={styles.subhead}>{children}</h4>,
    // Pull-quote callout — the `.land-pull` style, accent-coloured.
    pull: ({ children }) => <p className={styles.pull}>{children}</p>,
  },
  marks: {
    em: ({ children }) => <em>{children}</em>,
    strong: ({ children }) => <strong>{children}</strong>,
    // External link annotation (essay prose, §6 rule 2). Internal links are a
    // later step; everything authored so far is an outbound reference.
    link: ({ children, value }) => (
      <a href={(value as { href?: string })?.href} target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
  },
}

export function PortableText({ value, withDropCap = false, className }: Props) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  const wrapperClass = [withDropCap ? styles.withDropCap : null, className]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={wrapperClass || undefined}>
      <BasePortableText value={value} components={components} />
    </div>
  )
}
