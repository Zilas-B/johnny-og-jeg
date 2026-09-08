import { expect, test } from '@playwright/test'

import { boxesOf, expectStacked, tracksOf, widthOf } from './viewport'

// A landscape page on mobile (#37). Same shape and same limits as
// kulturen.spec.ts (#34) — a fixed-px hero column and a four-column nav grid,
// both lifted from the same claude-design-template shape — per
// docs/TechStack.md's Testing row: one page, its ticket's acceptance criteria
// and nothing else. Horizontal overflow is not asserted here — overflow.spec.ts
// already runs every sitemap route at every width and names the offending
// elements when it fails.
//
// /naturen stands in for the eight landscape routes: they all render the same
// three components (LandscapeHero, LandscapePosts, LandscapeSiblings) off the
// same query shape, so one route exercises the shared CSS. The article feed
// (LandscapePosts' `.entry` grid) has no authored entries on any landscape
// route yet — its narrow-width rule is left in the stylesheet ready for
// content, per docs/responsive-overflow.md, but is not exercised by a real
// page here.
const ROUTE = '/naturen'

// Two thresholds, both from the breakpoint ladder in styles/tokens.css,
// matching Kulturen's own landHead/chipsGrid fix exactly (#34): the hero's
// numeral column gives way at 1024px, and the sibling grid folds the rest of
// the way to one column at 560px.
const HERO_MAX_WIDTH = 1024
const ONE_SIBLING_MAX_WIDTH = 560

const HERO_GRID = '[data-landscape-hero-grid]'
const HERO_RN = '[data-landscape-hero-rn]'
const HERO_TITLES = '[data-landscape-hero-titles]'
const SIBLINGS_GRID = '[data-landscape-siblings-grid]'
const SIBLING_CELL = '[data-landscape-sibling-cell]'
const EMPTY_CARD = '[data-landscape-empty]'

test.describe('narrow: the hero column stacks', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > HERO_MAX_WIDTH, 'wide viewport')
    await page.goto(ROUTE)
  })

  test('no fixed px column is left in the hero', async ({ page }) => {
    expect(await tracksOf(page.locator(HERO_GRID))).toHaveLength(1)

    // The numeral reads as the section's opening, so it stays above the title.
    expectStacked([...(await boxesOf(page.locator(HERO_RN))), ...(await boxesOf(page.locator(HERO_TITLES)))])
  })
})

test.describe('narrow: the sibling grid folds', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > HERO_MAX_WIDTH, 'wide viewport')
    await page.goto(ROUTE)
  })

  test('down to two columns or one', async ({ page }, testInfo) => {
    const expected = widthOf(testInfo.project.use.viewport?.width) <= ONE_SIBLING_MAX_WIDTH ? 1 : 2
    expect(await tracksOf(page.locator(SIBLINGS_GRID))).toHaveLength(expected)

    if (expected === 1) expectStacked(await boxesOf(page.locator(SIBLING_CELL)))
  })
})

// #37 also asks that the shared PortableText serializer (drop caps, image
// captions, indentation) hold up at 320px. It renders here as the empty-state
// card's body copy — the only PortableText usage on a landscape route today,
// since no route has authored feed entries yet.
test.describe('narrow: the empty-state card fits without clipping', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > HERO_MAX_WIDTH, 'wide viewport')
    await page.goto(ROUTE)
  })

  test('the card and its PortableText body stay inside the viewport', async ({ page }) => {
    const card = page.locator(EMPTY_CARD)
    const fits = await card.evaluate((el) => el.scrollWidth <= document.documentElement.clientWidth + 1)
    expect(fits, 'the empty-state card overflows the viewport').toBe(true)
  })
})

test.describe('wide: the landscape page keeps its desktop grids', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) <= HERO_MAX_WIDTH, 'narrow viewport')
    await page.goto(ROUTE)
  })

  test('a 280px numeral column and four siblings to a row', async ({ page }) => {
    const [first] = await tracksOf(page.locator(HERO_GRID))
    expect(first).toBe('280px')
    expect(await tracksOf(page.locator(SIBLINGS_GRID))).toHaveLength(4)
  })
})
