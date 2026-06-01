import type { HOME_PAGE_QUERY_RESULT } from '@/sanity/types'

import { VinylTile } from './VinylTile'
import styles from './HubVinyls.module.css'

type Section = NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>['vinyls']>

export function HubVinyls({ data }: { data: Section }) {
  return (
    <div className="wrap">
      <div className={styles.sectHead}>
        <div className={styles.kicker}>{data.kicker}</div>
        <h2 className={styles.heading}>{data.heading}</h2>
        {data.deck ? <p className={styles.deck}>{data.deck}</p> : null}
        <div className={styles.ornament}><span>✶</span></div>
      </div>

      <div className={styles.row}>
        {data.items?.map((v, i) => (
          <VinylTile key={i} vinyl={v} />
        ))}
      </div>
    </div>
  )
}
