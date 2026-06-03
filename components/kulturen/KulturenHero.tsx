import type { KULTUREN_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'

import styles from './Kulturen.module.css'

type Hero = NonNullable<NonNullable<KULTUREN_QUERY_RESULT>['hero']>

export function KulturenHero({ hero }: { hero: Hero }) {
  return (
    <section className={styles.khero} id="top">
      <div className="wrap">
        {hero.eyebrow ? (
          <div className={styles.eyebrow}>
            <span className={styles.bar} />
            {hero.eyebrow}
          </div>
        ) : null}
        <h1 className={styles.kheroTitle}>
          <InlineText value={hero.title} />
        </h1>
        {hero.subhead ? <p className={styles.subhead}>{hero.subhead}</p> : null}
        <PortableText value={hero.deck} className={styles.deck} />
      </div>
    </section>
  )
}
