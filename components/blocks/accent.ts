import type { CSSProperties } from 'react'

// Maps an accentColor preset to its CSS-variable pair (best-practices §4). The
// page wrapper writes these once as --accent / --accent-deep; every downstream
// accent element reads them. Shared by LandscapeView and the block renderer.
export const ACCENT_VARS: Record<string, { accent: string; deep: string }> = {
  barn: { accent: 'var(--barn)', deep: 'var(--barn-deep)' },
  denim: { accent: 'var(--denim)', deep: 'var(--denim-deep)' },
  brass: { accent: 'var(--brass)', deep: 'var(--brass-deep)' },
}

export function accentStyle(accentColor?: string | null): CSSProperties {
  const accent = ACCENT_VARS[accentColor ?? 'barn'] ?? ACCENT_VARS.barn
  return { '--accent': accent.accent, '--accent-deep': accent.deep } as CSSProperties
}
