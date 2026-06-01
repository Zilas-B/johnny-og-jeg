import { defineQuery } from 'next-sanity'

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    masthead,
    nav,
    cta,
    footerMark,
    footerBlurb,
    footerQuote,
    footerColumns,
    footerBottomCopyright,
    footerBottomTagline
  }
`)
