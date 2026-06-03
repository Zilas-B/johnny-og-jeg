import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'

import { plainText } from '@/components/editorial/InlineText'
import { LandscapeHero } from '@/components/landscape/LandscapeHero'
import { LandscapePosts } from '@/components/landscape/LandscapePosts'
import { LandscapeSiblings } from '@/components/landscape/LandscapeSiblings'
import { client } from '@/sanity/client'
import { LANDSCAPE_QUERY, LANDSCAPE_SIBLINGS_QUERY } from '@/sanity/queries/landscape'

// Maps an accentColor preset to its CSS variable pair. Landscapes ship `barn`.
const ACCENT_VARS: Record<string, { accent: string; deep: string }> = {
  barn: { accent: 'var(--barn)', deep: 'var(--barn-deep)' },
  denim: { accent: 'var(--denim)', deep: 'var(--denim-deep)' },
  brass: { accent: 'var(--brass)', deep: 'var(--brass-deep)' },
}

export function fetchLandscape(slug: string) {
  return client.fetch(
    LANDSCAPE_QUERY,
    { slug },
    { next: { tags: [`landscape:${slug}`, 'landscape', 'archiveEntry'] } },
  )
}

export async function landscapeMetadata(slug: string): Promise<Metadata> {
  const data = await fetchLandscape(slug)
  if (!data) return {}
  const title = data.seo?.title ?? (plainText(data.name) || 'Landskab')
  const description = data.seo?.description ?? data.motto ?? undefined
  const ogImageUrl = data.seo?.ogImage?.asset?.url
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
  }
}

export async function LandscapeView({ slug }: { slug: string }) {
  const [data, siblings] = await Promise.all([
    fetchLandscape(slug),
    client.fetch(LANDSCAPE_SIBLINGS_QUERY, {}, { next: { tags: ['landscape'] } }),
  ])

  // Guard: a landscape that exists only as an identity stub (no authored hero)
  // is not yet renderable.
  if (!data || !data.deck) notFound()

  const accent = ACCENT_VARS[data.accentColor ?? 'barn'] ?? ACCENT_VARS.barn
  const style = { '--accent': accent.accent, '--accent-deep': accent.deep } as CSSProperties

  return (
    <div style={style}>
      <LandscapeHero data={data} />
      <LandscapePosts data={data} />
      <LandscapeSiblings siblings={siblings} currentSlug={slug} />
    </div>
  )
}
