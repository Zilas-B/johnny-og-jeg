// Styleguide — minimal v1 (Step 2).
// Renders the current design tokens and primitives that exist today.
// TODO (Step 5+): query landscape accentColors from Sanity and render swatches.
// TODO (Step 3+): add editorial primitives (drop cap, era chip, landscape card,
//   footnote, captioned image) as they are built.

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Styleguide — Johnny og jeg',
  robots: { index: false, follow: false },
}

// Names mirror the CSS custom properties declared in styles/tokens.css.
// We render swatches off `var(--<name>)` so tokens.css stays the only source
// of truth — change a hex there and the styleguide reflects it for free.
const NEUTRALS = [
  { name: 'paper' },
  { name: 'paper-2' },
  { name: 'paper-3' },
  { name: 'ink' },
  { name: 'ink-2' },
  { name: 'ink-soft' },
] as const

const ACCENTS = [
  { name: 'barn', deep: 'barn-deep' },
  { name: 'denim', deep: 'denim-deep' },
  { name: 'brass', deep: 'brass-deep' },
] as const

export default function StyleguidePage() {
  return (
    <div className="wrap" style={{ padding: '48px 56px' }}>
      <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 56, margin: '0 0 8px' }}>
        Styleguide
      </h1>
      <p style={{ fontFamily: 'var(--f-body)', color: 'var(--ink-soft)', margin: '0 0 48px' }}>
        Lever som visuel smoke-test for tokens og primitiver. Ingen indeksering.
      </p>

      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontFamily: 'var(--f-poster)', letterSpacing: '0.2em', fontSize: 18 }}>
          TYPOGRAFI
        </h2>
        <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 48 }}>
            Display — Playfair Display
          </div>
          <div style={{ fontFamily: 'var(--f-poster)', fontSize: 32, letterSpacing: '0.06em' }}>
            POSTER — BEBAS NEUE
          </div>
          <div style={{ fontFamily: 'var(--f-body)', fontSize: 18 }}>
            Body — Crimson Pro. The quick brown fox jumps over the lazy dog.
          </div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 14 }}>
            Mono — IBM Plex Mono. const cash = &quot;Johnny&quot;;
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontFamily: 'var(--f-poster)', letterSpacing: '0.2em', fontSize: 18 }}>
          NEUTRALS
        </h2>
        <SwatchGrid swatches={NEUTRALS} />
      </section>

      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontFamily: 'var(--f-poster)', letterSpacing: '0.2em', fontSize: 18 }}>
          ACCENTS (faste tokens)
        </h2>
        <p
          style={{
            fontFamily: 'var(--f-body)',
            color: 'var(--ink-soft)',
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          Per-side accenter sættes via <code>--accent</code> CSS-custom-property; pages overrider.
          Den aktive accent vises herunder.
        </p>
        <div style={{ display: 'grid', gap: 12 }}>
          {ACCENTS.map((a) => (
            <div
              key={a.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 120px 1fr',
                gap: 12,
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  background: `var(--${a.name})`,
                  height: 56,
                  borderRadius: 2,
                  border: '1px solid var(--rule)',
                }}
              />
              <div
                style={{
                  background: `var(--${a.deep})`,
                  height: 56,
                  borderRadius: 2,
                  border: '1px solid var(--rule)',
                }}
              />
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13 }}>
                {a.name} / {a.deep}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontFamily: 'var(--f-poster)', letterSpacing: '0.2em', fontSize: 18 }}>
          AKTIV ACCENT (via --accent)
        </h2>
        <div
          style={{
            background: 'var(--accent)',
            color: 'var(--paper)',
            padding: 24,
            marginTop: 16,
            fontFamily: 'var(--f-body)',
          }}
        >
          <code>--accent</code> + <code>--paper</code>
        </div>
        <div
          style={{
            color: 'var(--accent)',
            padding: 24,
            border: '2px solid var(--accent)',
            marginTop: 8,
            fontFamily: 'var(--f-body)',
          }}
        >
          <code>--accent</code> as text + border
        </div>
      </section>
    </div>
  )
}

function SwatchGrid({
  swatches,
}: {
  swatches: readonly { name: string }[]
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 12,
        marginTop: 16,
      }}
    >
      {swatches.map((s) => (
        <div key={s.name}>
          <div
            style={{
              background: `var(--${s.name})`,
              height: 80,
              borderRadius: 2,
              border: '1px solid var(--rule)',
            }}
          />
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, marginTop: 6 }}>
            {s.name}
            <br />
            <span style={{ color: 'var(--ink-soft)' }}>var(--{s.name})</span>
          </div>
        </div>
      ))}
    </div>
  )
}
