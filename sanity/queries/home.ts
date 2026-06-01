import { defineQuery } from 'next-sanity'

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage" && _id == "homePage"][0]{
    hero{
      kicker,
      title,
      deck,
      meta
    },
    signatureCard{
      stamp,
      foreLabel,
      quote,
      body,
      scripture{ text, reference }
    },
    ticker{
      items[]{ year, milestone }
    },
    vinyls{
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
    historicalThread{
      kicker,
      heading,
      intro,
      timeline[]{ year, place, heading, description }
    },
    hymn{
      kicker,
      quote,
      attribution
    },
    contact{
      kicker,
      heading,
      deck,
      bookingLabel,
      bookingHeading,
      bookingBody,
      bookingLinkText,
      bookingLinkHref
    },
    seo{
      title,
      description,
      ogImage{ asset->{url, metadata{dimensions}}, alt }
    }
  }
`)
