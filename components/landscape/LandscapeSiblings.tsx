import Link from 'next/link'

import type { LANDSCAPE_SIBLINGS_QUERY_RESULT } from '@/sanity/types'

import styles from './LandscapeSiblings.module.css'

export function LandscapeSiblings({
  siblings,
  currentSlug,
}: {
  siblings: LANDSCAPE_SIBLINGS_QUERY_RESULT
  currentSlug: string
}) {
  return (
    <section className={styles.siblings}>
      <div className="wrap">
        <div className={styles.lab}>
          — Hop til et andet <b>arkiv</b> —
        </div>
        <div className={styles.grid} data-landscape-siblings-grid>
          {siblings.map((s) => {
            const isCurrent = s.slug === currentSlug
            return (
              <Link
                key={s.slug ?? s.romanNumeral}
                href={`/${s.slug}`}
                className={`${styles.cell} ${isCurrent ? styles.current : ''}`}
                aria-current={isCurrent ? 'page' : undefined}
                data-landscape-sibling-cell
              >
                <div className={styles.srn}>{s.romanNumeral}</div>
                <div className={styles.sname}>{s.shortName}</div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
