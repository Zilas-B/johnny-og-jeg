import { defineQuery } from 'next-sanity'

// Resolves a top-level slug to the document type that owns it, so the single
// `[slug]` route can dispatch to the right renderer. Landscapes match by slug;
// the Kulturen singleton (no slug field) matches the fixed path "kulturen".
export const SLUG_TYPE_QUERY = defineQuery(`
  *[
    (_type == "landscape" && slug.current == $slug) ||
    (_type == "kulturenPage" && $slug == "kulturen")
  ][0]{ _type }
`)
