import { Fragment } from 'react'

import type { PAGE_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'

import styles from './SteppedList.module.css'

type Block = Extract<NonNullable<NonNullable<PAGE_QUERY_RESULT>['blocks']>[number], { _type: 'steppedList' }>
type Item = NonNullable<Block['items']>[number]
type Cut = NonNullable<Item['cuts']>[number]

// `.eras` band from Musikeren.html: intro + a stepped list of year-stamped items,
// each with prose and a grid of "cut" link cards.
export function SteppedList({ data }: { data: Block }) {
  return (
    <section className={styles.eras}>
      <div className="wrap">
        <div className={styles.kicker}>{data.kicker}</div>
        <h2 className={styles.heading}>
          <InlineText value={data.heading} />
        </h2>
        <div className={styles.deck}>
          <PortableText value={data.deck} />
        </div>

        {(data.items ?? []).map((item: Item, i: number) => (
          <div className={styles.era} key={i}>
            <div className={styles.left}>
              <div className={styles.yrs}>{item.years}</div>
              <div className={styles.label}>{item.label}</div>
              <div className={styles.tag}>
                {(item.tag ?? []).map((line, li) => (
                  <Fragment key={li}>
                    {li > 0 ? <br /> : null}
                    {line.label} <b>{line.value}</b>
                  </Fragment>
                ))}
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.body}>
                <PortableText value={item.body} />
              </div>
              {item.cuts && item.cuts.length > 0 ? (
                <div className={styles.cuts}>
                  {item.cuts.map((cut: Cut, ci: number) =>
                    cut.cutHref ? (
                      <a
                        className={styles.cut}
                        href={cut.cutHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={ci}
                      >
                        <div className={styles.cutLbl}>{cut.cutLabel}</div>
                        <div className={styles.cutTitle}>{cut.cutTitle}</div>
                        <div className={styles.cutDur}>{cut.cutDuration}</div>
                      </a>
                    ) : (
                      <div className={styles.cut} key={ci}>
                        <div className={styles.cutLbl}>{cut.cutLabel}</div>
                        <div className={styles.cutTitle}>{cut.cutTitle}</div>
                        <div className={styles.cutDur}>{cut.cutDuration}</div>
                      </div>
                    ),
                  )}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
