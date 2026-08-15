import type { Metadata } from 'next'

// Single static default share image — one OG source for the whole site.
// Editor-chosen `seo.ogImage` overrides it per page; pages without one
// fall back here so every share preview has an image. Path is relative and
// resolves to an absolute URL via `metadataBase` (set in the root layout).
export const DEFAULT_OG_IMAGE = '/og-default.jpg'

const SITE_NAME = 'Johnny og jeg'

/**
 * Builds the Sanity-driven `openGraph` + `twitter` + canonical block shared by
 * every public page's `generateMetadata` (§8 rule 2). Centralised so the
 * default-OG fallback and Twitter card stay consistent across pages.
 *
 * Title resolution mirrors the static templates, whose per-page `<title>`s are
 * bespoke (e.g. "Musikeren — Johnny Cash", "Naturen — Kulturen · Johnny og
 * jeg"), not a uniform suffix: an editor-set `seoTitle` is used **verbatim**
 * (absolute, no suffix). Only the bare-heading `fallbackTitle` flows through the
 * root layout's `%s — Johnny og jeg` template, so untitled pages still carry the
 * brand. The root layout owns `metadataBase` and that template.
 */
export function buildMetadata(input: {
  seoTitle?: string | null
  fallbackTitle?: string | null
  description?: string | null
  ogImageUrl?: string | null
  canonicalPath?: string
  ogType?: 'article' | 'website'
}): Metadata {
  const seoTitle = input.seoTitle ?? undefined
  const fallbackTitle = input.fallbackTitle ?? undefined
  // OG/Twitter title: the resolved plain string (site name lives in og:site_name).
  const title = seoTitle ?? fallbackTitle
  const description = input.description ?? undefined
  const images = [{ url: input.ogImageUrl ?? DEFAULT_OG_IMAGE }]

  return {
    // seoTitle → absolute (verbatim); fallback → string so the template suffixes it.
    title: seoTitle ? { absolute: seoTitle } : fallbackTitle,
    description,
    ...(input.canonicalPath ? { alternates: { canonical: input.canonicalPath } } : {}),
    openGraph: {
      title,
      description,
      images,
      siteName: SITE_NAME,
      locale: 'da_DK',
      type: input.ogType ?? 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  }
}
