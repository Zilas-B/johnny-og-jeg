import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { accentStyle } from '@/components/blocks/accent'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { plainText } from '@/components/editorial/InlineText'
import { articleSchema, JsonLd } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/components/seo/metadata'
import { BogerView } from '@/components/boger/BogerView'
import { ForedragView } from '@/components/foredrag/ForedragView'
import { HistorienView } from '@/components/historien/HistorienView'
import { KulturenView } from '@/components/kulturen/KulturenView'
import { LandscapeView, landscapeMetadata } from '@/components/landscape/LandscapeView'
import { client } from '@/sanity/client'
import { siteUrl } from '@/sanity/env'
import { BOGER_QUERY } from '@/sanity/queries/boger'
import { FOREDRAG_QUERY } from '@/sanity/queries/foredrag'
import { HISTORIEN_QUERY } from '@/sanity/queries/historien'
import { KULTUREN_QUERY } from '@/sanity/queries/kulturen'
import { PAGE_QUERY } from '@/sanity/queries/page'
import { SLUG_TYPE_QUERY } from '@/sanity/queries/router'

type Params = { params: Promise<{ slug: string }> }

function fetchRouter(slug: string) {
  return client.fetch(
    SLUG_TYPE_QUERY,
    { slug },
    { next: { tags: ['landscape', 'page', 'kulturenPage'] } },
  )
}

function fetchKulturen() {
  return client.fetch(KULTUREN_QUERY, {}, { next: { tags: ['kulturenPage', 'landscape'] } })
}

function fetchHistorien() {
  return client.fetch(HISTORIEN_QUERY, {}, { next: { tags: ['historienPage'] } })
}

function fetchForedrag() {
  return client.fetch(FOREDRAG_QUERY, {}, { next: { tags: ['foredragPage'] } })
}

function fetchBoger() {
  return client.fetch(BOGER_QUERY, {}, { next: { tags: ['bogerPage'] } })
}

function fetchPage(slug: string) {
  return client.fetch(PAGE_QUERY, { slug }, { next: { tags: [`page:${slug}`, 'page'] } })
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const route = await fetchRouter(slug)
  const canonicalPath = `/${slug}`

  if (route?._type === 'kulturenPage') {
    const data = await fetchKulturen()
    if (!data) return {}
    return buildMetadata({
      seoTitle: data.seo?.title,
      fallbackTitle: plainText(data.hero?.title) || 'Kulturen',
      description: data.seo?.description ?? data.hero?.subhead,
      ogImageUrl: data.seo?.ogImage?.asset?.url,
      canonicalPath,
    })
  }

  if (route?._type === 'historienPage') {
    const data = await fetchHistorien()
    if (!data) return {}
    return buildMetadata({
      seoTitle: data.seo?.title,
      fallbackTitle: data.hero?.title ?? 'Historien',
      description: data.seo?.description,
      ogImageUrl: data.seo?.ogImage?.asset?.url,
      canonicalPath,
    })
  }

  if (route?._type === 'foredragPage') {
    const data = await fetchForedrag()
    if (!data) return {}
    return buildMetadata({
      seoTitle: data.seo?.title,
      fallbackTitle: data.hero?.title ?? 'Foredrag',
      description: data.seo?.description,
      ogImageUrl: data.seo?.ogImage?.asset?.url,
      canonicalPath,
    })
  }

  if (route?._type === 'bogerPage') {
    const data = await fetchBoger()
    if (!data) return {}
    return buildMetadata({
      seoTitle: data.seo?.title,
      fallbackTitle:
        [data.hero?.titleLead, data.hero?.titleTrail].filter(Boolean).join(' & ') ||
        'Bøger, spil, film',
      description: data.seo?.description,
      ogImageUrl: data.seo?.ogImage?.asset?.url,
      canonicalPath,
    })
  }

  if (route?._type === 'page') {
    const data = await fetchPage(slug)
    if (!data) return {}
    return buildMetadata({
      seoTitle: data.seo?.title,
      fallbackTitle: data.title,
      description: data.seo?.description,
      ogImageUrl: data.seo?.ogImage?.asset?.url,
      canonicalPath,
    })
  }

  if (route?._type === 'landscape') return landscapeMetadata(slug)
  return {}
}

export default async function SlugPage({ params }: Params) {
  const { slug } = await params
  const route = await fetchRouter(slug)

  if (route?._type === 'kulturenPage') {
    const data = await fetchKulturen()
    if (!data) notFound()
    return <KulturenView data={data} />
  }

  if (route?._type === 'historienPage') {
    const data = await fetchHistorien()
    if (!data) notFound()
    return <HistorienView data={data} />
  }

  if (route?._type === 'foredragPage') {
    const data = await fetchForedrag()
    if (!data) notFound()
    return <ForedragView data={data} />
  }

  if (route?._type === 'bogerPage') {
    const data = await fetchBoger()
    if (!data) notFound()
    return <BogerView data={data} />
  }

  if (route?._type === 'page') {
    const data = await fetchPage(slug)
    if (!data) notFound()
    // Article structured data for the essay pages (§8 rule 5), from the same
    // Sanity fields rendered on-page.
    const ld = articleSchema({
      headline: data.seo?.title ?? data.title ?? slug,
      description: data.seo?.description,
      imageUrl: data.seo?.ogImage?.asset?.url ?? `${siteUrl}/og-default.jpg`,
      path: `/${slug}`,
      datePublished: data._createdAt,
      dateModified: data._updatedAt,
    })
    return (
      <div style={accentStyle(data.accentColor)}>
        <JsonLd data={ld} />
        <BlockRenderer blocks={data.blocks} />
      </div>
    )
  }

  if (route?._type === 'landscape') return <LandscapeView slug={slug} />

  notFound()
}
