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
        attribution,
        background,
        borderTone
      },
      _type == "nextEssay" => {
        kicker,
        heading,
        cards[]{ roman, tag, cardHeading, cta, href, colorScheme }
      },
      _type == "hymnHero" => {
        eyebrow,
        romanNumeral,
        heading,
        lede,
        metaItems[]{ label, value },
        glassCaptionTop,
        glassQuote
      },
      _type == "scriptureStrip" => {
        quote,
        reference
      },
      _type == "stations" => {
        kicker,
        heading,
        deck,
        items[]{
          roman,
          years,
          location,
          heading,
          where,
          body,
          quote{ text, attribution }
        }
      },
      _type == "hymnal" => {
        kicker,
        heading,
        deck,
        columns[]{
          header,
          subhead,
          rows[]{ number, title, sub, duration, href }
        }
      },
      _type == "flagHero" => {
        eyebrow,
        romanNumeral,
        headingLead,
        headingAmp,
        headingGold,
        lede,
        metaItems[]{ label, value },
        backgroundImage{
          asset->{ _id, metadata{ dimensions, lqip } },
          alt
        },
        telegram{
          headLeft,
          headTitle,
          headYear,
          lines,
          sig,
          postmarkTop,
          postmarkMid,
          postmarkBottom
        }
      },
      _type == "statsBar" => {
        cells[]{ top, big }
      },
      _type == "themes" => {
        kicker,
        heading,
        deck,
        items[]{
          num,
          when,
          title,
          keys,
          body,
          song{ label, title, href }
        }
      },
      _type == "locationGrid" => {
        kicker,
        heading,
        deck,
        cards[]{ placeTag, name, coords, body }
      }
    },
    seo{
      title,
      description,
      ogImage{ asset->{ url, metadata{ dimensions } }, alt }
    }
  }
`)
