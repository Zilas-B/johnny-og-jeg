import { Fragment } from 'react'

import type { FOREDRAG_QUERY_RESULT } from '@/sanity/types'

import { InlineText } from '@/components/editorial/InlineText'
import { PortableText } from '@/components/editorial/PortableText'

import { BookingForm } from './BookingForm'
import styles from './Foredrag.module.css'

type Data = NonNullable<FOREDRAG_QUERY_RESULT>

// Render a plain string containing newlines as <br>-separated lines.
function Lines({ text }: { text?: string | null }) {
  const parts = (text ?? '').split('\n')
  return (
    <>
      {parts.map((line, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </>
  )
}

type Head = { kicker?: string | null; heading?: unknown; deck?: unknown }

function SectionHead({ head, ornament, flush }: { head: Head; ornament?: boolean; flush?: boolean }) {
  return (
    <div className={styles.sectHead} style={flush ? { marginTop: 0 } : undefined}>
      <div className={styles.kicker}>{head.kicker}</div>
      <h2>
        <InlineText value={head.heading as never} />
      </h2>
      {head.deck ? <PortableText value={head.deck as never} className={styles.sdeck} /> : null}
      {ornament ? (
        <div className={styles.ornament}>
          <span>✶</span>
        </div>
      ) : null}
    </div>
  )
}

export function ForedragView({ data }: { data: Data }) {
  const { hero, programsHead, programs, practical, venuesHead, venues, testimonial, booking, faqHead, faq } =
    data

  return (
    <div>
      {/* HERO */}
      {hero ? (
        <section className={styles.fhero}>
          <div className="wrap">
            <div className={styles.fheroGrid}>
              <div>
                <div className={styles.eyebrow}>
                  <span className={styles.bar} />
                  {hero.eyebrow}
                </div>
                <h1 className={styles.h1}>
                  {hero.title}
                  <span className={styles.h1Small}>{hero.titleSmall}</span>
                </h1>
                <PortableText value={hero.deck} className={styles.deck} />
                <div className={styles.metaStack}>
                  {(hero.metaCells ?? []).map((cell, i) => (
                    <div className={styles.metaCell} key={i}>
                      <div className={styles.k}>{cell.k}</div>
                      <div className={styles.v}>{cell.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {hero.ticket ? (
                <aside className={styles.ticket}>
                  <div className={styles.stamp}>
                    {hero.ticket.stampTop}
                    <b>{hero.ticket.stampBig}</b>
                    {hero.ticket.stampBottom}
                  </div>
                  <div className={styles.ticketHead}>
                    <div className={styles.lhs}>
                      <Lines text={hero.ticket.headLhs} />
                    </div>
                    <div className={styles.num}>{hero.ticket.headNum}</div>
                  </div>
                  <h3>
                    <Lines text={hero.ticket.heading} />
                  </h3>
                  <ul className={styles.ticketLines}>
                    {(hero.ticket.lines ?? []).map((line, i) => (
                      <li key={i}>
                        <span>{line.label}</span>
                        <b>{line.value}</b>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.priceRow}>
                    <div className={styles.label}>{hero.ticket.priceLabel}</div>
                    <div className={styles.price}>
                      {hero.ticket.price} <small>{hero.ticket.priceUnit}</small>
                    </div>
                  </div>
                  <a className={styles.ticketCta} href={hero.ticket.ctaHref ?? '#book'}>
                    {hero.ticket.ctaText}
                  </a>
                </aside>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* PROGRAMS */}
      <div className="wrap">
        {programsHead ? <SectionHead head={programsHead} ornament /> : null}
        <div className={styles.posters}>
          {(programs ?? []).map((p, i) => (
            <article className={styles.poster} key={i}>
              <div className={styles.posterTop}>
                <span>{p.side}</span>
                <span className={styles.roman}>{p.roman}</span>
                <span>{p.theme}</span>
              </div>
              <div className={styles.posterBody}>
                <h3>
                  <InlineText value={p.heading} />
                </h3>
                <div className={styles.sub}>{p.sub}</div>
                <p>{p.body}</p>
                <ol className={styles.arc}>
                  {(p.arc ?? []).map((item, j) => (
                    <li key={j}>
                      <span className={styles.n}>{j + 1}.</span>
                      <span className={styles.t}>{item}</span>
                    </li>
                  ))}
                </ol>
                <div className={styles.metaRow}>
                  <div className={styles.cell}>
                    <div className={styles.k}>Varighed</div>
                    <div className={styles.v}>{p.duration}</div>
                  </div>
                  <div className={styles.cell}>
                    <div className={styles.k}>Bedst til</div>
                    <div className={styles.v}>{p.bestFor}</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* PRACTICAL */}
      {practical ? (
        <section className={styles.practical}>
          <div className="wrap">
            <div className={styles.practicalHead}>
              <div>
                <div className={styles.kicker}>{practical.kicker}</div>
                <h2>
                  <InlineText value={practical.heading} />
                </h2>
              </div>
              <p>{practical.intro}</p>
            </div>
            <div className={styles.pgrid}>
              {(practical.cells ?? []).map((cell, i) => (
                <div className={styles.pcell} key={i}>
                  <div className={styles.k}>{cell.k}</div>
                  <div className={styles.label}>{cell.label}</div>
                  <h4>{cell.heading}</h4>
                  <p>{cell.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* VENUES + TESTIMONIAL */}
      <section className={styles.venues}>
        <div className="wrap">
          {venuesHead ? <SectionHead head={venuesHead} ornament flush /> : null}
          <div className={styles.venuesGrid}>
            <ul className={styles.venuesList}>
              {(venues ?? []).map((v, i) => (
                <li key={i}>
                  <span className={styles.yr}>{v.yr}</span>
                  <span className={styles.place}>{v.place}</span>
                  <span className={styles.city}>{v.city}</span>
                </li>
              ))}
            </ul>
            {testimonial ? (
              <div>
                <div className={styles.testimonial}>
                  <blockquote>{testimonial.quote}</blockquote>
                  <div className={styles.attrib}>
                    <b>{testimonial.attribName}</b>
                    <span className={styles.star}>✶</span> {testimonial.attribPlace}
                    <span className={styles.star}>✶</span> {testimonial.attribWhen}
                  </div>
                </div>
                <div className={styles.also}>
                  {testimonial.alsoLabel}
                  <br />
                  {(testimonial.alsoOrgs ?? []).map((org, i) => (
                    <Fragment key={i}>
                      {i > 0 ? ' · ' : null}
                      <b>{org}</b>
                    </Fragment>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* BOOKING */}
      {booking ? (
        <section className={styles.bookingBlock} id="book">
          <div className="wrap">
            <div className={styles.bookingGrid}>
              <div>
                <div className={styles.kicker}>{booking.kicker}</div>
                <h2>
                  <Lines text={booking.heading} />
                </h2>
                <PortableText value={booking.body} className={styles.lhsBody} />
                <div className={styles.scripture}>
                  {booking.scripture}
                  <span className={styles.ref}>{booking.scriptureRef}</span>
                </div>
              </div>
              <BookingForm
                title={booking.formTitle ?? 'Booking-anmodning'}
                stamp={booking.formStamp ?? ''}
                postmark={booking.formPostmark ?? ''}
                success={booking.formSuccess ?? 'Tak for din anmodning.'}
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      <section className={styles.faq}>
        <div className="wrap">
          {faqHead ? <SectionHead head={faqHead} ornament flush /> : null}
          <dl className={styles.faqGrid}>
            {(faq ?? []).map((item, i) => (
              <div key={i}>
                <dt>{item.q}</dt>
                <dd>{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  )
}
