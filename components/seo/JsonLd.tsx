import { siteUrl } from '@/sanity/env'

import { DEFAULT_OG_IMAGE } from './metadata'

/**
 * Emits a JSON-LD structured-data script. Using `dangerouslySetInnerHTML` here
 * is the Next.js-sanctioned mechanism for `<script type="application/ld+json">`
 * and is a deliberate, scoped exception to the ban on `dangerouslySetInnerHTML`,
 * which is about *Portable Text content* rendering. The payload
 * is `JSON.stringify` output we control — `<` is escaped to `<` to prevent
 * a `</script>` breakout — so there is no untrusted-HTML injection path.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

/**
 * `Article` schema for an essay page (§8 rule 5), built from the same Sanity
 * fields used on-page — no duplicate data. `path` is the page's absolute path
 * (e.g. `/musikeren`); dates come from the document's `_createdAt`/`_updatedAt`.
 */
export function articleSchema(input: {
  headline: string
  description?: string | null
  imageUrl?: string | null
  path: string
  datePublished?: string
  dateModified?: string
}): Record<string, unknown> {
  const url = `${siteUrl}${input.path}`
  const publisher = {
    '@type': 'Organization',
    name: 'Johnny og jeg',
    logo: { '@type': 'ImageObject', url: `${siteUrl}/icon.svg` },
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    ...(input.description ? { description: input.description } : {}),
    image: [input.imageUrl ?? `${siteUrl}${DEFAULT_OG_IMAGE}`],
    inLanguage: 'da-DK',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    author: { '@type': 'Organization', name: 'Johnny og jeg', url: siteUrl },
    publisher,
  }
}
