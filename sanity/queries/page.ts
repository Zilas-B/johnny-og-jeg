import { defineQuery } from 'next-sanity'

// A block-composed `page` by slug. Blocks resolve no references or images, so a
// spread of each block's fields is sufficient; typegen infers the discriminated
// union from the schema. Inner arrays (era cuts, cards, tag lines) are spread
// with their keys so the renderer can map them.
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    title,
    accentColor,
    blocks[]{
      _type,
      _key,
      _type == "vinylHero" => {
        eyebrow,
        romanNumeral,
        heading,
        lede,
        metaItems[]{ label, value },
        vinylTop,
        vinylTitle,
        vinylBottom,
        tickerItems
      },
      _type == "steppedList" => {
        kicker,
        heading,
        deck,
        items[]{
          years,
          label,
          tag[]{ label, value },
          body,
          cuts[]{ cutLabel, cutTitle, cutDuration, cutHref }
        }
      },
      _type == "cardGrid" => {
        kicker,
        heading,
        deck,
        cards[]{ roman, tag, cardHeading, cardBody }
      },
      _type == "pullQuote" => {
        kicker,
        quote,
        attribution
      },
      _type == "nextEssay" => {
        kicker,
        heading,
        cards[]{ roman, tag, cardHeading, cta, href, colorScheme }
      }
    },
    seo{
      title,
      description,
      ogImage{ asset->{ url, metadata{ dimensions } }, alt }
    }
  }
`)
