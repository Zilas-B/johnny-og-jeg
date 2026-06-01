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

const NEUTRALS = [
  { name: 'paper', value: '#efe4cf' },
  { name: 'paper-2', value: '#e6d8bb' },
  { name: 'paper-3', value: '#d8c69e' },
  { name: 'ink', value: '#0e0d0c' },
  { name: 'ink-2', value: '#1a1714' },
  { name: 'ink-soft', value: '#2b2620' },
] as const

const ACCENTS = [
  { name: 'barn', value: '#a4282b', deep: '#76181b' },
  { name: 'denim', value: '#2c3e58', deep: '#1c2a3e' },
  { name: 'brass', value: '#c89b3c', deep: '#8e6a1f' },
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
                  background: a.value,
                  height: 56,
                  borderRadius: 2,
                  border: '1px solid var(--rule)',
                }}
              />
              <div
                style={{
                  background: a.deep,
                  height: 56,
                  borderRadius: 2,
                  border: '1px solid var(--rule)',
                }}
              />
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13 }}>
                {a.name} · {a.value} / {a.deep}
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
          className="bg-accent text-paper"
          style={{ padding: 24, marginTop: 16, fontFamily: 'var(--f-body)' }}
        >
          <code>bg-accent</code> + <code>text-paper</code>
        </div>
        <div
          className="text-accent"
          style={{
            padding: 24,
            border: '2px solid var(--accent)',
            marginTop: 8,
            fontFamily: 'var(--f-body)',
          }}
        >
          <code>text-accent</code> + <code>border-accent</code>
        </div>
      </section>
    </div>
  )
}

function SwatchGrid({
  swatches,
}: {
  swatches: readonly { name: string; value: string }[]
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
              background: s.value,
              height: 80,
              borderRadius: 2,
              border: '1px solid var(--rule)',
            }}
          />
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, marginTop: 6 }}>
            {s.name}
            <br />
            <span style={{ color: 'var(--ink-soft)' }}>{s.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
