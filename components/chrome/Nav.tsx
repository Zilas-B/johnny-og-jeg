'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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

  return (
    <nav className={styles.primary} aria-label="Primær">
      <div className={styles.wrap}>
        <div className={styles.row}>
          {items.map((item) => {
            const active = isActive(pathname, item)
            const linkClass = active ? `${styles.link} ${styles.linkActive}` : styles.link

            if (item.children && item.children.length > 0) {
              return (
                <div key={item._key} className={styles.item}>
                  <button type="button" className={linkClass} aria-haspopup="true">
                    {item.label}
                    <span className={styles.caret} aria-hidden="true">▾</span>
                  </button>
                  <div className={styles.dropdown}>
                    {item.children.map((child) => (
                      <Link
                        key={child._key}
                        href={child.href ?? '#'}
                        className={styles.dropdownLink}
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
