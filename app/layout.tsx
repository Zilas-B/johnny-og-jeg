import type { Metadata } from 'next'

import { client } from '@/sanity/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/queries/global'

import '../styles/globals.css'
import { fontVariables } from './fonts'

// Sitewide default metadata is authored in Sanity (siteSettings.seo) so it's
// editable, not hardcoded in JSX. Per-page generateMetadata overrides this.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(
    SITE_SETTINGS_QUERY,
    {},
    { next: { tags: ['siteSettings'] } },
  )
  const seo = settings?.seo
  const ogImageUrl = seo?.ogImage?.asset?.url
  return {
    title: seo?.title ?? undefined,
    description: seo?.description ?? undefined,
    openGraph: {
      title: seo?.title ?? undefined,
      description: seo?.description ?? undefined,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
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
