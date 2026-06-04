import { Fragment } from 'react'
import Link from 'next/link'

import type { SITE_SETTINGS_QUERY_RESULT } from '@/sanity/types'

import styles from './Footer.module.css'

type Settings = NonNullable<SITE_SETTINGS_QUERY_RESULT>

type FooterData = {
  footerMark: NonNullable<Settings['footerMark']>
  footerBlurb: NonNullable<Settings['footerBlurb']>
  footerQuote: NonNullable<Settings['footerQuote']>
  footerColumns: NonNullable<Settings['footerColumns']>
  footerBottomCopyright: NonNullable<Settings['footerBottomCopyright']>
  footerBottomTagline: NonNullable<Settings['footerBottomTagline']>
}

function wrapDelimiter(text: string, delimiter: string, className: string) {
  const parts = text.split(delimiter)
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && <span className={className}>{delimiter}</span>}
    </Fragment>
  ))
}

export function Footer({ data }: { data: FooterData }) {
  return (
    <footer className={styles.colophon}>
      <div className="wrap">
        <div className={styles.grid}>
          <div>
            <div className={styles.mark}>
              {wrapDelimiter(data.footerMark, '&', styles.amp)}
            </div>
            <p className={styles.blurb}>{data.footerBlurb}</p>
            <p className={`${styles.blurb} ${styles.blurbQuote}`}>
              “{data.footerQuote.text}” — {data.footerQuote.attribution}
            </p>
          </div>

          {data.footerColumns.map((column) => (
            <div key={column._key}>
              <h2 className={styles.heading}>{column.title}</h2>
              <ul className={styles.list}>
                {column.links?.map((link) => (
                  <li key={link._key}>
                    <Link href={link.href ?? '#'} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <div>{wrapDelimiter(data.footerBottomCopyright, '✶', styles.star)}</div>
          <div>{wrapDelimiter(data.footerBottomTagline, '✶', styles.star)}</div>
        </div>
      </div>
    </footer>
  )
}
