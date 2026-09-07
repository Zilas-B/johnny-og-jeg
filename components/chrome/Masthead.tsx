import Link from 'next/link'

import type { SITE_SETTINGS_QUERY_RESULT } from '@/sanity/types'

import styles from './Masthead.module.css'

type MastheadData = NonNullable<NonNullable<SITE_SETTINGS_QUERY_RESULT>['masthead']>

export function Masthead({ data }: { data: MastheadData }) {
  return (
    <header className={styles.masthead}>
      <div className="wrap">
        <div className={styles.mastGrid}>
          <div className={styles.mastSide} data-masthead-side>
            {data.leftLine1}
            <br />
            {data.leftLine2}
          </div>
          <div className={styles.wordmark}>
            <Link href="/" className={styles.nameLink}>
              <div className={styles.kicker}>{data.kicker}</div>
              <div className={styles.name}>{data.name}</div>
              <div className={styles.sub}>{data.sub}</div>
            </Link>
          </div>
          <div className={`${styles.mastSide} ${styles.mastSideRight}`} data-masthead-side>
            {data.rightLine1}
            <br />
            {data.rightLine2}
          </div>
        </div>
      </div>
    </header>
  )
}
