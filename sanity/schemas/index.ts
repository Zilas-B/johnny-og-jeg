import { homePage } from './documents/homePage'
import { siteSettings } from './documents/siteSettings'
import { cta } from './objects/cta'
import { footerColumn } from './objects/footerColumn'
import { footerQuote } from './objects/footerQuote'
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
]
