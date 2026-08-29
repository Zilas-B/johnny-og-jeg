import { defineQuery } from 'next-sanity'

// The home singleton, block-composed (Step 7e). Mirrors the essay `PAGE_QUERY`
// shape: each block projects its own fields under a `_type ==` guard so typegen
// infers a discriminated union the shared `BlockRenderer` can dispatch on. The
// six home block types are home-only; their fields match the pre-7e named
// fields verbatim, just nested under the block.
export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage" && _id == "homePage"][0]{
    blocks[]{
      _type,
      _key,
      _type == "hubHero" => {
        hero{
          kicker,
          title,
          deck,
          meta
        },
        signatureCard{
          foreLabel,
          quote,
          body,
          scripture{ text, reference }
        }
      },
      _type == "setlistTicker" => {
        items[]{ year, milestone }
      },
      _type == "hubVinyls" => {
        kicker,
        heading,
        deck,
        items[]{
          cornerNumber,
          cornerTag,
          vinylAccent,
          sleeveText,
          vinylTopLabel,
          vinylTitle,
          vinylBottomLabel,
          heading,
          subhead,
          body,
          tracklist[]{ track, title, duration },
          linkText,
          linkHref
        }
      },
      _type == "historicalThread" => {
        kicker,
        heading,
        intro,
        timeline[]{ year, place, heading, description }
      },
      _type == "hymn" => {
        kicker,
        quote,
        attribution
      },
      _type == "contact" => {
        kicker,
        heading,
        deck,
        bookingLabel,
        bookingHeading,
        bookingBody,
        bookingLinkText,
        bookingLinkHref
      }
    },
    seo{
      title,
      description,
      ogImage{ asset->{url, metadata{dimensions}}, alt }
    }
  }
`)
