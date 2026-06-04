import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { accentStyle } from '@/components/blocks/accent'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { plainText } from '@/components/editorial/InlineText'
import { KulturenView } from '@/components/kulturen/KulturenView'
import { LandscapeView, landscapeMetadata } from '@/components/landscape/LandscapeView'
import { client } from '@/sanity/client'
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

function fetchPage(slug: string) {
  return client.fetch(PAGE_QUERY, { slug }, { next: { tags: [`page:${slug}`, 'page'] } })
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const route = await fetchRouter(slug)

  if (route?._type === 'kulturenPage') {
    const data = await fetchKulturen()
    if (!data) return {}
    const title = data.seo?.title ?? (plainText(data.hero?.title) || 'Kulturen')
    const description = data.seo?.description ?? data.hero?.subhead ?? undefined
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

  if (route?._type === 'page') {
    const data = await fetchPage(slug)
    if (!data) return {}
    const title = data.seo?.title ?? data.title ?? undefined
    const description = data.seo?.description ?? undefined
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

  if (route?._type === 'page') {
    const data = await fetchPage(slug)
    if (!data) notFound()
    return (
      <div style={accentStyle(data.accentColor)}>
        <BlockRenderer blocks={data.blocks} />
      </div>
    )
  }

  if (route?._type === 'landscape') return <LandscapeView slug={slug} />

  notFound()
}
