import { defineEnableDraftMode } from 'next-sanity/draft-mode'

import { client } from '@/sanity/client'
import { editorToken } from '@/sanity/env'

// The Presentation tool calls this route with a signed preview-url-secret.
// `defineEnableDraftMode` needs a token to validate that secret. The token
// is set in .env.local / Vercel; if it's missing we fail loudly here rather
// than silently allowing draft mode without verification.
const draftClient = editorToken ? client.withConfig({ token: editorToken }) : null

const handler = draftClient ? defineEnableDraftMode({ client: draftClient }) : null

export async function GET(request: Request) {
  if (!handler) {
    return new Response(
      'Missing SANITY_API_EDITOR_TOKEN — set it locally in .env.local (and in Vercel for production) to use the Presentation tool.',
      { status: 500 },
    )
  }
  return handler.GET(request)
}
