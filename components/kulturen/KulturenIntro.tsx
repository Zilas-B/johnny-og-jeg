import type { KULTUREN_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'

import styles from './Kulturen.module.css'

type Intro = NonNullable<NonNullable<KULTUREN_QUERY_RESULT>['intro']>

export function KulturenIntro({ intro }: { intro: Intro }) {
  return (
    <section className={styles.kintro}>
      <div className="wrap">
        <div className={styles.kintroGrid} data-kulturen-intro>
          <div data-kulturen-column>
            {intro.kicker ? <div className={styles.kicker}>{intro.kicker}</div> : null}
            <h2 className={styles.kintroHeading}>
              <InlineText value={intro.heading} />
            </h2>
            {intro.signature ? <div className={styles.signature}>{intro.signature}</div> : null}
          </div>
          <div data-kulturen-column>
            <PortableText value={intro.body} className={styles.kintroBody} />
          </div>
        </div>
      </div>
    </section>
  )
}
