import { createImageUrlBuilder } from '@sanity/image-url'

import { client } from './client'

// Single image-URL builder for the whole site (best-practices §7). Co-located
// with sanity/client.ts. `urlFor(image)` returns a chainable builder —
// .width(...).auto('format').url() etc. Consumed by components/editorial/SanityImage.tsx.
const builder = createImageUrlBuilder(client)

// The accepted source shape, derived from the builder so we don't depend on a
// deep import path from @sanity/image-url.
type ImageSource = Parameters<typeof builder.image>[0]

export function urlFor(source: ImageSource) {
  return builder.image(source)
}
