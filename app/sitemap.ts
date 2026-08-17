import type { MetadataRoute } from 'next'

import { client } from '@/sanity/client'
import { siteUrl } from '@/sanity/env'
import { FIXED_PATH } from '@/sanity/queries/router'
import { SITEMAP_QUERY } from '@/sanity/queries/sitemap'

// Base client on purpose — the sitemap is a public artefact and must list
// published documents only, never whatever the editor happens to have in draft.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await client.fetch(
    SITEMAP_QUERY,
    {},
    {
      // Revalidate when any listed type is published (§1 tag-based webhook).
      next: {
        tags: [
          'landscape',
          'page',
          'homePage',
          'kulturenPage',
          'historienPage',
          'foredragPage',
          'bogerPage',
        ],
      },
    },
  )

  return docs.map((doc) => {
    const path = FIXED_PATH[doc._type] ?? doc.slug ?? ''
    return {
      url: path ? `${siteUrl}/${path}` : siteUrl,
      lastModified: doc._updatedAt,
    }
  })
}
