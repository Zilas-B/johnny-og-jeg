/**
 * Public env — used by browser and server. Asserted at module load
 * because every render needs them; missing values fail fast at boot.
 */
export const apiVersion = assertValue(
  process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  'Missing environment variable: NEXT_PUBLIC_SANITY_API_VERSION',
)

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET',
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID',
)

/**
 * Public site origin — used for `metadataBase`, canonical/OG URLs, sitemap,
 * and robots. Set to the production domain in Vercel; intentionally not
 * asserted so preview deploys and local dev still resolve, falling back to
 * the Vercel URL and then localhost.
 * Trailing slash stripped so callers can concatenate `${siteUrl}/path`.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/+$/, '')

/**
 * Server-only secrets. Exposed as raw strings (possibly undefined) so
 * the module loads without them — CLI tooling (`pnpm types`) and public
 * page renders don't need them. Consumers assert at point of use:
 * Draft Mode for readToken, webhook handler for webhookSecret.
 *
 * Never import from a 'use client' file.
 */
export const readToken = process.env.SANITY_API_READ_TOKEN
export const webhookSecret = process.env.SANITY_WEBHOOK_SECRET

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }
  return v
}
