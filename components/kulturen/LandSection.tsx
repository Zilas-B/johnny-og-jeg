import type { CSSProperties } from 'react'

import type { KULTUREN_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'

import styles from './Kulturen.module.css'

type Landscape = NonNullable<KULTUREN_QUERY_RESULT>['landscapes'][number]
type SidebarBox = NonNullable<Landscape['kulturenSidebar']>[number]

// Per-variant accent: dark sections swap barn → brass (matching the template's
// `.land.dark` rules), driven through --accent / --accent-deep so every accent
// element (rn, eyebrow, name em, dropcap, pull, labels, years) follows.
const ACCENT: Record<string, { accent: string; deep: string }> = {
  paper: { accent: 'var(--barn)', deep: 'var(--barn-deep)' },
  'paper-2': { accent: 'var(--barn)', deep: 'var(--barn-deep)' },
  dark: { accent: 'var(--brass)', deep: 'var(--brass)' },
}

export function LandSection({ data, isLast }: { data: Landscape; isLast: boolean }) {
  const variant = data.kulturenBgVariant ?? 'paper'
  const accent = ACCENT[variant] ?? ACCENT.paper
  const style = { '--accent': accent.accent, '--accent-deep': accent.deep } as CSSProperties

  const sectionClass = [
    styles.land,
    variant === 'paper-2' ? styles.paper2 : null,
    variant === 'dark' ? styles.dark : null,
  ]
    .filter(Boolean)
    .join(' ')

  const sidebar = data.kulturenSidebar ?? []
  const ctaText = data.kulturenArchiveCta ?? `Til ${data.shortName}-arkivet →`
  const tail = isLast ? 'Otte landskaber, én republik' : `Slut på Landskab ${data.romanNumeral}`

  return (
    <section className={sectionClass} id={data.slug ?? undefined} style={style}>
      <div className="wrap">
        <div className={styles.landHead}>
          <div className={styles.landRn}>{data.romanNumeral}</div>
          <div className={styles.landTitles}>
            <div className={styles.landEyebrow}>
              Landskab {data.romanNumeral}
              <span className={styles.sep}>·</span>
              {data.toponym}
              <span className={styles.sep}>·</span>
              {data.period}
            </div>
            <h2 className={styles.landName}>
              <InlineText value={data.name} />
            </h2>
            {data.motto ? <p className={styles.landMotto}>{data.motto}</p> : null}
          </div>
        </div>

        <div className={styles.landBody}>
          <div className={styles.essay}>
            <PortableText value={data.kulturenEssay} withDropCap />
          </div>

          <aside className={styles.side}>
            {sidebar.map((box: SidebarBox) =>
              box._type === 'kulturenTimeline' ? (
                <div className={styles.lside} key={box._key}>
                  <div className={styles.lab}>{box.label}</div>
                  <ul className={styles.timeline}>
                    {(box.entries ?? []).map((entry) => (
                      <li key={entry._key}>
                        <span className={styles.yr}>{entry.year}</span>
                        <span>
                          <InlineText value={entry.text} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div
                  className={`${styles.lside} ${box.emphasis === 'cash' ? styles.cash : ''}`}
                  key={box._key}
                >
                  <div className={styles.lab}>{box.label}</div>
                  <div className={styles.val}>
                    <PortableText value={box.value} />
                  </div>
                </div>
              ),
            )}
            <div className={`${styles.lside} ${styles.deepLink}`}>
              <a href={`/${data.slug}`}>
                <span className={styles.sm}>— Læs mere —</span>
                {ctaText}
              </a>
            </div>
          </aside>
        </div>

        <div className={styles.landTail}>
          <span className={styles.st}>✶</span> {tail} <span className={styles.st}>✶</span>
        </div>
      </div>
    </section>
  )
}
