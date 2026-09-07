import type { HOME_PAGE_QUERY_RESULT } from '@/sanity/types'

import styles from './SetlistTicker.module.css'

type HomeBlock = NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>['blocks']>[number]
type TickerBlock = Extract<HomeBlock, { _type: 'setlistTicker' }>
type Items = NonNullable<TickerBlock['items']>

function Milestone({ item }: { item: Items[number] }) {
  return (
    <>
      <span className={styles.yr}>{item.year}</span>
      <span>{item.milestone}</span>
      <span className={styles.star}>✶</span>
    </>
  )
}

/**
 * The Milestone Carousel (CONTEXT.md). Above the breakpoint it auto-scrolls on a
 * timer; below it the animation stops and the strip becomes reader-driven
 * horizontal scroll with scroll-snap — see SetlistTicker.module.css (#32).
 *
 * The list is rendered twice: the first copy is the content, the second exists
 * only so the keyframe can translate -50% and loop seamlessly. Only that second
 * copy is `aria-hidden`, so each Milestone is announced once, and the strip —
 * which browsers make keyboard-focusable once it scrolls — is not hidden
 * content. Below the breakpoint the second copy is display:none, so the reader
 * swipes through the Milestones once.
 */
export function SetlistTicker({ items }: { items: Items }) {
  return (
    <div className={styles.setlist} data-milestone-carousel>
      <div className={styles.track}>
        {items.map((item, i) => (
          <span key={`item-${i}`} data-milestone>
            <Milestone item={item} />
          </span>
        ))}
        {items.map((item, i) => (
          <span
            key={`loop-${i}`}
            className={styles.loopCopy}
            data-milestone-loop-copy
            aria-hidden="true"
          >
            <Milestone item={item} />
          </span>
        ))}
      </div>
    </div>
  )
}
