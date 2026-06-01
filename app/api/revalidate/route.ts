import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

import { webhookSecret } from '@/sanity/env'

type WebhookBody = {
  _type: string
  slug?: string
}

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    return new Response('Missing SANITY_WEBHOOK_SECRET on server', { status: 500 })
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookBody>(req, webhookSecret)

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }
    if (!body?._type) {
      return new Response('Bad payload — missing _type', { status: 400 })
    }

    // Next 16: revalidateTag requires a profile. 'max' tells Next the tag has
    // the longest-lived cache profile and that we're explicitly busting it now.
    revalidateTag(body._type, 'max')
    if (body.slug) {
      revalidateTag(`${body._type}:${body.slug}`, 'max')
    }

    return Response.json({ revalidated: true, type: body._type, slug: body.slug ?? null })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(message, { status: 500 })
  }
}
