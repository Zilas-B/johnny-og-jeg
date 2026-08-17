import type { Metadata } from 'next'

import { DEFAULT_OG_IMAGE } from '@/components/seo/metadata'
import { client } from '@/sanity/client'
import { siteUrl } from '@/sanity/env'
import { SITE_SETTINGS_QUERY } from '@/sanity/queries/global'

import '../styles/globals.css'
import { fontVariables } from './fonts'

const SITE_NAME = 'Johnny og jeg'
const DEFAULT_TITLE = 'Johnny og jeg — om Johnny Cash, troen og Amerika'

// Sitewide defaults: `metadataBase` (so relative OG/canonical URLs resolve),
// the `%s — Johnny og jeg` title template every sub-page inherits, and the
// editor-authored siteSettings.seo fallbacks. Per-page generateMetadata
// overrides title/description/OG; the home page opts out of the suffix.
// Base client, not `sanityFetch`: this layout also wraps /studio, and stega
// characters in <title>/<meta> are never visible in the preview pane — they'd
// only leak invisible junk into head tags. Nothing here is previewable.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(
    SITE_SETTINGS_QUERY,
    {},
    { next: { tags: ['siteSettings'] } },
  )
  const seo = settings?.seo
  const ogImageUrl = seo?.ogImage?.asset?.url ?? DEFAULT_OG_IMAGE
  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: `%s — ${SITE_NAME}`,
      default: seo?.title ?? DEFAULT_TITLE,
    },
    description: seo?.description ?? undefined,
    openGraph: {
      title: seo?.title ?? DEFAULT_TITLE,
      description: seo?.description ?? undefined,
      images: [{ url: ogImageUrl }],
      siteName: SITE_NAME,
      locale: 'da_DK',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.title ?? DEFAULT_TITLE,
      description: seo?.description ?? undefined,
      images: [{ url: ogImageUrl }],
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="da" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
