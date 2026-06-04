import { defineQuery } from 'next-sanity'

// The Historien singleton: hero + six era sections (with §7 image metadata) +
// outro. The hero "Bladre i" list and the timeline strip are both derived from
// the eras array in the renderer, so they are not separately queried.
export const HISTORIEN_QUERY = defineQuery(`
  *[_type == "historienPage"][0]{
    hero{ eyebrow, title, titleSub, deck, sideLabel, sideHeading },
    eras[]{
      romanNumeral,
      period,
      navName,
      timelineName,
      heading,
      deck,
      body,
      image{
        asset->{ _id, metadata{ dimensions, lqip } },
        alt,
        shape
      },
      imageCollage{
        asset->{ _id, metadata{ dimensions, lqip } },
        alt
      },
      creditLeft,
      creditRight,
      cashnote{ label, heading, song, body },
      posts[]{ kind, title, date, href, empty }
    },
    outro{
      kicker,
      heading,
      body,
      actions[]{ text, href, style },
      cardHeading,
      cardItems[]{ text, year }
    },
    seo{
      title,
      description,
      ogImage{ asset->{ url, metadata{ dimensions } }, alt }
    }
  }
`)
