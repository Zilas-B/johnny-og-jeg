import type { PAGE_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'

import styles from './Themes.module.css'

type Block = Extract<NonNullable<NonNullable<PAGE_QUERY_RESULT>['blocks']>[number], { _type: 'themes' }>
type Item = NonNullable<Block['items']>[number]

// `.themes` band from Cash og Amerika.html: numbered themes, each with a left
// block (roman + years + title + key tags) and a right column of prose plus an
// optional "song pin" link-out card.
export function Themes({ data }: { data: Block }) {
  const items = data.items ?? []

  return (
    <section className={styles.themes}>
      <div className="wrap">
        <div className={styles.kicker}>{data.kicker}</div>
        <h2 className={styles.heading}>
          <InlineText value={data.heading} />
        </h2>
        <div className={styles.deck}>
          <PortableText value={data.deck} />
        </div>

        {items.map((item: Item, i: number) => (
          <div className={styles.theme} key={i}>
            <div className={styles.left}>
              <div className={styles.num}>{item.num}</div>
              <div className={styles.when}>{item.when}</div>
              <h3 className={styles.h3}>{item.title}</h3>
              <div className={styles.key}>
                {(item.keys ?? []).map((k, ki) => (
                  <span key={ki}>{k}</span>
                ))}
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.body}>
                <PortableText value={item.body} />
              </div>
              {item.song ? (
                <a
                  className={styles.songPin}
                  href={item.song.href ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.pip}>▶</span>
                  <span className={styles.t}>
                    <span className={styles.sm}>{item.song.label}</span>
                    {item.song.title}
                  </span>
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
