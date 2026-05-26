import Link from 'next/link'

import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.colophon}>
      <div className="wrap">
        <div className={styles.grid}>
          <div>
            <div className={styles.mark}>
              Johnny <span className={styles.amp}>&amp;</span> jeg
            </div>
            <p className={styles.blurb}>
              En personlig hyldest til Johnny Cash, til kristendommen i hans liv,
              og til det Amerika, der formede ham. Drevet af én lytter i Aarhus.
            </p>
            <p className={`${styles.blurb} ${styles.blurbQuote}`}>
              “I wear the black for the poor and the beaten down, livin’ in the
              hopeless, hungry side of town.” — JR Cash
            </p>
          </div>

          <div>
            <h5 className={styles.heading}>Johnny Cash</h5>
            <ul className={styles.list}>
              <li><Link href="/portraet" className={styles.link}>Portræt</Link></li>
              <li><Link href="/musikeren" className={styles.link}>Musikeren</Link></li>
              <li><Link href="/cash-og-jesus" className={styles.link}>Cash og Jesus</Link></li>
              <li><Link href="/cash-og-amerika" className={styles.link}>Cash og Amerika</Link></li>
            </ul>
          </div>

          <div>
            <h5 className={styles.heading}>USA</h5>
            <ul className={styles.list}>
              <li><Link href="/historien" className={styles.link}>Historien</Link></li>
              <li><Link href="/kulturen" className={styles.link}>Kulturen</Link></li>
              <li><Link href="/boeger-spil-film" className={styles.link}>Bøger, spil, film</Link></li>
            </ul>
          </div>

          <div>
            <h5 className={styles.heading}>Sidens hjørne</h5>
            <ul className={styles.list}>
              <li><Link href="/foredrag" className={styles.link}>Foredrag</Link></li>
              <li><Link href="/om-siden" className={styles.link}>Om siden</Link></li>
              <li><Link href="/kontakt" className={styles.link}>Kontakt</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <div>
            © MMXXVI · Johnny &amp; jeg <span className={styles.star}>✶</span> Aarhus · Danmark
          </div>
          <div>
            Et privat, ikke-kommercielt arkiv{' '}
            <span className={styles.star}>✶</span> Set fra denne side af Atlanten
          </div>
        </div>
      </div>
    </footer>
  )
}
