// Route discovery for the viewport smoke tests.
//
// Routes come from the site's own `/sitemap.xml`, never a hardcoded list: the
// site has one dynamic `[slug]` route whose slugs live in Sanity, so a list
// would stop covering new pages the moment the Editor publishes one.

/** Absolute URLs in the sitemap → root-relative paths, deduplicated, `/` first. */
export function pathsFromSitemap(xml: string): string[] {
  const locs = Array.from(xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g), (m) => m[1])
  const paths = locs.map((loc) => {
    const { pathname } = new URL(loc)
    return pathname.replace(/\/+$/, '') || '/'
  })
  return Array.from(new Set(paths)).sort((a, b) =>
    a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b),
  )
}
