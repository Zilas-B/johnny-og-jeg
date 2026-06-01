import Link from 'next/link'

import type { LANDSCAPE_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'

import styles from './LandscapeHero.module.css'

type Landscape = NonNullable<LANDSCAPE_QUERY_RESULT>

export function LandscapeHero({ data }: { data: Landscape }) {
  const trail = [`Landskab ${data.romanNumeral}`, data.toponym, data.period]
    .filter(Boolean)
    .join(' · ')

  return (
    <section className={styles.hero}>
      <div className="wrap">
        <div className={styles.crumb}>
          {data.crumbBackText && data.crumbBackHref ? (
            <>
              <Link href={data.crumbBackHref}>{data.crumbBackText}</Link>
              <span className={styles.sep}>·</span>
            </>
          ) : null}
          {trail}
        </div>
        <div className={styles.grid}>
          <div className={styles.rn}>{data.romanNumeral}</div>
          <div>
            {data.eyebrow ? <div className={styles.eyebrow}>{data.eyebrow}</div> : null}
            <h1 className={styles.title}>
              <InlineText value={data.name} />
            </h1>
            {data.motto ? <p className={styles.motto}>{data.motto}</p> : null}
            <PortableText value={data.deck} className={styles.deck} />
            {data.topics && data.topics.length > 0 ? (
              <div className={styles.tags}>
                {data.topicsLabel ? <b>{data.topicsLabel}</b> : null} {data.topics.join(' · ')}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
