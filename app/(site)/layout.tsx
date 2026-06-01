import { draftMode } from 'next/headers'

import { Footer } from '@/components/chrome/Footer'
import { Masthead } from '@/components/chrome/Masthead'
import { MusicPlayer } from '@/components/chrome/MusicPlayer'
import { Nav } from '@/components/chrome/Nav'
import { client } from '@/sanity/client'
import { SanityLive } from '@/sanity/lib/live'
import { SITE_SETTINGS_QUERY } from '@/sanity/queries/global'

// All site routes fetch siteSettings server-side; force dynamic so build
// doesn't try to prerender pages that depend on an authored singleton.
// Freshness comes from tag-based revalidation, not static prerender.
export const dynamic = 'force-dynamic'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await client.fetch(
    SITE_SETTINGS_QUERY,
    {},
    { next: { tags: ['siteSettings'] } },
  )

  if (
    !settings ||
    !settings.masthead ||
    !settings.nav ||
    !settings.cta ||
    !settings.footerMark ||
    !settings.footerBlurb ||
    !settings.footerQuote ||
    !settings.footerColumns ||
    !settings.footerBottomCopyright ||
    !settings.footerBottomTagline
  ) {
    throw new Error(
      'siteSettings is missing or incomplete. Open /studio → "Indstillinger for sitet" and publish all required fields.',
    )
  }

  const { isEnabled: isDraft } = await draftMode()

  return (
    <>
      <a href="#main" className="skip-link">
        Spring til indhold
      </a>
      <Masthead data={settings.masthead} />
      <Nav items={settings.nav} cta={settings.cta} />
      <main id="main">{children}</main>
      <Footer
        data={{
          footerMark: settings.footerMark,
          footerBlurb: settings.footerBlurb,
          footerQuote: settings.footerQuote,
          footerColumns: settings.footerColumns,
          footerBottomCopyright: settings.footerBottomCopyright,
          footerBottomTagline: settings.footerBottomTagline,
        }}
      />
      <MusicPlayer />
      {isDraft && <SanityLive />}
    </>
  )
}
