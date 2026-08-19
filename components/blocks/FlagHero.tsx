import { Fragment } from 'react'

import type { PAGE_QUERY_RESULT } from '@/sanity/types'

import { PortableText } from '@/components/editorial/PortableText'

import styles from './FlagHero.module.css'

type Block = Extract<NonNullable<NonNullable<PAGE_QUERY_RESULT>['blocks']>[number], { _type: 'flagHero' }>

// `.flag-hero` band from Cash og Amerika.html, minus the flag photo that used to
// sit behind it (removed in #6). A left text column and a right "telegram"
// card. The H1's two coloured words (.amp barn / .gold brass) are bespoke string
// parts, not inline Portable Text. The .lede drop-cap is a ::first-letter rule.
export function FlagHero({ data }: { data: Block }) {
  const meta = data.metaItems ?? []
  const tg = data.telegram

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
              {data.headingLead} <span className={styles.amp}>{data.headingAmp}</span>
              <br />
              <span className={styles.gold}>{data.headingGold}</span>
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
            {tg ? (
              <aside className={styles.telegram}>
                <div className={styles.postmark}>
                  {tg.postmarkTop} <b>{tg.postmarkMid}</b> {tg.postmarkBottom}
                </div>
                <div className={styles.head}>
                  <div>{tg.headLeft}</div>
                  <div>
                    <b>{tg.headTitle}</b>
                  </div>
                  <div>{tg.headYear}</div>
                </div>
                {(tg.lines ?? []).map((line, i) => (
                  <p className={styles.line} key={i}>
                    {`“${line} `}
                    <span className={styles.stop}>·STOP·</span>
                    {'”'}
                  </p>
                ))}
                <div className={styles.sig}>{tg.sig}</div>
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
