import { defineLive } from 'next-sanity/live'

import { client } from '../client'
import { readToken } from '../env'

/**
 * Field names whose value is a lookup key, not prose — accent presets, variant
 * switches, style tokens. Stega hides invisible characters inside the string it
 * encodes, which silently breaks an exact match: the preset falls through to its
 * default and the preview renders the wrong colour. These fields lose
 * click-to-edit; every string that is actually displayed keeps it.
 *
 * `_`-prefixed keys (`_type`, `_key`), `slug`, `href`, `url`, dates and the
 * whole `seo` subtree are already excluded by next-sanity's default filter.
 * Add a name here whenever a new `options.list` enum is consumed as a key.
 */
const LOOKUP_KEY_FIELDS = new Set([
  'accentColor',
  'background',
  'borderTone',
  'colorScheme',
  'emphasis',
  'kind',
  'kulturenBgVariant',
  'shape',
  'style',
  'vinylAccent',
])

/**
 * The draft-aware client. The shared client stays `perspective: 'published'`
 * with stega off — `defineLive` re-pins both on its own copy and then passes an
 * explicit perspective per fetch, so the only thing added here is the
 * `studioUrl` stega needs to build click-to-edit links. Without it `sanityFetch`
 * never turns stega on and Presentation has nothing to overlay.
 */
const liveClient = client.withConfig({
  stega: {
    studioUrl: '/studio',
    filter: (props) =>
      LOOKUP_KEY_FIELDS.has(String(props.sourcePath.at(-1)))
        ? false
        : props.filterDefault(props),
  },
})

/**
 * `sanityFetch` resolves perspective and stega from `draftMode()` per call:
 * published + stega off for public visitors (byte-identical to a plain client
 * fetch), drafts + stega on inside Draft Mode. Use it for anything an editor
 * should be able to preview. Non-previewable reads — `sitemap.xml`,
 * `generateStaticParams` — stay on the published base client.
 *
 * Two things `defineLive` imposes that the base client did not: it forces
 * `useCdn: true` on its own copy (mitigated by `cacheMode: 'noStale'` outside
 * the build phase), and every call costs two requests — one for the sync tags,
 * one for the data. Neither is configurable in v13.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client: liveClient,
  serverToken: readToken,
  // Never shared with the browser. `browserToken` would let the live channel
  // subscribe to draft events outside the Studio — but the token is written to
  // the page, and ours has write scope. Previewing happens inside Presentation,
  // which feeds drafts through its own channel, so nothing is lost. `false`
  // rather than `undefined`: it silences the dev warning, which exists to catch
  // an accidental omission, not a deliberate one.
  browserToken: false,
})
