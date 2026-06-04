import type { PAGE_QUERY_RESULT } from '@/sanity/types'

import styles from './StatsBar.module.css'

type Block = Extract<NonNullable<NonNullable<PAGE_QUERY_RESULT>['blocks']>[number], { _type: 'statsBar' }>
type Cell = NonNullable<Block['cells']>[number]

// `.republic-bar` band from Cash og Amerika.html: a dark strip of labelled stat
// cells (a small mono label above a larger italic value).
export function StatsBar({ data }: { data: Block }) {
  const cells = data.cells ?? []

  return (
    <div className={styles.bar}>
      <div className="wrap">
        <div className={styles.grid}>
          {cells.map((cell: Cell, i: number) => (
            <div className={styles.cell} key={i}>
              <div className={styles.top}>{cell.top}</div>
              <div className={styles.big}>{cell.big}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
