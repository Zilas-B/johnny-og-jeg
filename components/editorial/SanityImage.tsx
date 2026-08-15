import Image from 'next/image'
import type { CSSProperties } from 'react'

import { urlFor } from '@/sanity/image'

// The Sanity image pipeline + next/image wrapper. Reads
// width/height from asset.metadata.dimensions, blurs from lqip, trusts the
// schema-required `alt`. Two modes: a sized image (pass `width`) or a `fill`
// layer for backgrounds (parent must be positioned). The adapter layer if the
// CMS ever changes — no raw <img> anywhere else.
type ImageInput =
  | {
      asset?: {
        _id?: string | null
        metadata?: {
          dimensions?: { width?: number | null; height?: number | null } | null
          lqip?: string | null
        } | null
      } | null
      alt?: string | null
    }
  | null
  | undefined

type CommonProps = {
  image: ImageInput
  sizes?: string
  className?: string
  style?: CSSProperties
  priority?: boolean
}

type Props = CommonProps & ({ fill: true; width?: never } | { fill?: false; width: number })

export function SanityImage({ image, sizes, className, style, priority, fill, width }: Props) {
  if (!image?.asset?._id) return null

  const dimensions = image.asset.metadata?.dimensions
  const lqip = image.asset.metadata?.lqip ?? undefined
  const alt = image.alt ?? ''
  const blur = lqip ? { placeholder: 'blur' as const, blurDataURL: lqip } : {}

  if (fill) {
    return (
      <Image
        src={urlFor(image).auto('format').url()}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        style={style}
        {...blur}
      />
    )
  }

  const w = width
  const h =
    dimensions?.width && dimensions?.height
      ? Math.round((w / dimensions.width) * dimensions.height)
      : w

  return (
    <Image
      src={urlFor(image).width(w).auto('format').url()}
      alt={alt}
      width={w}
      height={h}
      sizes={sizes}
      priority={priority}
      className={className}
      style={style}
      {...blur}
    />
  )
}
