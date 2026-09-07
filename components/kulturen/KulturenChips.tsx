import type { KULTUREN_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'

import styles from './Kulturen.module.css'

type Data = NonNullable<KULTUREN_QUERY_RESULT>
type Chips = NonNullable<Data['chips']>
type Landscape = Data['landscapes'][number]

export function KulturenChips({
  chips,
  landscapes,
}: {
  chips: Chips
  landscapes: Landscape[]
}) {
  return (
    <section className={styles.chips}>
      <div className="wrap">
        <div className={styles.chipsHead}>
          <div className={styles.lab}>
            <InlineText value={chips.label} />
          </div>
          <div className={styles.count}>
            <InlineText value={chips.count} />
          </div>
        </div>
        <div className={styles.chipsGrid} data-kulturen-chips>
          {landscapes.map((l) => (
            <a className={styles.chip} data-kulturen-chip href={`#${l.slug}`} key={l.slug}>
              <div className={styles.ckTop}>
                <span className={styles.rn}>{l.romanNumeral}</span>
                <span>{l.toponym}</span>
              </div>
              <h3 className={styles.ckName}>
                <InlineText value={l.name} />
              </h3>
              {l.motto ? <p className={styles.ckMotto}>{l.motto}</p> : null}
              {l.period ? <div className={styles.ckPeriod}>{l.period}</div> : null}
              <div className={styles.ckArrow}>↓</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
