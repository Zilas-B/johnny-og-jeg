import { Fragment } from 'react'

import type { PAGE_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'

import styles from './HymnHero.module.css'

type Block = Extract<NonNullable<NonNullable<PAGE_QUERY_RESULT>['blocks']>[number], { _type: 'hymnHero' }>

// `.hymn-hero` from Cash og Jesus.html. Dark (accent-deep) hero: a left text
// column and a right stained-glass figure rendered entirely in CSS — only its
// two caption strings are authored. The emphasised heading word renders brass.
export function HymnHero({ data }: { data: Block }) {
  const meta = data.metaItems ?? []

  return (
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
            <figure className={styles.glass}>
              <div className={styles.glassArt}>
                <div className={styles.glassArtGrid} />
              </div>
              <figcaption className={styles.glassCap}>
                <div className={styles.sub}>{data.glassCaptionTop}</div>
                {`“${data.glassQuote}”`}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
