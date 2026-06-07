import type { Metadata } from 'next'
import Link from 'next/link'

import styles from './not-found.module.css'

// Styled 404 (production-launch.md Phase 2). Rendered inside app/(site)/layout.tsx,
// so it carries masthead + nav + footer + music player. Catches notFound() thrown
// from a bad [slug] (the common case); deep unmatched paths fall through to Next's
// generic 404 — accepted (production-launch.md "generic fallback otherwise").
//
// No design template exists for this page (it was removed once all pages shipped),
// so the layout is designed minimally from the editorial token system.

export const metadata: Metadata = {
  title: 'Siden findes ikke',
}

export default function NotFound() {
  return (
    <section className={styles.notFound}>
      <div className="wrap">
        <div className={styles.kicker}>Fejl 404</div>
        <div className={styles.code} aria-hidden="true">
          404
        </div>
        <h1 className={styles.heading}>Siden findes ikke</h1>
        <p className={styles.body}>
          Siden, du leder efter, er flyttet, fjernet eller har aldrig eksisteret.
          Find vej tilbage til forsiden, eller brug menuen foroven.
        </p>
        <Link className={styles.home} href="/">
          Tilbage til forsiden <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
