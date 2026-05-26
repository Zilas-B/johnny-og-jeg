import Link from 'next/link'

import styles from './Masthead.module.css'

export function Masthead() {
  return (
    <header className={styles.masthead}>
      <div className="wrap">
        <div className={styles.mastGrid}>
          <div className={styles.mastSide}>
            Vol. II &nbsp;·&nbsp; Nr. 14<br />
            Forår <b>MMXXVI</b>
          </div>
          <div className={styles.wordmark}>
            <Link href="/" className={styles.nameLink}>
              <div className={styles.kicker}>— en personlig hyldest —</div>
              <div className={styles.name}>Johnny &amp; jeg</div>
              <div className={styles.sub}>Musikken · Troen · Amerika</div>
            </Link>
          </div>
          <div className={`${styles.mastSide} ${styles.mastSideRight}`}>
            Aarhus, Danmark<br />
            <b>Anno MMXXVI</b>
          </div>
        </div>
      </div>
    </header>
  )
}
