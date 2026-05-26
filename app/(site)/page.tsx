export default function HomePage() {
  return (
    <div className="wrap" style={{ padding: '4rem 1.5rem 6rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="font-display text-ink" style={{ fontSize: '4rem', fontStyle: 'italic', fontWeight: 900, lineHeight: 1.05 }}>
        Johnny &amp; jeg
      </h1>
      <p className="font-mono" style={{ color: 'var(--ink-soft)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '1.5rem' }}>
        Hub-siden bygges i Step 2.
      </p>
    </div>
  )
}
