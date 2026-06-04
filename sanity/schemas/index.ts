import { archiveEntry } from './documents/archiveEntry'
import { homePage } from './documents/homePage'
import { kulturenPage } from './documents/kulturenPage'
import { landscape } from './documents/landscape'
import { page } from './documents/page'
import { siteSettings } from './documents/siteSettings'
import { cardGrid } from './objects/blocks/cardGrid'
import { nextEssay } from './objects/blocks/nextEssay'
import { pullQuote } from './objects/blocks/pullQuote'
import { steppedList } from './objects/blocks/steppedList'
import { vinylHero } from './objects/blocks/vinylHero'
import { cta } from './objects/cta'
import { footerColumn } from './objects/footerColumn'
import { footerQuote } from './objects/footerQuote'
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
  // Block menu (Step 7b)
  vinylHero,
  steppedList,
  cardGrid,
  pullQuote,
  nextEssay,
]
