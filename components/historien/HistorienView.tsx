import type { HISTORIEN_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'
import { SanityImage } from '@/components/editorial/SanityImage'

import styles from './Historien.module.css'

type Data = NonNullable<HISTORIEN_QUERY_RESULT>
type Era = NonNullable<Data['eras']>[number]

const SHAPE: Record<string, string> = { wide: styles.wide, tall: styles.tall, sq: styles.sq }

export function HistorienView({ data }: { data: Data }) {
  const eras = data.eras ?? []

  return (
    <div>
      {data.hero ? <HistorienHero hero={data.hero} eras={eras} /> : null}
      <HistorienTimeline eras={eras} />
      {eras.map((era, i) => (
        <HistorienEra key={i} era={era} index={i} />
      ))}
      {data.outro ? <HistorienOutro outro={data.outro} /> : null}
    </div>
  )
}

function HistorienHero({ hero, eras }: { hero: NonNullable<Data['hero']>; eras: Era[] }) {
  return (
    <section className={styles.hhero}>
      <div className="wrap">
        <div className={styles.hheroGrid}>
          <div>
            <div className={styles.eyebrow}>
              <span className={styles.bar} />
              {hero.eyebrow}
            </div>
            <h1 className={styles.h1}>
              {hero.title}
              <span className={styles.h1Sub}>{hero.titleSub}</span>
            </h1>
            <PortableText value={hero.deck} className={styles.heroDeck} />
          </div>

          <aside className={styles.side}>
            <div className={styles.sideLabel}>{hero.sideLabel}</div>
            <h3 className={styles.sideHeading}>{hero.sideHeading}</h3>
            <ol className={styles.sideList}>
              {eras.map((era, i) => (
                <li key={i}>
                  <a href={`#era-${i + 1}`}>
                    {era.navName}
                    <span className={styles.sideYr}>{era.period}</span>
                  </a>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  )
}

function HistorienTimeline({ eras }: { eras: Era[] }) {
  return (
    <div className={styles.tline}>
      <div className="wrap">
        <div className={styles.tlineGrid} data-timeline>
          {eras.map((era, i) => (
            <div className={styles.tcell} data-timeline-point key={i}>
              <a href={`#era-${i + 1}`}>
                <div className={styles.dot} />
                <div className={styles.tyr} data-timeline-year>{era.period}</div>
                <div className={styles.tname} data-timeline-name>{era.timelineName}</div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HistorienEra({ era, index }: { era: Era; index: number }) {
  // Acts II / IV / VI (1-based even) render dark with the photo mirrored right.
  const dark = index % 2 === 1
  const sectionClass = [styles.era, dark ? styles.dark : null].filter(Boolean).join(' ')
  const rowClass = [styles.eraRow, dark ? styles.reverse : null].filter(Boolean).join(' ')
  const shapeClass = SHAPE[era.image?.shape ?? 'wide'] ?? styles.wide

  return (
    <section className={sectionClass} data-era id={`era-${index + 1}`}>
      <div className="wrap">
        <div className={rowClass}>
          <div className={styles.eraPhoto} data-era-photo>
            <div className={styles.stamp}>
              Akt {era.romanNumeral} · {era.period}
            </div>
            {era.imageCollage?.asset ? (
              <div className={styles.collage}>
                <div className={`${styles.pframe} ${styles.t1}`}>
                  <SanityImage image={era.image} fill sizes="(max-width: 1280px) 25vw, 300px" />
                </div>
                <div className={`${styles.pframe} ${styles.t2}`}>
                  <SanityImage image={era.imageCollage} fill sizes="(max-width: 1280px) 25vw, 240px" />
                </div>
              </div>
            ) : (
              <div className={`${styles.pframe} ${shapeClass}`}>
                <SanityImage image={era.image} fill sizes="(max-width: 1280px) 50vw, 560px" />
              </div>
            )}
            <div className={styles.credit}>
              — {era.creditLeft} <span className={styles.star}>✶</span> {era.creditRight} —
            </div>
          </div>

          <div className={styles.eraText} data-era-text>
            <div className={styles.roman}>— Akt {era.romanNumeral} —</div>
            <span className={styles.yrChip}>{era.period}</span>
            <h2 className={styles.h2}>
              <InlineText value={era.heading} />
            </h2>
            <p className={styles.eraDeck}>{era.deck}</p>
            <PortableText value={era.body} className={styles.eraBody} />

            {era.cashnote ? (
              <div className={styles.cashnote}>
                <div className={styles.cashLabel}>{era.cashnote.label}</div>
                <h4>{era.cashnote.heading}</h4>
                <div className={styles.song}>
                  <InlineText value={era.cashnote.song} />
                </div>
                <PortableText value={era.cashnote.body} className={styles.cashBody} />
              </div>
            ) : null}

            {era.posts && era.posts.length > 0 ? (
              <div className={styles.posts}>
                {era.posts.map((post, i) => (
                  <a
                    className={[styles.post, post.empty ? styles.empty : null].filter(Boolean).join(' ')}
                    href={post.href ?? '#'}
                    key={i}
                  >
                    <div className={styles.pkind}>{post.kind}</div>
                    <div className={styles.ptitle}>{post.title}</div>
                    <div className={styles.pdate}>{post.date}</div>
                    <span className={styles.arrow}>→</span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function HistorienOutro({ outro }: { outro: NonNullable<Data['outro']> }) {
  return (
    <section className={styles.outro}>
      <div className="wrap">
        <div className={styles.outroGrid}>
          <div>
            <div className={styles.outroKicker}>{outro.kicker}</div>
            <h2 className={styles.outroHeading}>
              <InlineText value={outro.heading} />
            </h2>
            <PortableText value={outro.body} className={styles.outroBody} />
            {outro.actions && outro.actions.length > 0 ? (
              <div className={styles.actions}>
                {outro.actions.map((action, i) => (
                  <a
                    className={action.style === 'primary' ? styles.primary : styles.secondary}
                    href={action.href ?? undefined}
                    key={i}
                  >
                    {action.text}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <aside className={styles.card}>
            <h4>{outro.cardHeading}</h4>
            <ul>
              {(outro.cardItems ?? []).map((item, i) => (
                <li key={i}>
                  <span>
                    <InlineText value={item.text} />
                  </span>
                  <span className={styles.cardYr}>{item.year}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
