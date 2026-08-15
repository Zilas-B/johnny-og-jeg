'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { SITE_SETTINGS_QUERY_RESULT } from '@/sanity/types'

import styles from './Nav.module.css'

type Settings = NonNullable<SITE_SETTINGS_QUERY_RESULT>
type NavItems = NonNullable<Settings['nav']>
type NavItem = NavItems[number]
type CtaData = NonNullable<Settings['cta']>

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href) {
    return item.href === '/' ? pathname === '/' : pathname === item.href
  }
  return Boolean(item.children?.some((child) => pathname === child.href))
}

export function Nav({ items, cta }: { items: NavItems; cta: CtaData }) {
  const pathname = usePathname() ?? '/'
  // Single-open dropdown keyed by nav item; null = all closed. Hover still
  // opens dropdowns via CSS for pointer users; this drives click/keyboard.
  const [openKey, setOpenKey] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  // Close on Escape (refocus the trigger) and on click/focus outside the nav —
  // listeners mounted only while a dropdown is open. Mirrors the KulturenSubnav
  // client-leaf pattern.
  useEffect(() => {
    if (!openKey) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        const key = openKey
        setOpenKey(null)
        if (key) triggerRefs.current[key]?.focus()
      }
    }
    function onOutside(e: Event) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenKey(null)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onOutside)
    document.addEventListener('focusin', onOutside)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onOutside)
      document.removeEventListener('focusin', onOutside)
    }
  }, [openKey])

  return (
    <nav ref={navRef} className={styles.primary} aria-label="Primær">
      <div className={styles.wrap}>
        <div className={styles.row}>
          {items.map((item) => {
            const active = isActive(pathname, item)
            const linkClass = active ? `${styles.link} ${styles.linkActive}` : styles.link

            if (item.children && item.children.length > 0) {
              const open = openKey === item._key
              const panelId = `nav-dropdown-${item._key}`
              return (
                <div
                  key={item._key}
                  className={`${styles.item}${open ? ` ${styles.itemOpen}` : ''}`}
                >
                  <button
                    type="button"
                    ref={(el) => {
                      triggerRefs.current[item._key] = el
                    }}
                    className={linkClass}
                    aria-haspopup="true"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenKey(open ? null : item._key)}
                  >
                    {item.label}
                    <span className={styles.caret} aria-hidden="true">▾</span>
                  </button>
                  <div id={panelId} className={styles.dropdown}>
                    {item.children.map((child) => (
                      <Link
                        key={child._key}
                        href={child.href ?? '#'}
                        className={styles.dropdownLink}
                        onClick={() => setOpenKey(null)}
                      >
                        {child.mark && <span className={styles.num}>{child.mark}</span>}
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }

            return (
              <div key={item._key} className={styles.item}>
                <Link href={item.href ?? '#'} className={linkClass}>
                  {item.label}
                </Link>
              </div>
            )
          })}

          {cta.href && cta.label && (
            <div className={styles.cta}>
              <Link href={cta.href} className={styles.ctaLink}>
                {cta.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
