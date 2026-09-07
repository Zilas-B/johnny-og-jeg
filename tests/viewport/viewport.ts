import type { Page } from '@playwright/test'

// Helpers shared by the per-component specs (nav-drawer #29, masthead-footer
// #30, home-blocks #31). Each spec runs once per width project — see
// playwright.config.ts — so each one needs its own width and each one measures
// the viewport the same way. Extracted at the third copy.

/** The running project's viewport width; the spec cannot run without one. */
export function widthOf(width: number | undefined): number {
  if (!width) throw new Error('project has no viewport width')
  return width
}

/**
 * The layout viewport's width — `clientWidth`, not `viewportSize`, because it
 * excludes a classic scrollbar, which shifts both the true centre and the true
 * right edge. overflow.spec.ts measures the same way.
 */
export function layoutWidth(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.clientWidth)
}
