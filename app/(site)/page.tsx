import type { Metadata } from 'next'

import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { client } from '@/sanity/client'
import { HOME_PAGE_QUERY } from '@/sanity/queries/home'

async function fetchHomePage() {
  return client.fetch(HOME_PAGE_QUERY, {}, { next: { tags: ['homePage'] } })
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchHomePage()
  const heroBlock = data?.blocks?.find((b) => b._type === 'hubHero')
  const title = data?.seo?.title ?? heroBlock?.hero?.title ?? 'Johnny og jeg'
  const description = data?.seo?.description ?? undefined
  const ogImageUrl = data?.seo?.ogImage?.asset?.url
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

export default async function HomePage() {
  const data = await fetchHomePage()

  if (!data?.blocks?.length) {
    throw new Error(
      'homePage er ikke udfyldt eller udgivet. Åbn /studio → "Forside — Johnny og jeg" og tilføj mindst én blok.',
    )
  }

  return <BlockRenderer blocks={data.blocks} />
}
