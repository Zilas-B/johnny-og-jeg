import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity/visual-editing'

import { Footer } from '@/components/chrome/Footer'
import { Masthead } from '@/components/chrome/Masthead'
import { MusicPlayer } from '@/components/chrome/MusicPlayer'
import { Nav } from '@/components/chrome/Nav'
import { readToken } from '@/sanity/env'
import { sanityFetch, SanityLive } from '@/sanity/lib/live'
import { SITE_SETTINGS_QUERY } from '@/sanity/queries/global'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: settings } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    tags: ['siteSettings'],
  })

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

  // Without a token `sanityFetch` silently falls back to the published
  // perspective with stega off — draft mode would look enabled and preview
  // nothing, the exact bug this route exists to prevent. Fail loudly instead,
  // matching /api/draft-mode/enable.
  if (isDraft && !readToken) {
    throw new Error(
      'Draft Mode is on but SANITY_API_READ_TOKEN is missing — set it in .env.local (and in Vercel) or preview will render published content.',
    )
  }

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
      {/* Draft Mode only: SanityLive streams content changes, VisualEditing
          turns the stega-encoded strings into Presentation's click-to-edit
          overlays. Public visitors load neither. */}
      {isDraft && (
        <>
          <SanityLive />
          <VisualEditing />
        </>
      )}
    </>
  )
}
