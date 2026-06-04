import type { HOME_PAGE_QUERY_RESULT } from '@/sanity/types'

import { PortableText } from '@/components/editorial/PortableText'

import styles from './ContactSection.module.css'

type HomeBlock = NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>['blocks']>[number]
type Data = Extract<HomeBlock, { _type: 'contact' }>

export function ContactSection({ data }: { data: Data }) {
  return (
    <section className={styles.contact} id="kontakt">
      <div className="wrap">
        <div className={styles.grid}>
          <div>
            <div className={styles.kicker}>{data.kicker}</div>
            <h2 className={styles.heading}>{data.heading}</h2>
            <div className={styles.deck}>
              <PortableText value={data.deck} />
            </div>

            <div className={styles.booking} id="foredrag">
              <div className={styles.bookingLabel}>{data.bookingLabel}</div>
              <h3 className={styles.bookingHeading}>{data.bookingHeading}</h3>
              <p className={styles.bookingBody}>{data.bookingBody}</p>
              {data.bookingLinkHref ? (
                <a href={data.bookingLinkHref} className={styles.bookingBtn}>
                  {data.bookingLinkText} <span aria-hidden="true">→</span>
                </a>
              ) : null}
            </div>
          </div>

          {/* Presentational only — submission wiring is a future step. */}
          <form className={styles.form} action="#" method="get">
            <div className={styles.formHead}>
              <div>
                <h3>Kontaktformular</h3>
                <div className={styles.formStamp}>No. 0014 / MMXXVI</div>
              </div>
              <div className={styles.formFlag} role="img" aria-label="Painted stars and stripes" />
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label htmlFor="navn">Navn</label>
                <input id="navn" name="navn" type="text" placeholder="Dit fulde navn" />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">E-mail</label>
                <input id="email" name="email" type="email" placeholder="dig@eksempel.dk" />
              </div>
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label htmlFor="emne">Emne</label>
                <select id="emne" name="emne" defaultValue="Generel henvendelse">
                  <option>Generel henvendelse</option>
                  <option>Forespørgsel om foredrag</option>
                  <option>Rettelse / kommentar til indhold</option>
                  <option>Anbefaling af bog, film eller plade</option>
                  <option>Andet</option>
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="org">Organisation (valgfri)</label>
                <input id="org" name="org" type="text" placeholder="Menighed, skole, forening …" />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="besked">Besked</label>
              <textarea id="besked" name="besked" placeholder="Skriv din besked her …" />
            </div>

            <div className={styles.submitRow}>
              <div className={styles.submitSmall}>
                Postlagt fra: <b style={{ color: 'var(--ink)' }}>Aarhus, DK</b>
              </div>
              <button className={styles.send} type="submit">
                Send →
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
