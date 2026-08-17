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
import { sanityFetch } from '@/sanity/lib/live'
import { BOGER_QUERY } from '@/sanity/queries/boger'
import { FOREDRAG_QUERY } from '@/sanity/queries/foredrag'
import { HISTORIEN_QUERY } from '@/sanity/queries/historien'
import { KULTUREN_QUERY } from '@/sanity/queries/kulturen'
import { PAGE_QUERY } from '@/sanity/queries/page'
import { FIXED_PATH, SLUG_TYPE_QUERY } from '@/sanity/queries/router'
import { SITEMAP_QUERY } from '@/sanity/queries/sitemap'

type Params = { params: Promise<{ slug: string }> }

// Prerender every public route at build (SSG); a freshly published doc whose
// slug isn't in this list still renders on demand instead of 404ing.
export const dynamicParams = true

export async function generateStaticParams() {
  // Published-only, and on the base client on purpose: `sanityFetch` reads
  // `draftMode()`, which throws inside `generateStaticParams`, and a draft slug
  // must never become a prerendered public route.
  const docs = await client.fetch(SITEMAP_QUERY)
  return docs
    .map((doc) => FIXED_PATH[doc._type] ?? doc.slug)
    .filter((slug): slug is string => Boolean(slug)) // drops homePage ('') — it renders at '/'
    .map((slug) => ({ slug }))
}

async function fetchRouter(slug: string) {
  const { data } = await sanityFetch({
    query: SLUG_TYPE_QUERY,
    params: { slug },
    tags: ['landscape', 'page', 'kulturenPage'],
  })
  return data
}

async function fetchKulturen() {
  const { data } = await sanityFetch({
    query: KULTUREN_QUERY,
    tags: ['kulturenPage', 'landscape'],
  })
  return data
}

async function fetchHistorien() {
  const { data } = await sanityFetch({ query: HISTORIEN_QUERY, tags: ['historienPage'] })
  return data
}

async function fetchForedrag() {
  const { data } = await sanityFetch({ query: FOREDRAG_QUERY, tags: ['foredragPage'] })
  return data
}

async function fetchBoger() {
  const { data } = await sanityFetch({ query: BOGER_QUERY, tags: ['bogerPage'] })
  return data
}

async function fetchPage(slug: string) {
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug },
    tags: [`page:${slug}`, 'page'],
  })
  return data
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
