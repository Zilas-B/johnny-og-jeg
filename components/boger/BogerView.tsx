import { Fragment } from 'react'

import type { BOGER_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'
import { SanityImage } from '@/components/editorial/SanityImage'

import { AddCard } from './AddCard'
import styles from './Boger.module.css'
import { CategoryFilter } from './CategoryFilter'

type Data = NonNullable<BOGER_QUERY_RESULT>
type Book = NonNullable<Data['books']>[number]
type Empty = NonNullable<Data['spil']>

function Stars({ rating }: { rating?: number | null }) {
  const r = rating ?? 0
  return (
    <div className={styles.stars}>
      {'★'.repeat(r)}
      {r < 5 ? <span className={styles.dim}>{'★'.repeat(5 - r)}</span> : null}
    </div>
  )
}

function BookEntry({ book }: { book: Book }) {
  return (
    <article className={styles.entry} data-boger-entry>
      <div className={styles.coverCol}>
        <a
          className={styles.bookCover}
          href={book.buyHref ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
          data-boger-cover
        >
          <SanityImage image={book.coverImage} fill sizes="(max-width: 1024px) 60vw, 240px" />
          <div className={styles.frame} />
        </a>
        <a className={styles.saxoBtn} href={book.buyHref ?? '#'} target="_blank" rel="noopener noreferrer">
          <span className={styles.lhs}>
            <span className={styles.small}>Køb på</span>Saxo.dk
          </span>
          <span className={styles.arr}>→</span>
        </a>
        <div className={styles.coverMeta}>
          <Stars rating={book.rating} />
          <b>Læst:</b> {book.readWhen}
          <br />
          <b>Sider:</b> {book.pages}
          <br />
          <b>Originalsprog:</b> {book.language}
        </div>
      </div>

      <div className={styles.entryText}>
        <div className={styles.catTag}>
          {book.catTag} <span className={styles.star}>✶</span> {book.roman}
        </div>
        <h3>{book.title}</h3>
        <div className={styles.by}>
          af {book.author} <span className={styles.dot}>·</span> {book.year}
        </div>
        <div className={styles.metaRow}>
          {(book.metaRow ?? []).map((m, i) => (
            <div key={i}>
              {i === 0 ? <span className={styles.star}>✶</span> : null} <b>{m.label}:</b> {m.value}
            </div>
          ))}
        </div>
        <p className={styles.lead}>{book.lead}</p>
        <PortableText value={book.body} className={styles.body} />
        <div className={styles.verdict} data-boger-verdict>
          <div>
            <div className={styles.vlabel}>— Min dom —</div>
            <div className={styles.vline}>{book.verdictLine}</div>
          </div>
          <div className={styles.reco}>
            <span>{book.recoLabel}</span>
            {book.recoText}
          </div>
        </div>
        <div className={styles.tags}>
          {(book.tags ?? []).map((tag, i) => (
            <span className={styles.tag} key={i}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

function CategoryHeader({ title, count }: { title?: string | null; count: unknown }) {
  return (
    <div className={styles.catHeader}>
      <h2>{title}</h2>
      <div className={styles.cnt}>
        <InlineText value={count as never} />
      </div>
    </div>
  )
}

function EmptyCategory({ data }: { data: Empty }) {
  return (
    <>
      <CategoryHeader title={data.title} count={data.count} />
      <div className={styles.empty}>
        <div className={styles.glyph}>{data.glyph}</div>
        <h3>{data.heading}</h3>
        <p>{data.body}</p>
        <span className={styles.pending}>{data.pending}</span>
        <div className={styles.preview}>
          {data.previewLabel}
          <ul>
            {(data.preview ?? []).map((item, i) => (
              <li key={i}>
                <span className={styles.yr}>{item.yr}</span>
                <InlineText value={item.text as never} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export function BogerView({ data }: { data: Data }) {
  const { hero, filters, books, spil, film, invite } = data

  const booksBlock = (
    <>
      <CategoryHeader title={data.booksTitle} count={data.booksCount} />
      {(books ?? []).map((book, i) => (
        <BookEntry key={i} book={book} />
      ))}
    </>
  )

  return (
    <div>
      {/* HERO */}
      {hero ? (
        <section className={styles.lhero}>
          <div className="wrap">
            <div className={styles.lheroGrid} data-boger-hero-grid>
              <div>
                <div className={styles.eyebrow}>
                  <span className={styles.bar} />
                  {hero.eyebrow}
                </div>
                <h1 className={styles.h1}>
                  {hero.titleLead} <span className={styles.amp}>&amp;</span> {hero.titleTrail}
                </h1>
                <PortableText value={hero.deck} className={styles.deck} />
              </div>

              {hero.litmap ? (
                <figure className={styles.litmap}>
                  <div className={styles.litmapFrame}>
                    <SanityImage image={hero.litmap.image} width={640} sizes="(max-width: 1280px) 50vw, 600px" priority />
                  </div>
                  <figcaption>
                    <span className={styles.capTag}>{hero.litmap.capTag}</span>
                    <InlineText value={hero.litmap.caption} />
                  </figcaption>
                </figure>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* FILTER BAR + CATEGORIES */}
      {filters ? (
        <CategoryFilter
          lhs={<InlineText value={filters.lhs} />}
          rhs={filters.rhs}
          tabs={[
            { cat: 'alle', label: 'Alle', count: filters.alleCount },
            { cat: 'boger', label: 'Bøger', count: filters.bogerCount },
            { cat: 'spil', label: 'Spil', count: filters.spilCount },
            { cat: 'film', label: 'Film', count: filters.filmCount },
          ]}
          blocks={[
            { cat: 'boger', node: booksBlock },
            ...(spil ? [{ cat: 'spil', node: <EmptyCategory data={spil} /> }] : []),
            ...(film ? [{ cat: 'film', node: <EmptyCategory data={film} /> }] : []),
          ]}
        />
      ) : null}

      {/* INVITATION */}
      {invite ? (
        <section className={styles.invite}>
          <div className={`wrap ${styles.inviteGrid}`} data-boger-invite-grid>
            <div>
              <div className={styles.kicker}>{invite.kicker}</div>
              <h2>
                <InlineText value={invite.heading} />
              </h2>
              <PortableText value={invite.body} className={styles.inviteBody} />
              <div className={styles.actions}>
                {(invite.actions ?? []).map((action, i) => (
                  <a
                    className={action.style === 'primary' ? styles.primary : styles.secondary}
                    href={action.href ?? '#'}
                    key={i}
                  >
                    {action.text}
                  </a>
                ))}
              </div>
            </div>
            {invite.addCard ? (
              <AddCard
                label={invite.addCard.label ?? ''}
                heading={invite.addCard.heading ?? ''}
                body={invite.addCard.body ?? ''}
                placeholder={invite.addCard.placeholder ?? ''}
                small={invite.addCard.small ?? ''}
              />
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  )
}
