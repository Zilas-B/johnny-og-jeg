'use client'

import { useEffect, useState } from 'react'

import styles from './Kulturen.module.css'

export type SubnavItem = {
  slug: string
  romanNumeral: string | null
  shortName: string | null
}

// The only client leaf on the Kulturen page: a
// scroll-revealed sticky table of contents. Appears once the first `.land`
// section reaches the top of the viewport and highlights the active section.
export function KulturenSubnav({ items }: { items: SubnavItem[] }) {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.slug))
      .filter((el): el is HTMLElement => el !== null)

    function update() {
      const offset = 200
      let current: string | null = null
      for (const el of sections) {
        if (el.getBoundingClientRect().top - offset <= 0) current = el.id
      }
      setActive(current)
      const first = sections[0]
      setVisible(first ? first.getBoundingClientRect().top < 0 : false)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [items])

  return (
    <div
      className={`${styles.subnav} ${visible ? styles.visible : ''}`}
      aria-label="Landskaberne"
      data-kulturen-subnav
    >
      <div className={`wrap ${styles.subnavInner}`}>
        <div className={styles.label}>— Landskaberne —</div>
        <ol>
          {items.map((i) => (
            <li key={i.slug}>
              <a
                href={`#${i.slug}`}
                className={active === i.slug ? styles.active : undefined}
                data-kulturen-subnav-item
                aria-current={active === i.slug ? 'true' : undefined}
              >
                <span className={styles.rn}>{i.romanNumeral}</span>
                {i.shortName}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
