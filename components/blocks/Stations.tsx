import type { PAGE_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'

import styles from './Stations.module.css'

type Block = Extract<NonNullable<NonNullable<PAGE_QUERY_RESULT>['blocks']>[number], { _type: 'stations' }>
type Item = NonNullable<Block['items']>[number]

// `.stations` from Cash og Jesus.html: numbered narrative stops. Each item has a
// left number-block (roman + years + location) and a right column of heading /
// where-label / prose, plus an optional blockquote.
export function Stations({ data }: { data: Block }) {
  const items = data.items ?? []

  return (
    <section className={styles.stations}>
      <div className="wrap">
        <div className={styles.kicker}>{data.kicker}</div>
        <h2 className={styles.heading}>
          <InlineText value={data.heading} />
        </h2>
        <div className={styles.deck}>
          <PortableText value={data.deck} />
        </div>

        {items.map((item: Item, i: number) => (
          <div className={styles.station} key={i}>
            <div className={styles.numBlock}>
              <div className={styles.num}>{item.roman}</div>
              <div className={styles.tag}>
                {item.years}
                <br />
                {item.location}
              </div>
            </div>
            <div>
              <h3 className={styles.h3}>{item.heading}</h3>
              <div className={styles.where}>{item.where}</div>
              <div className={styles.body}>
                <PortableText value={item.body} />
              </div>
              {item.quote ? (
                <blockquote className={styles.quote}>
                  {`“${item.quote.text}”`}
                  <span className={styles.ref}>{item.quote.attribution}</span>
                </blockquote>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
