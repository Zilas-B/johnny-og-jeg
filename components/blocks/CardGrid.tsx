import type { PAGE_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'

import styles from './CardGrid.module.css'

type Block = Extract<NonNullable<NonNullable<PAGE_QUERY_RESULT>['blocks']>[number], { _type: 'cardGrid' }>
type Card = NonNullable<Block['cards']>[number]

// `.anatomy` band from Musikeren.html: intro + a four-up grid of numbered cards.
export function CardGrid({ data }: { data: Block }) {
  return (
    <section className={styles.anatomy}>
      <div className="wrap">
        <div className={styles.kicker}>{data.kicker}</div>
        <h2 className={styles.heading}>
          <InlineText value={data.heading} />
        </h2>
        <div className={styles.deck}>
          <PortableText value={data.deck} />
        </div>
        <div className={styles.grid}>
          {(data.cards ?? []).map((card: Card, i: number) => (
            <div className={styles.card} key={i}>
              <div className={styles.roman}>{card.roman}</div>
              <div className={styles.tag}>{card.tag}</div>
              <h4 className={styles.cardHeading}>{card.cardHeading}</h4>
              <div className={styles.cardBody}>
                <PortableText value={card.cardBody} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
