import Link from 'next/link'

import type { HOME_PAGE_QUERY_RESULT } from '@/sanity/types'

import { PortableText } from '@/components/editorial/PortableText'

import styles from './VinylTile.module.css'

type HomeBlock = NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>['blocks']>[number]
type VinylsSection = Extract<HomeBlock, { _type: 'hubVinyls' }>
type Vinyl = NonNullable<VinylsSection['items']>[number]

export function VinylTile({ vinyl }: { vinyl: Vinyl }) {
  const accent = vinyl.vinylAccent ?? 'barn'
  return (
    <Link
      href={vinyl.linkHref ?? '#'}
      className={styles.tile}
      data-accent={accent}
    >
      <div className={styles.cornerNum}>{vinyl.cornerNumber}</div>
      <div className={styles.cornerTag}>{vinyl.cornerTag}</div>

      <div className={styles.stage}>
        <div className={styles.sleeve}>
          <div className={styles.sleeveText}>{vinyl.sleeveText}</div>
        </div>
        <div className={styles.vinyl}>
          <div className={styles.label}>
            <div className={styles.lblTop}>{vinyl.vinylTopLabel}</div>
            <div className={styles.lblTitle}>{vinyl.vinylTitle}</div>
            <div className={styles.lblBot}>{vinyl.vinylBottomLabel}</div>
          </div>
        </div>
      </div>

      <h3 className={styles.heading}>{vinyl.heading}</h3>
      <div className={styles.subhead}>{vinyl.subhead}</div>
      <div className={styles.body}>
        <PortableText value={vinyl.body} />
      </div>

      <div className={styles.tracklist}>
        {vinyl.tracklist?.map((t, i) => (
          <div key={i} className={styles.trackRow}>
            <span className={styles.trackN}>{t.track}</span>
            <span className={styles.trackT}>{t.title}</span>
            <span className={styles.trackD}>{t.duration}</span>
          </div>
        ))}
      </div>

      <span className={styles.more}>
        {vinyl.linkText} <span className={styles.arrow}>→</span>
      </span>
    </Link>
  )
}
