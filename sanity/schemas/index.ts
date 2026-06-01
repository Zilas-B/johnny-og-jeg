import { siteSettings } from './documents/siteSettings'
import { cta } from './objects/cta'
import { footerColumn } from './objects/footerColumn'
import { footerQuote } from './objects/footerQuote'
import { masthead } from './objects/masthead'
import { navGroup } from './objects/navGroup'
import { navLink } from './objects/navLink'

export const schemaTypes = [
  // Documents
  siteSettings,
  // Objects
  masthead,
  navLink,
  navGroup,
  cta,
  footerColumn,
  footerQuote,
]
