import { Fragment } from 'react'
import type { CSSProperties } from 'react'

import type { PAGE_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'

import styles from './PullQuote.module.css'

type Block = Extract<NonNullable<NonNullable<PAGE_QUERY_RESULT>['blocks']>[number], { _type: 'pullQuote' }>

// `.lyric` band from Musikeren.html: a dark, centered pull-quote. The decorative
// quote-marks are added here; each quote block renders as its own line. Background
// and border are tone-selectable (Musikeren: ink/accent; Cash og Jesus' gospel-pull:
// accent-deep/brass) — both default to the Musikeren values when unset.
export function PullQuote({ data }: { data: Block }) {
  const lines = data.quote ?? []
  const attribution = data.attribution ?? []
  const onAccentDeep = data.background === 'accentDeep'
  const tone = {
    '--pq-bg': onAccentDeep ? 'var(--accent-deep)' : 'var(--ink)',
    '--pq-border': data.borderTone === 'brass' ? 'var(--brass)' : 'var(--accent)',
  } as CSSProperties

  return (
    <section className={`${styles.lyric} ${onAccentDeep ? styles.glow : ''}`} style={tone}>
      <div className={`wrap ${styles.wrap}`}>
        <div className={styles.kicker}>{data.kicker}</div>
        <blockquote className={styles.quote}>
          <span className={styles.h}>“</span>{' '}
          {lines.map((line, i) => (
            <Fragment key={line._key ?? i}>
              {i > 0 ? <br /> : null}
              <InlineText value={[line]} />
            </Fragment>
          ))}{' '}
          <span className={styles.h}>”</span>
        </blockquote>
        <div className={styles.attrib}>
          {attribution.map((part, i) => (
            <Fragment key={i}>
              {i > 0 ? <span className={styles.star}>✶</span> : null}
              {part}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
