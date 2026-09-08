import type { LANDSCAPE_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'

import styles from './LandscapePosts.module.css'

type Landscape = NonNullable<LANDSCAPE_QUERY_RESULT>

export function LandscapePosts({ data }: { data: Landscape }) {
  const entries = data.entries ?? []
  const hasEntries = entries.length > 0
  const meta = hasEntries ? `${entries.length} indlæg` : data.emptyMeta

  return (
    <section className={styles.posts}>
      <div className="wrap">
        <div className={styles.head}>
          <h2>
            Indlæg · <InlineText value={data.name} />
          </h2>
          {meta ? <div className={styles.meta}>{meta}</div> : null}
        </div>

        {hasEntries ? (
          <div className={styles.feed}>
            {entries.map((entry, i) => (
              <article className={styles.entry} key={entry.slug ?? i}>
                <div>
                  <h3 className={styles.entryTitle}>{entry.title}</h3>
                  {entry.summary ? <p className={styles.entrySummary}>{entry.summary}</p> : null}
                </div>
                <div className={styles.entryMeta}>
                  {[entry.kind, entry.publishedAt?.slice(0, 4)].filter(Boolean).join(' · ')}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.empty} data-landscape-empty>
            {data.emptyLabel ? <div className={styles.emptyLab}>{data.emptyLabel}</div> : null}
            {data.emptyHeading ? (
              <h3 className={styles.emptyHeading}>
                <InlineText value={data.emptyHeading} />
              </h3>
            ) : null}
            <PortableText value={data.emptyBody} className={styles.emptyBody} />
            {data.emptyActions && data.emptyActions.length > 0 ? (
              <div className={styles.actions}>
                {data.emptyActions.map((action, i) => (
                  <a
                    key={i}
                    href={action.href ?? '#'}
                    className={action.style === 'secondary' ? styles.secondary : styles.primary}
                  >
                    {action.text}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
