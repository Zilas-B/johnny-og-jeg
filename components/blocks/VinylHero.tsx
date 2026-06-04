import { Fragment } from 'react'

import type { PAGE_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'

import styles from './VinylHero.module.css'

type Block = Extract<NonNullable<NonNullable<PAGE_QUERY_RESULT>['blocks']>[number], { _type: 'vinylHero' }>

// `.vinyl-hero` + `.sound-ticker` from Musikeren.html. Dark hero with a spinning
// vinyl graphic; the ticker beneath repeats its items for a seamless marquee.
export function VinylHero({ data }: { data: Block }) {
  const meta = data.metaItems ?? []
  const ticker = data.tickerItems ?? []

  return (
    <>
      <section className={styles.hero}>
        <div className="wrap">
          <div className={styles.grid}>
            <div>
              <div className={styles.eyebrow}>
                <span className={styles.bar} />
                {data.eyebrow}
              </div>
              <div className={styles.roman}>{data.romanNumeral}</div>
              <h1 className={styles.heading}>
                <InlineText value={data.heading} />
              </h1>
              <div className={styles.lede}>
                <PortableText value={data.lede} />
              </div>
              <div className={styles.meta}>
                {meta.map((item, i) => (
                  <Fragment key={i}>
                    {i > 0 ? <span className={styles.pipe} /> : null}
                    <div>
                      {item.label}
                      {item.value ? <b> {item.value}</b> : null}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
            <div>
              <div className={styles.bigVinyl}>
                <div className={styles.disc} />
                <div className={styles.label}>
                  <div className={styles.labelTop}>{data.vinylTop}</div>
                  <div className={styles.labelTitle}>{data.vinylTitle}</div>
                  <div className={styles.labelBottom}>{data.vinylBottom}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tk}>
          {[...ticker, ...ticker].map((item, i) => (
            <Fragment key={i}>
              <span className={styles.tkItem}>{item}</span>
              <span className={styles.tkStar}>✶</span>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
