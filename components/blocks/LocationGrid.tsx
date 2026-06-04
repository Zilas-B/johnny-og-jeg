import type { PAGE_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'

import styles from './LocationGrid.module.css'

type Block = Extract<NonNullable<NonNullable<PAGE_QUERY_RESULT>['blocks']>[number], { _type: 'locationGrid' }>
type Card = NonNullable<Block['cards']>[number]

// `.ameri-map` band from Cash og Amerika.html: a 4-up grid of place cards
// (decorative star-rosette + tag + name + coordinates + short description).
export function LocationGrid({ data }: { data: Block }) {
  const cards = data.cards ?? []

  return (
    <section className={styles.map}>
      <div className="wrap">
        <div className={styles.kicker}>{data.kicker}</div>
        <h2 className={styles.heading}>
          <InlineText value={data.heading} />
        </h2>
        <div className={styles.deck}>
          <PortableText value={data.deck} />
        </div>

        <div className={styles.grid}>
          {cards.map((card: Card, i: number) => (
            <div className={styles.card} key={i}>
              <div className={styles.rosette} aria-hidden="true">
                ✶
              </div>
              <div className={styles.placeTag}>{card.placeTag}</div>
              <h4 className={styles.name}>{card.name}</h4>
              <div className={styles.coords}>{card.coords}</div>
              <p className={styles.body}>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
