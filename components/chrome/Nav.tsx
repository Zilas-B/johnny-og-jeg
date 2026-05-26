'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import styles from './Nav.module.css'

type NavChild = { mark: string; label: string; href: string }
type NavItem = {
  label: string
  href?: string
  children?: NavChild[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Hjem', href: '/' },
  {
    label: 'Johnny Cash',
    children: [
      { mark: '○', label: 'Portræt', href: '/portraet' },
      { mark: 'I', label: 'Musikeren', href: '/musikeren' },
      { mark: 'II', label: 'Cash og Jesus', href: '/cash-og-jesus' },
      { mark: 'III', label: 'Cash og Amerika', href: '/cash-og-amerika' },
    ],
  },
  {
    label: 'USA',
    children: [
      { mark: 'A', label: 'Historien', href: '/historien' },
      { mark: 'B', label: 'Kulturen', href: '/kulturen' },
    ],
  },
  { label: 'Bøger, spil, film', href: '/boeger-spil-film' },
  { label: 'Foredrag', href: '/foredrag' },
  { label: 'Om siden', href: '/om-siden' },
  { label: 'Kontakt', href: '/kontakt' },
]

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href) {
    return item.href === '/' ? pathname === '/' : pathname === item.href
  }
  return Boolean(item.children?.some((child) => pathname === child.href))
}

export function Nav() {
  const pathname = usePathname() ?? '/'

  return (
    <nav className={styles.primary} aria-label="Primær">
      <div className={styles.wrap}>
        <div className={styles.row}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item)
            const linkClass = active ? `${styles.link} ${styles.linkActive}` : styles.link

            if (item.children) {
              return (
                <div key={item.label} className={styles.item}>
                  <button type="button" className={linkClass} aria-haspopup="true">
                    {item.label}
                    <span className={styles.caret} aria-hidden="true">▾</span>
                  </button>
                  <div className={styles.dropdown}>
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className={styles.dropdownLink}>
                        <span className={styles.num}>{child.mark}</span>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }

            return (
              <div key={item.label} className={styles.item}>
                <Link href={item.href ?? '#'} className={linkClass}>
                  {item.label}
                </Link>
              </div>
            )
          })}

          <div className={styles.cta}>
            <Link href="/foredrag" className={styles.ctaLink}>
              Bestil foredrag →
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
