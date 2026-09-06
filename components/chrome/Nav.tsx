'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { SITE_SETTINGS_QUERY_RESULT } from '@/sanity/types'

import styles from './Nav.module.css'

type Settings = NonNullable<SITE_SETTINGS_QUERY_RESULT>
type NavItems = NonNullable<Settings['nav']>
type NavItem = NavItems[number]
type CtaData = NonNullable<Settings['cta']>

const DRAWER_ID = 'nav-drawer'
// The same `max-width: 768px` step Nav.module.css switches on — see
// docs/TechStack.md, Responsive conventions. Above it the drawer cannot be
// opened, so a resize past it must close one that is already open.
const DRAWER_QUERY = '(max-width: 768px)'
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

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
  // Nav Drawer: the full-screen overlay below the breakpoint. A second piece
  // of state alongside the dropdowns, not a replacement for them.
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    menuButtonRef.current?.focus()
  }, [])

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

  // Drawer: lock background scroll, move focus in, keep Tab inside, close on
  // Escape. Everything is torn down when the drawer closes, so nothing here
  // costs anything on wide screens.
  useEffect(() => {
    if (!drawerOpen) return
    const root = drawerRef.current
    if (!root) return

    // `html`, not `body` — an overflow on body only reaches the viewport when
    // html's own overflow is visible, which no rule here guarantees.
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    const focusable = () => Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))
    focusable()[0]?.focus()

    // An arrow const, not a declaration: TypeScript keeps `root` narrowed to
    // non-null inside it.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeDrawer()
        return
      }
      if (e.key !== 'Tab') return
      const nodes = focusable()
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement
      const outside = !root.contains(active)
      if (e.shiftKey ? active === first || outside : active === last || outside) {
        e.preventDefault()
        ;(e.shiftKey ? last : first).focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.documentElement.style.overflow = previousOverflow
    }
  }, [drawerOpen, closeDrawer])

  // Resizing above the breakpoint hides the drawer in CSS; drop the state too,
  // so scroll lock and focus trap don't outlive what they belong to.
  useEffect(() => {
    if (!drawerOpen) return
    const mq = window.matchMedia(DRAWER_QUERY)
    function onChange() {
      if (!mq.matches) setDrawerOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [drawerOpen])

  // Following a link inside the drawer closes it; the destination page is
  // what the reader asked for, not the menu they left open behind it.
  const closeOnNavigate = () => setDrawerOpen(false)

  function drawerLinkProps(href: string) {
    const active = pathname === href
    return {
      className: active ? `${styles.drawerLink} ${styles.drawerLinkActive}` : styles.drawerLink,
      'aria-current': active ? ('page' as const) : undefined,
      onClick: closeOnNavigate,
    }
  }

  return (
    <nav ref={navRef} className={styles.primary} aria-label="Primær">
      <div className={styles.wrap}>
        <div className={styles.row}>
          <button
            type="button"
            ref={menuButtonRef}
            className={styles.menuButton}
            aria-expanded={drawerOpen}
            aria-controls={DRAWER_ID}
            onClick={() => (drawerOpen ? closeDrawer() : setDrawerOpen(true))}
          >
            <span className={styles.menuIcon} aria-hidden="true" />
            Menu
          </button>

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
                        aria-current={pathname === child.href ? 'page' : undefined}
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
                <Link
                  href={item.href ?? '#'}
                  className={linkClass}
                  aria-current={active ? 'page' : undefined}
                >
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

      {/* Nav Drawer — the whole tree at once, children indented under their
          parent. Rendered only while open: closed, it is not in the DOM, so
          nothing in it is tabbable or duplicated for assistive tech. */}
      {drawerOpen && (
        <div
          id={DRAWER_ID}
          ref={drawerRef}
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className={styles.drawerHead}>
            <span className={styles.drawerTitle}>Menu</span>
            <button type="button" className={styles.drawerClose} onClick={closeDrawer}>
              Luk
              <span className={styles.closeMark} aria-hidden="true">✕</span>
            </button>
          </div>

          <ul className={styles.drawerList}>
            {items.map((item) => (
              <li key={item._key}>
                {item.href ? (
                  <Link href={item.href} {...drawerLinkProps(item.href)}>
                    {item.label}
                  </Link>
                ) : (
                  // A parent group is a label, not a link — but it marks the
                  // active section exactly as the tab row does, through the
                  // same `isActive`.
                  <span
                    className={
                      isActive(pathname, item)
                        ? `${styles.drawerGroup} ${styles.drawerGroupActive}`
                        : styles.drawerGroup
                    }
                  >
                    {item.label}
                  </span>
                )}
                {item.children && item.children.length > 0 && (
                  <ul className={styles.drawerChildren}>
                    {item.children.map((child) => (
                      <li key={child._key}>
                        <Link href={child.href ?? '#'} {...drawerLinkProps(child.href ?? '#')}>
                          {child.mark && <span className={styles.num}>{child.mark}</span>}
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {cta.href && cta.label && (
            <Link
              href={cta.href}
              className={styles.drawerCta}
              onClick={closeOnNavigate}
            >
              {cta.label}
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
