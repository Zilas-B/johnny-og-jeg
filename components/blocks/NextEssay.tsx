import type { CSSProperties } from 'react'

import type { PAGE_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'

import styles from './NextEssay.module.css'

type Block = Extract<NonNullable<NonNullable<PAGE_QUERY_RESULT>['blocks']>[number], { _type: 'nextEssay' }>
type Card = NonNullable<Block['cards']>[number]

// `.next-side` band from Musikeren.html: "Vend pladen" footer with linked cards
// to sibling essays. Each card carries its own colour via the --c custom prop.
export function NextEssay({ data }: { data: Block }) {
  return (
    <section className={styles.nextSide}>
      <div className="wrap">
        <div className={styles.kicker}>{data.kicker}</div>
        <h2 className={styles.heading}>
          <InlineText value={data.heading} />
        </h2>
        <div className={styles.grid}>
          {(data.cards ?? []).map((card: Card, i: number) => {
            const style = {
              '--c': card.colorScheme === 'brass' ? 'var(--brass)' : 'var(--denim)',
            } as CSSProperties
            return (
              <a className={styles.card} href={card.href ?? undefined} style={style} key={i}>
                <div className={styles.ro}>{card.roman}</div>
                <div>
                  <div className={styles.tag}>{card.tag}</div>
                  <h4 className={styles.cardHeading}>{card.cardHeading}</h4>
                  <div className={styles.ar}>
                    {card.cta} <span>→</span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
