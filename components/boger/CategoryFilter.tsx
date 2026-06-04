'use client'

import { type ReactNode, useState } from 'react'

import styles from './Boger.module.css'

// The category filter bar (§3 rule 4: the only interactive leaf here). It toggles
// visibility of the server-rendered category blocks passed in as `blocks`. Heavy
// rendering (book reviews, images) stays on the server; this client component
// only flips a `hidden` class — a faithful React rewrite of the template's
// vanilla-JS handler.
type Tab = { cat: string; label: string; count?: string | null }
type Block = { cat: string; node: ReactNode }

export function CategoryFilter({
  lhs,
  rhs,
  tabs,
  blocks,
}: {
  lhs: ReactNode
  rhs: ReactNode
  tabs: Tab[]
  blocks: Block[]
}) {
  const [active, setActive] = useState('alle')

  return (
    <>
      <div className={styles.indexBar}>
        <div className={`wrap ${styles.indexGrid}`}>
          <div className={styles.lhs}>{lhs}</div>
          <div className={styles.filters} role="tablist">
            {tabs.map((t) => (
              <button
                key={t.cat}
                type="button"
                className={`${styles.filter} ${active === t.cat ? styles.active : ''}`}
                onClick={() => setActive(t.cat)}
              >
                {t.label}
                {t.count ? <span className={styles.count}>{t.count}</span> : null}
              </button>
            ))}
          </div>
          <div className={styles.rhs}>{rhs}</div>
        </div>
      </div>

      <section className={styles.entries}>
        <div className="wrap">
          {blocks.map((b) => {
            const hidden = active !== 'alle' && active !== b.cat
            return (
              <div key={b.cat} className={`${styles.catBlock} ${hidden ? styles.hidden : ''}`}>
                {b.node}
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
