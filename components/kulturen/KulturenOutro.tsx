import type { KULTUREN_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'

import styles from './Kulturen.module.css'

type Data = NonNullable<KULTUREN_QUERY_RESULT>
type Outro = NonNullable<Data['outro']>
type Landscape = Data['landscapes'][number]

export function KulturenOutro({
  outro,
  landscapes,
}: {
  outro: Outro
  landscapes: Landscape[]
}) {
  return (
    <section className={styles.outro}>
      <div className="wrap">
        <div className={styles.outroGrid}>
          <div>
            {outro.kicker ? <div className={styles.kicker}>{outro.kicker}</div> : null}
            <h2 className={styles.outroHeading}>
              <InlineText value={outro.heading} />
            </h2>
            <PortableText value={outro.body} className={styles.outroBody} />
            {outro.actions && outro.actions.length > 0 ? (
              <div className={styles.actions}>
                {outro.actions.map((action, i) => (
                  <a
                    key={i}
                    href={action.href ?? '#'}
                    className={action.style === 'secondary' ? styles.secondary : styles.primary}
                  >
                    {action.text}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <aside className={styles.outroCard}>
            {outro.cardLead ? <div className={styles.lead}>{outro.cardLead}</div> : null}
            {outro.cardHeading ? <h4>{outro.cardHeading}</h4> : null}
            <ul>
              {landscapes.map((l) => (
                <li key={l.slug}>
                  <span className={styles.rn}>{l.romanNumeral}</span>
                  <a href={`/${l.slug}`}>
                    <b>{l.shortName}</b>
                    {l.kulturenCardTag ? ` — ${l.kulturenCardTag}` : null}
                  </a>
                  <span className={styles.kind}>arkiv</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
