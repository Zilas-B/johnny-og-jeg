import type { HOME_PAGE_QUERY_RESULT } from '@/sanity/types'

import { PortableText } from '@/components/editorial/PortableText'

import styles from './HubHero.module.css'

type HomeBlock = NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>['blocks']>[number]
type HeroBlock = Extract<HomeBlock, { _type: 'hubHero' }>
type Hero = NonNullable<HeroBlock['hero']>
type Signature = NonNullable<HeroBlock['signatureCard']>

function renderTitleWithAmp(title: string) {
  // Hub title is "Johnny og jeg" — render " og " in barn-red with .amp styling.
  // If the editor changes the wording, fall back to plain text.
  const match = title.match(/^(.+?)\s+(og|and|&)\s+(.+?)$/i)
  if (!match) return title
  const [, left, conj, right] = match
  return (
    <>
      {left}
      <br />
      <span className={styles.amp}>&nbsp;{conj}&nbsp;</span>
      {right}
    </>
  )
}

export function HubHero({ hero, sig }: { hero: Hero; sig: Signature }) {
  return (
    <section className={styles.hero}>
      <div className="wrap">
        <div className={styles.grid}>
          <div>
            {hero.kicker ? (
              <div className={styles.eyebrow}>
                <span className={styles.bar} />
                {hero.kicker}
              </div>
            ) : null}
            <h1 className={styles.title}>{hero.title ? renderTitleWithAmp(hero.title) : null}</h1>
            <div className={styles.deck}>
              <PortableText value={hero.deck} withDropCap />
            </div>
            {hero.meta && hero.meta.length > 0 ? (
              <div className={styles.meta}>
                {hero.meta.map((line, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 28 }}>
                    <span>{line}</span>
                    {i < hero.meta!.length - 1 ? <span className={styles.pipe} /> : null}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <aside className={styles.sigcard} data-hero-foreword>
            <div className={styles.foreLabel}>{sig.foreLabel}</div>
            <h2 className={styles.sigQuote}>{sig.quote}</h2>
            <div className={styles.sigBody}>
              <PortableText value={sig.body} />
            </div>
            {sig.scripture?.text ? (
              <div className={styles.scripture}>
                {sig.scripture.text}
                {sig.scripture.reference ? (
                  <span className={styles.scriptureRef}>{sig.scripture.reference}</span>
                ) : null}
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  )
}
