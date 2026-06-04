import { defineQuery } from 'next-sanity'

// The Bøger/spil/film singleton: hero + literary map, the filter bar, the three
// book reviews (with §7 cover metadata), the empty Spil/Film categories, and the
// invitation + recommendation card.
export const BOGER_QUERY = defineQuery(`
  *[_type == "bogerPage"][0]{
    hero{
      eyebrow, titleLead, titleTrail, deck,
      litmap{
        image{ asset->{ _id, metadata{ dimensions, lqip } }, alt },
        capTag, caption
      }
    },
    filters{ lhs, alleCount, bogerCount, spilCount, filmCount, rhs },
    booksTitle,
    booksCount,
    books[]{
      catTag, roman,
      coverImage{ asset->{ _id, metadata{ dimensions, lqip } }, alt },
      buyHref, rating, readWhen, pages, language,
      title, author, year,
      metaRow[]{ label, value },
      lead, body, verdictLine, recoLabel, recoText, tags
    },
    spil{ title, count, glyph, heading, body, pending, previewLabel, preview[]{ yr, text } },
    film{ title, count, glyph, heading, body, pending, previewLabel, preview[]{ yr, text } },
    invite{
      kicker, heading, body,
      actions[]{ text, href, style },
      addCard{ label, heading, body, placeholder, small }
    },
    seo{
      title,
      description,
      ogImage{ asset->{ url, metadata{ dimensions } }, alt }
    }
  }
`)
