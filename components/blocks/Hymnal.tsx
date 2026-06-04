import type { PAGE_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'

import styles from './Hymnal.module.css'

type Block = Extract<NonNullable<NonNullable<PAGE_QUERY_RESULT>['blocks']>[number], { _type: 'hymnal' }>
type Column = NonNullable<Block['columns']>[number]
type Row = NonNullable<Column['rows']>[number]

// `.hymnal` from Cash og Jesus.html: a playlist styled as a printed hymnal page —
// a two-column grid of song rows linking out (YouTube etc.).
export function Hymnal({ data }: { data: Block }) {
  const columns = data.columns ?? []

  return (
    <section className={styles.hymnal}>
      <div className="wrap">
        <div className={styles.kicker}>{data.kicker}</div>
        <h2 className={styles.heading}>
          <InlineText value={data.heading} />
        </h2>
        <div className={styles.deck}>
          <PortableText value={data.deck} />
        </div>

        <div className={styles.grid}>
          {columns.map((col: Column, ci: number) => (
            <div className={styles.col} key={ci}>
              <h4 className={styles.colHead}>{col.header}</h4>
              <div className={styles.sub}>{col.subhead}</div>
              {(col.rows ?? []).map((row: Row, ri: number) => (
                <a
                  className={styles.row}
                  href={row.href ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  key={ri}
                >
                  <div className={styles.n}>{row.number}</div>
                  <div className={styles.t}>
                    {row.title}
                    <span className={styles.yr}>{row.sub}</span>
                  </div>
                  <div className={styles.d}>{row.duration}</div>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
