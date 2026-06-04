import { archiveEntry } from './documents/archiveEntry'
import { bogerPage } from './documents/bogerPage'
import { foredragPage } from './documents/foredragPage'
import { historienPage } from './documents/historienPage'
import { homePage } from './documents/homePage'
import { kulturenPage } from './documents/kulturenPage'
import { landscape } from './documents/landscape'
import { page } from './documents/page'
import { siteSettings } from './documents/siteSettings'
import { cardGrid } from './objects/blocks/cardGrid'
import { flagHero } from './objects/blocks/flagHero'
import { hymnHero } from './objects/blocks/hymnHero'
import { hymnal } from './objects/blocks/hymnal'
import { locationGrid } from './objects/blocks/locationGrid'
import { nextEssay } from './objects/blocks/nextEssay'
import { pullQuote } from './objects/blocks/pullQuote'
import { scriptureStrip } from './objects/blocks/scriptureStrip'
import { stations } from './objects/blocks/stations'
import { statsBar } from './objects/blocks/statsBar'
import { steppedList } from './objects/blocks/steppedList'
import { themes } from './objects/blocks/themes'
import { vinylHero } from './objects/blocks/vinylHero'
import { cta } from './objects/cta'
import { footerColumn } from './objects/footerColumn'
import { footerQuote } from './objects/footerQuote'
import { historienEra } from './objects/historienEra'
import { kulturenSideNote } from './objects/kulturenSideNote'
import { kulturenTimeline } from './objects/kulturenTimeline'
import { kulturenTimelineEntry } from './objects/kulturenTimelineEntry'
import { masthead } from './objects/masthead'
import { navGroup } from './objects/navGroup'
import { navLink } from './objects/navLink'
import { seo } from './objects/seo'
import { tickerItem } from './objects/tickerItem'
import { timelineEvent } from './objects/timelineEvent'
import { vinylTile } from './objects/vinylTile'
import { vinylTrack } from './objects/vinylTrack'

export const schemaTypes = [
  // Documents
  siteSettings,
  homePage,
  kulturenPage,
  historienPage,
  foredragPage,
  bogerPage,
  landscape,
  archiveEntry,
  page,
  // Objects
  masthead,
  navLink,
  navGroup,
  cta,
  footerColumn,
  footerQuote,
  seo,
  tickerItem,
  vinylTrack,
  vinylTile,
  timelineEvent,
  kulturenSideNote,
  kulturenTimeline,
  kulturenTimelineEntry,
  historienEra,
  // Block menu (Step 7b)
  vinylHero,
  steppedList,
  cardGrid,
  pullQuote,
  nextEssay,
  hymnHero,
  scriptureStrip,
  stations,
  hymnal,
  flagHero,
  statsBar,
  themes,
  locationGrid,
]
