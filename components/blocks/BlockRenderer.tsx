import type { PAGE_QUERY_RESULT } from '@/sanity/types'

import { CardGrid } from './CardGrid'
import { HymnHero } from './HymnHero'
import { Hymnal } from './Hymnal'
import { NextEssay } from './NextEssay'
import { PullQuote } from './PullQuote'
import { ScriptureStrip } from './ScriptureStrip'
import { Stations } from './Stations'
import { SteppedList } from './SteppedList'
import { VinylHero } from './VinylHero'

type Blocks = NonNullable<PAGE_QUERY_RESULT>['blocks']
type Block = NonNullable<Blocks>[number]

// Maps each block in a `page`'s body to its component (best-practices §6 spirit:
// typed dispatch, no graceful degradation). Required inner fields are trusted —
// the schema's Rule.required() blocks publishing a malformed block.
export function BlockRenderer({ blocks }: { blocks: Blocks }) {
  return (
    <>
      {(blocks ?? []).map((block: Block) => {
        switch (block._type) {
          case 'vinylHero':
            return <VinylHero key={block._key} data={block} />
          case 'steppedList':
            return <SteppedList key={block._key} data={block} />
          case 'cardGrid':
            return <CardGrid key={block._key} data={block} />
          case 'pullQuote':
            return <PullQuote key={block._key} data={block} />
          case 'nextEssay':
            return <NextEssay key={block._key} data={block} />
          case 'hymnHero':
            return <HymnHero key={block._key} data={block} />
          case 'scriptureStrip':
            return <ScriptureStrip key={block._key} data={block} />
          case 'stations':
            return <Stations key={block._key} data={block} />
          case 'hymnal':
            return <Hymnal key={block._key} data={block} />
          default:
            return null
        }
      })}
    </>
  )
}
