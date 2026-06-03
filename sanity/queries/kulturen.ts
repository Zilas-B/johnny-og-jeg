import { defineQuery } from 'next-sanity'

// The Kulturen singleton plus all eight landscapes in roman-numeral order. The
// chip grid + `.land` sections + outro card list are all derived from the
// landscapes array, so editing a landscape updates the Kulturen page too.
export const KULTUREN_QUERY = defineQuery(`
  *[_type == "kulturenPage"][0]{
    hero{ eyebrow, title, subhead, deck },
    chips{ label, count },
    intro{ kicker, heading, signature, body },
    outro{
      kicker,
      heading,
      body,
      actions[]{ text, href, style },
      cardLead,
      cardHeading
    },
    seo{
      title,
      description,
      ogImage{ asset->{ url, metadata{ dimensions } }, alt }
    },
    "landscapes": *[_type == "landscape"] | order(order asc){
      "slug": slug.current,
      romanNumeral,
      toponym,
      period,
      name,
      motto,
      shortName,
      kulturenBgVariant,
      kulturenArchiveCta,
      kulturenCardTag,
      kulturenEssay,
      kulturenSidebar[]{
        _type,
        _key,
        label,
        emphasis,
        value,
        entries[]{ _key, year, text }
      }
    }
  }
`)
