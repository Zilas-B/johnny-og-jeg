import type { MetadataRoute } from 'next'

import { siteUrl } from '@/sanity/env'

// §8 rule 4: index the public site, keep the Studio and route handlers out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/api'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
