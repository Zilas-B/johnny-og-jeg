import type { Metadata } from 'next'

import { ContactSection } from '@/components/hub/ContactSection'
import { HistoricalThread } from '@/components/hub/HistoricalThread'
import { HubHero } from '@/components/hub/HubHero'
import { HubVinyls } from '@/components/hub/HubVinyls'
import { Hymn } from '@/components/hub/Hymn'
import { SetlistTicker } from '@/components/hub/SetlistTicker'
import { client } from '@/sanity/client'
import { HOME_PAGE_QUERY } from '@/sanity/queries/home'

async function fetchHomePage() {
  return client.fetch(HOME_PAGE_QUERY, {}, { next: { tags: ['homePage'] } })
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchHomePage()
  const title = data?.seo?.title ?? data?.hero?.title ?? 'Johnny og jeg'
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

  if (
    !data ||
    !data.hero ||
    !data.signatureCard ||
    !data.ticker?.items?.length ||
    !data.vinyls?.items?.length ||
    !data.historicalThread ||
    !data.hymn ||
    !data.contact
  ) {
    throw new Error(
      'homePage er ikke udfyldt eller udgivet. Åbn /studio → "Forside — Johnny og jeg" og udfyld alle påkrævede felter.',
    )
  }

  return (
    <>
      <HubHero hero={data.hero} sig={data.signatureCard} />
      <SetlistTicker items={data.ticker.items} />
      <HubVinyls data={data.vinyls} />
      <HistoricalThread data={data.historicalThread} />
      <Hymn data={data.hymn} />
      <ContactSection data={data.contact} />
    </>
  )
}
