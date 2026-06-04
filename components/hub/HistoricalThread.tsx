import type { HOME_PAGE_QUERY_RESULT } from '@/sanity/types'

import { PortableText } from '@/components/editorial/PortableText'

import styles from './HistoricalThread.module.css'

type HomeBlock = NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>['blocks']>[number]
type Data = Extract<HomeBlock, { _type: 'historicalThread' }>

export function HistoricalThread({ data }: { data: Data }) {
  const timeline = data.timeline ?? []
  const row1 = timeline.slice(0, 4)
  const row2 = timeline.slice(4, 8)

  return (
    <section className={styles.thread}>
      <div className="wrap">
        <div className={styles.head}>
          <div>
            <div className={styles.kicker}>{data.kicker}</div>
            <div className={styles.heading}>
              <PortableText value={data.heading} />
            </div>
          </div>
          <div className={styles.intro}>
            <PortableText value={data.intro} />
          </div>
        </div>

        {row1.length > 0 ? (
          <div className={styles.timeline}>
            {row1.map((ev, i) => (
              <div key={`r1-${i}`} className={styles.ev}>
                <span className={styles.dot} />
                <div className={styles.evYr}>{ev.year}</div>
                <div className={styles.evPlace}>{ev.place}</div>
                <h4 className={styles.evHeading}>{ev.heading}</h4>
                <div className={styles.evDesc}>
                  <PortableText value={ev.description} />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {row2.length > 0 ? (
          <div className={`${styles.timeline} ${styles.timelineRow2}`}>
            {row2.map((ev, i) => (
              <div key={`r2-${i}`} className={styles.ev}>
                <span className={styles.dot} />
                <div className={styles.evYr}>{ev.year}</div>
                <div className={styles.evPlace}>{ev.place}</div>
                <h4 className={styles.evHeading}>{ev.heading}</h4>
                <div className={styles.evDesc}>
                  <PortableText value={ev.description} />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
