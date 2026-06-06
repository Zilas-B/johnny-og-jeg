import { defineQuery } from 'next-sanity'

// Resolves a top-level slug to the document type that owns it, so the single
// `[slug]` route can dispatch to the right renderer. Landscapes and block-
// composed pages match by slug; the Kulturen singleton (no slug field) matches
// the fixed path "kulturen".
export const SLUG_TYPE_QUERY = defineQuery(`
  *[
    (_type == "landscape" && slug.current == $slug) ||
    (_type == "page" && slug.current == $slug) ||
    (_type == "kulturenPage" && $slug == "kulturen") ||
    (_type == "historienPage" && $slug == "historien") ||
    (_type == "foredragPage" && $slug == "foredrag") ||
    (_type == "bogerPage" && $slug == "boeger-spil-film")
  ][0]{ _type }
`)

// Fixed singletons have no slug field; their `_type` maps to a fixed path
// (matching SLUG_TYPE_QUERY's dispatch above). `homePage` maps to the root.
// Single-sourced here so the `[slug]` route, sitemap, and generateStaticParams
// agree. Shared by app/(site)/[slug]/page.tsx and app/sitemap.ts.
export const FIXED_PATH: Record<string, string> = {
  homePage: '',
  kulturenPage: 'kulturen',
  historienPage: 'historien',
  foredragPage: 'foredrag',
  bogerPage: 'boeger-spil-film',
}
