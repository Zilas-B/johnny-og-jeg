import type { HOME_PAGE_QUERY_RESULT, PAGE_QUERY_RESULT } from '@/sanity/types'

import { ContactSection } from '@/components/hub/ContactSection'
import { HistoricalThread } from '@/components/hub/HistoricalThread'
import { HubHero } from '@/components/hub/HubHero'
import { HubVinyls } from '@/components/hub/HubVinyls'
import { Hymn } from '@/components/hub/Hymn'
import { SetlistTicker } from '@/components/hub/SetlistTicker'

import { CardGrid } from './CardGrid'
import { FlagHero } from './FlagHero'
import { HymnHero } from './HymnHero'
import { Hymnal } from './Hymnal'
import { LocationGrid } from './LocationGrid'
import { NextEssay } from './NextEssay'
import { PullQuote } from './PullQuote'
import { ScriptureStrip } from './ScriptureStrip'
import { Stations } from './Stations'
import { StatsBar } from './StatsBar'
import { SteppedList } from './SteppedList'
import { Themes } from './Themes'
import { VinylHero } from './VinylHero'

// Serves both the essay `page` blocks and the home `homePage` blocks (Step 7e).
// Typed as an *array of the union* (not a union of arrays) so `.map` typechecks;
// `PageBlock[]` and `HomeBlock[]` are both assignable to `AnyBlock[]` by array
// covariance. Required inner fields are trusted (best-practices §6 spirit:
// typed dispatch, no graceful degradation) — the schema's Rule.required() blocks
// publishing a malformed block.
type AnyBlock =
  | NonNullable<NonNullable<PAGE_QUERY_RESULT>['blocks']>[number]
  | NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>['blocks']>[number]

export function BlockRenderer({ blocks }: { blocks: AnyBlock[] | null | undefined }) {
  return (
    <>
      {(blocks ?? []).map((block: AnyBlock) => {
        switch (block._type) {
          // --- Essay blocks (Step 7b) ---
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
          case 'flagHero':
            return <FlagHero key={block._key} data={block} />
          case 'statsBar':
            return <StatsBar key={block._key} data={block} />
          case 'themes':
            return <Themes key={block._key} data={block} />
          case 'locationGrid':
            return <LocationGrid key={block._key} data={block} />
          // --- Home blocks (Step 7e) ---
          case 'hubHero':
            return <HubHero key={block._key} hero={block.hero!} sig={block.signatureCard!} />
          case 'setlistTicker':
            return <SetlistTicker key={block._key} items={block.items!} />
          case 'hubVinyls':
            return <HubVinyls key={block._key} data={block} />
          case 'historicalThread':
            return <HistoricalThread key={block._key} data={block} />
          case 'hymn':
            return <Hymn key={block._key} data={block} />
          case 'contact':
            return <ContactSection key={block._key} data={block} />
          default:
            return null
        }
      })}
    </>
  )
}
