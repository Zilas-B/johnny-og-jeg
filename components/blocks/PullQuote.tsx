import { Fragment } from 'react'

import type { PAGE_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'

import styles from './PullQuote.module.css'

type Block = Extract<NonNullable<NonNullable<PAGE_QUERY_RESULT>['blocks']>[number], { _type: 'pullQuote' }>

// `.lyric` band from Musikeren.html: a dark, centered pull-quote. The decorative
// accent quote-marks are added here; each quote block renders as its own line.
export function PullQuote({ data }: { data: Block }) {
  const lines = data.quote ?? []
  const attribution = data.attribution ?? []

  return (
    <section className={styles.lyric}>
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
