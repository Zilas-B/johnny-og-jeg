'use client'

import { useState } from 'react'

import styles from './Foredrag.module.css'

// The booking form is a visual shell (TechStack: forms are out of scope; a real
// backend — Resend/Formspree — is a later decision). It validates required
// fields client-side and shows a success note on submit; nothing is sent. The
// field labels/placeholders are functional UI and live here, not in Sanity; the
// surrounding editorial copy (title, stamp, postmark, success text) is authored.
type Props = {
  title: string
  stamp: string
  postmark: string
  success: string
}

// Program options mirror the three posters plus two catch-alls (1:1 with the
// template's <select>).
const PROGRAMS = [
  'I · Manden i sort (musikeren)',
  'II · Cash & Jesus (troen)',
  'III · Cash & den ragged old flag (Amerika)',
  'Sammensæt på tværs / kortere serie',
  'Endnu ikke besluttet — rådgiv mig',
]

export function BookingForm({ title, stamp, postmark, success }: Props) {
  const [sent, setSent] = useState(false)

  return (
    <form
      className={styles.bform}
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
        e.currentTarget.reset()
      }}
    >
      <div className={styles.formHead}>
        <h3>{title}</h3>
        <div className={styles.formStamp}>{stamp}</div>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="b-navn">Navn</label>
          <input id="b-navn" type="text" required placeholder="Dit navn" />
        </div>
        <div className={styles.field}>
          <label htmlFor="b-org">Organisation</label>
          <input id="b-org" type="text" placeholder="Menighed, skole, forening …" />
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="b-email">E-mail</label>
          <input id="b-email" type="email" required placeholder="dig@eksempel.dk" />
        </div>
        <div className={styles.field}>
          <label htmlFor="b-tel">Telefon (valgfri)</label>
          <input id="b-tel" type="tel" placeholder="+45 …" />
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="b-prog">Ønsket program</label>
          <select id="b-prog" defaultValue={PROGRAMS[0]}>
            {PROGRAMS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="b-dato">Ønsket dato</label>
          <input id="b-dato" type="text" placeholder="F.eks. lørdag, 14. nov. 2026" />
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="b-sted">Sted</label>
          <input id="b-sted" type="text" placeholder="By & lokale" />
        </div>
        <div className={styles.field}>
          <label htmlFor="b-antal">Antal gæster (omtrent)</label>
          <input id="b-antal" type="text" placeholder="F.eks. 60–80" />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="b-besked">Besked</label>
        <textarea
          id="b-besked"
          placeholder="Fortæl gerne lidt om aftenen — anledning, format, hvad der har fået jer til at tænke på Cash …"
        />
      </div>

      <div className={styles.submitRow}>
        <div className={styles.small}>
          Postlagt fra: <b>{postmark}</b>
        </div>
        <button className={styles.send} type="submit">
          Send anmodning →
        </button>
      </div>

      {sent ? <div className={styles.formSuccess}>{success}</div> : null}
    </form>
  )
}
