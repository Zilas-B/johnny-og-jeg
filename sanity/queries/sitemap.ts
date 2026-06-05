import { defineQuery } from 'next-sanity'

// All public, renderable documents with their last-modified date for the
// sitemap (§8 rule 3). Landscapes are included only once authored (a `deck`
// exists — identity-only stubs `notFound()`, mirroring LandscapeView's guard).
// Slugged types (`landscape`, `page`) carry their slug; the fixed singletons
// have no slug field — the route maps their `_type` to its fixed path.
export const SITEMAP_QUERY = defineQuery(`
  *[
    (_type == "landscape" && defined(slug.current) && defined(deck)) ||
    (_type == "page" && defined(slug.current)) ||
    _type in ["homePage", "kulturenPage", "historienPage", "foredragPage", "bogerPage"]
  ]{
    _type,
    _updatedAt,
    "slug": slug.current
  }
`)
