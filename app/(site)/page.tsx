import type { Metadata } from 'next'

import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { buildMetadata } from '@/components/seo/metadata'
import { client } from '@/sanity/client'
import { HOME_PAGE_QUERY } from '@/sanity/queries/home'

import styles from './home-color-test.module.css'

async function fetchHomePage() {
  return client.fetch(HOME_PAGE_QUERY, {}, { next: { tags: ['homePage'] } })
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
      'homePage er ikke udfyldt eller udgivet. Åbn /studio → "Forside — Johnny og jeg" og tilføj mindst én blok.',
    )
  }

  return (
    <div className={styles.yellowTest}>
      <BlockRenderer blocks={data.blocks} />
    </div>
  )
}
