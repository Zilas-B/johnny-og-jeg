import { defineQuery } from 'next-sanity'

// The Foredrag singleton: hero + ticket, three programme posters, the dark
// "practical" grid, venues + testimonial, booking copy, and FAQ. The booking
// form fields themselves are hardcoded in BookingForm.tsx; only the surrounding
// editorial copy is queried.
export const FOREDRAG_QUERY = defineQuery(`
  *[_type == "foredragPage"][0]{
    hero{
      eyebrow, title, titleSmall, deck,
      metaCells[]{ k, v },
      ticket{
        stampTop, stampBig, stampBottom, headLhs, headNum, heading,
        lines[]{ label, value },
        priceLabel, price, priceUnit, ctaText, ctaHref
      }
    },
    programsHead{ kicker, heading, deck },
    programs[]{ side, roman, theme, heading, sub, body, arc, duration, bestFor },
    practical{ kicker, heading, intro, cells[]{ k, label, heading, body } },
    venuesHead{ kicker, heading, deck },
    venues[]{ yr, place, city },
    testimonial{ quote, attribName, attribPlace, attribWhen, alsoLabel, alsoOrgs },
    booking{
      kicker, heading, body, scripture, scriptureRef,
      formTitle, formStamp, formPostmark, formSuccess
    },
    faqHead{ kicker, heading },
    faq[]{ q, a },
    seo{
      title,
      description,
      ogImage{ asset->{ url, metadata{ dimensions } }, alt }
    }
  }
`)
