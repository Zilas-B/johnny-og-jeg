import styles from './MusicPlayer.module.css'

type Track = { n: string; title: string; year: string; album: string }

const TRACKS: Track[] = [
  { n: 'A1', title: 'Cry! Cry! Cry!', year: '1955', album: 'Sun' },
  { n: 'A2', title: 'I Walk the Line', year: '1956', album: 'Sun' },
  { n: 'A3', title: 'Big River', year: '1958', album: 'Columbia' },
  { n: 'A4', title: 'Ring of Fire', year: '1963', album: 'Ring of Fire' },
  { n: 'A5', title: 'A Boy Named Sue', year: '1969', album: 'At San Quentin' },
  { n: 'A6', title: 'Highwayman', year: '1985', album: 'Highwaymen' },
  { n: 'A7', title: 'The Man Comes Around', year: '2002', album: 'American IV' },
]

export function MusicPlayer() {
  return (
    <aside className={styles.cashRadio} aria-label="Cash Radio">
      <div className={styles.progress}>
        <div className={styles.bar} />
      </div>
      <button type="button" className={styles.radioTab} aria-label="Toggle player">
        <span className={styles.live} aria-hidden="true" />
        {' Cash Radio · Side A · Studiet '}
        <span className={styles.chev} aria-hidden="true">
          ▾
        </span>
      </button>
      <div className={styles.radioRail}>
        <div className={styles.vinylMini} aria-hidden="true" />
        <div className={styles.nowplay} aria-live="polite">
          <div className={styles.station}>— Side A · Studio Cuts —</div>
          <div className={styles.title}>Cry! Cry! Cry!</div>
          <div className={styles.meta}>
            <span>1955</span>
            <span className={styles.star}>✶</span>
            <span>Sun</span>
            <span className={styles.star}>✶</span>
            <span>Johnny Cash</span>
          </div>
        </div>
        <div className={styles.tracks}>
          {TRACKS.map((track, i) => (
            <div
              key={track.n}
              className={`${styles.trk}${i === 0 ? ` ${styles.active}` : ''}`}
            >
              <div className={styles.n}>{track.n}</div>
              <div className={styles.t}>{track.title}</div>
              <div className={styles.y}>
                {track.year} · {track.album}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.ctlBtn} ${styles.skip}`}
            aria-label="Forrige"
          >
            ⏮
          </button>
          <button
            type="button"
            className={`${styles.ctlBtn} ${styles.play}`}
            aria-label="Afspil"
          >
            ▶
          </button>
          <button
            type="button"
            className={`${styles.ctlBtn} ${styles.skip}`}
            aria-label="Næste"
          >
            ⏭
          </button>
          <div className={styles.listenOn}>
            <span className={styles.chip} title="Lyt på YouTube">
              YT
            </span>
            <span className={styles.chip} title="Lyt på Spotify">
              SP
            </span>
            <span className={styles.chip} title="Læs på Wikipedia">
              WK
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
