import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { accentStyle } from '@/components/blocks/accent'
import { plainText } from '@/components/editorial/InlineText'
import { buildMetadata } from '@/components/seo/metadata'
import { LandscapeHero } from '@/components/landscape/LandscapeHero'
import { LandscapePosts } from '@/components/landscape/LandscapePosts'
import { LandscapeSiblings } from '@/components/landscape/LandscapeSiblings'
import { client } from '@/sanity/client'
import { LANDSCAPE_QUERY, LANDSCAPE_SIBLINGS_QUERY } from '@/sanity/queries/landscape'

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
  return buildMetadata({
    seoTitle: data.seo?.title,
    fallbackTitle: plainText(data.name) || 'Landskab',
    description: data.seo?.description ?? data.motto,
    ogImageUrl: data.seo?.ogImage?.asset?.url,
    canonicalPath: `/${slug}`,
  })
}

export async function LandscapeView({ slug }: { slug: string }) {
  const [data, siblings] = await Promise.all([
    fetchLandscape(slug),
    client.fetch(LANDSCAPE_SIBLINGS_QUERY, {}, { next: { tags: ['landscape'] } }),
  ])

  // Guard: a landscape that exists only as an identity stub (no authored hero)
  // is not yet renderable.
  if (!data || !data.deck) notFound()

  return (
    <div style={accentStyle(data.accentColor)}>
      <LandscapeHero data={data} />
      <LandscapePosts data={data} />
      <LandscapeSiblings siblings={siblings} currentSlug={slug} />
    </div>
  )
}
