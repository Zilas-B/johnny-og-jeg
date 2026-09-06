import type { Metadata } from 'next'

import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { buildMetadata } from '@/components/seo/metadata'
import { sanityFetch } from '@/sanity/lib/live'
import { HOME_PAGE_QUERY } from '@/sanity/queries/home'

async function fetchHomePage() {
  const { data } = await sanityFetch({ query: HOME_PAGE_QUERY, tags: ['homePage'] })
  return data
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchHomePage()
  const heroBlock = data?.blocks?.find((b) => b._type === 'hubHero')
  // The home title already carries the brand — always absolute (no suffix).
  return buildMetadata({
    seoTitle:
      data?.seo?.title ??
      heroBlock?.hero?.title ??
      'Johnny og jeg — om Johnny Cash, troen og Amerika',
    description: data?.seo?.description,
    ogImageUrl: data?.seo?.ogImage?.asset?.url,
    canonicalPath: '/',
    ogType: 'website',
  })
}

export default async function HomePage() {
  const data = await fetchHomePage()

  if (!data?.blocks?.length) {
    throw new Error(
      'homePage is missing or unpublished. Open /studio → "Front page — Johnny og jeg" and add at least one block.',
    )
  }

  return <BlockRenderer blocks={data.blocks} />
}
