import type { HOME_PAGE_QUERY_RESULT } from '@/sanity/types'

import styles from './SetlistTicker.module.css'

type HomeBlock = NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>['blocks']>[number]
type TickerBlock = Extract<HomeBlock, { _type: 'setlistTicker' }>
type Items = NonNullable<TickerBlock['items']>

export function SetlistTicker({ items }: { items: Items }) {
  // Duplicate the list once so the keyframe can translate -50% for a seamless loop.
  const loop = [...items, ...items]
  return (
    <div className={styles.setlist} aria-hidden="true">
      <div className={styles.track}>
        {loop.map((item, i) => (
          <span key={i}>
            <span className={styles.yr}>{item.year}</span>
            <span>{item.milestone}</span>
            <span className={styles.star}>✶</span>
          </span>
        ))}
      </div>
    </div>
  )
}
