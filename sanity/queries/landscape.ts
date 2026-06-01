import { defineQuery } from 'next-sanity'

export const LANDSCAPE_QUERY = defineQuery(`
  *[_type == "landscape" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    order,
    romanNumeral,
    toponym,
    period,
    accentColor,
    eyebrow,
    motto,
    deck,
    topicsLabel,
    topics,
    crumbBackText,
    crumbBackHref,
    emptyMeta,
    emptyLabel,
    emptyHeading,
    emptyBody,
    emptyActions[]{ text, href, style },
    "entries": *[_type == "archiveEntry" && landscape._ref == ^._id] | order(publishedAt desc){
      title,
      "slug": slug.current,
      publishedAt,
      kind,
      summary
    },
    seo{
      title,
      description,
      ogImage{ asset->{url, metadata{dimensions}}, alt }
    }
  }
`)

export const LANDSCAPE_SIBLINGS_QUERY = defineQuery(`
  *[_type == "landscape"] | order(order asc){
    "slug": slug.current,
    romanNumeral,
    shortName,
    order
  }
`)
