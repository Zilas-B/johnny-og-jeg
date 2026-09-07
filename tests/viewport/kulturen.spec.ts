import { expect, test, type Page } from '@playwright/test'

import { boxesOf, expectStacked, expectTappable, tracksOf, widthOf } from './viewport'

// Kulturen on mobile (#34). Same shape and same limits as home-blocks.spec.ts
// (#31) and historien-timeline.spec.ts (#33), per docs/TechStack.md's Testing
// row: one page, its ticket's acceptance criteria and nothing else, skipped at
// the widths they do not apply to. Horizontal overflow is not asserted here —
// overflow.spec.ts already runs every sitemap route at every width and names
// the offending elements when it fails.
//
// Two thresholds, both from the breakpoint ladder in styles/tokens.css. The
// page's four splits and the sticky sub-nav give way at 1024px; the chip grid
// goes the rest of the way to one column at 560px, because a 30px display name
// in a half-width chip is what "efter hvad der er læsbart" rules out.
const SPLIT_MAX_WIDTH = 1024
const ONE_CHIP_MAX_WIDTH = 560

const SUBNAV = '[data-kulturen-subnav]'
const SUBNAV_ITEM = '[data-kulturen-subnav-item]'
const CHIPS = '[data-kulturen-chips]'
const CHIP = '[data-kulturen-chip]'
const LAND = '[data-kulturen-land]'
const LAND_HEAD = '[data-kulturen-land-head]'
const LAND_RN = '[data-kulturen-land-rn]'
const LAND_TITLES = '[data-kulturen-land-titles]'
const LAND_BODY = '[data-kulturen-land-body]'
const ESSAY = '[data-kulturen-land-essay]'
const SIDE = '[data-kulturen-land-side]'
const INTRO = '[data-kulturen-intro]'
const OUTRO = '[data-kulturen-outro]'
const COLUMN = '[data-kulturen-column]'
/** The chrome's sticky bar; #34 does not own it, so it is matched by its label. */
const NAV = 'nav[aria-label="Primær"]'

/**
 * How many Landscapes the page rendered. Counted, not hardcoded: the Landscapes
 * are Sanity documents, and #24 makes the same point about the route list — a
 * fixed number quietly stops describing the page the day an editor adds one.
 */
async function landscapeCount(page: Page): Promise<number> {
  const count = await page.locator(LAND).count()
  expect(count, 'the page rendered no Landscapes at all').toBeGreaterThan(1)
  return count
}

test.describe('narrow: the page folds to one column', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > SPLIT_MAX_WIDTH, 'wide viewport')
    await page.goto('/kulturen')
  })

  test('the chip grid is down to two columns or one', async ({ page }, testInfo) => {
    const expected = widthOf(testInfo.project.use.viewport?.width) <= ONE_CHIP_MAX_WIDTH ? 1 : 2
    expect(await tracksOf(page.locator(CHIPS))).toHaveLength(expected)

    const chips = await boxesOf(page.locator(CHIP))
    expect(chips).toHaveLength(await landscapeCount(page))
    if (expected === 1) expectStacked(chips)
  })

  test('no fixed px column is left in the landscape head', async ({ page }) => {
    const heads = page.locator(LAND_HEAD)
    await expect(heads).toHaveCount(await landscapeCount(page))
    for (let i = 0; i < (await heads.count()); i++) {
      expect(await tracksOf(heads.nth(i)), `landscape ${i + 1} kept two head columns`).toHaveLength(1)
    }

    // The numeral reads as the section's opening, so it stays above its titles.
    const land = page.locator(LAND).first()
    expectStacked([
      ...(await boxesOf(land.locator(LAND_RN))),
      ...(await boxesOf(land.locator(LAND_TITLES))),
    ])
  })

  test('every two-column split stacks, essay before sidebar', async ({ page }) => {
    for (const split of [INTRO, OUTRO]) {
      const columns = await boxesOf(page.locator(`${split} > ${COLUMN}`))
      expect(columns, `${split} did not render two columns`).toHaveLength(2)
      expectStacked(columns)
    }

    const bodies = page.locator(LAND_BODY)
    await expect(bodies).toHaveCount(await landscapeCount(page))
    for (let i = 0; i < (await bodies.count()); i++) {
      const body = bodies.nth(i)
      expectStacked([
        ...(await boxesOf(body.locator(ESSAY))),
        ...(await boxesOf(body.locator(SIDE))),
      ])
    }
  })
})

test.describe('narrow: the sticky sub-nav still works, by finger', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > SPLIT_MAX_WIDTH, 'wide viewport')
    await page.goto('/kulturen')
    // It reveals itself once the first landscape has passed the top edge.
    await page.locator(LAND).nth(1).scrollIntoViewIfNeeded()
    await expect
      .poll(() => page.locator(SUBNAV).evaluate((el) => getComputedStyle(el).opacity))
      .toBe('1')
  })

  test('every entry is a finger-sized target', async ({ page }) => {
    await expect(page.locator(SUBNAV_ITEM)).toHaveCount(await landscapeCount(page))
    await expectTappable(page.locator(SUBNAV_ITEM))
  })

  test('the entries scroll inside the bar, not the document', async ({ page }) => {
    const list = page.locator(`${SUBNAV} ol`)
    const style = await list.evaluate((el) => ({
      overflowX: getComputedStyle(el).overflowX,
      scrollable: el.scrollWidth > el.clientWidth,
    }))
    expect(['auto', 'scroll']).toContain(style.overflowX)
    // Any plausible number of Landscapes overruns a phone: each entry is at
    // least a 44px target and carries a poster-cased name beside it.
    expect(style.scrollable, 'the entries already fit — nothing to scroll').toBe(true)

    const before = await page.evaluate(() => document.documentElement.scrollWidth)
    await list.evaluate((el) => el.scrollBy(el.clientWidth, 0))
    await expect.poll(() => list.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(before)
  })

  test('tapping an entry jumps to that landscape', async ({ page }) => {
    const entry = page.locator(SUBNAV_ITEM).nth(4)
    const href = (await entry.getAttribute('href'))!
    await entry.click()

    const target = page.locator(`${LAND}${href}`)
    await expect(target).toHaveCount(1)
    await expect
      .poll(() => target.evaluate((el) => Math.round(el.getBoundingClientRect().top)))
      .toBeLessThan(200)
  })
})

// The bar's `top` is the primary nav's own height, written out in px on both
// sides of the 768px breakpoint. Asserted at every width, because the number
// that goes stale is the one nobody is looking at.
test.describe('every width: the sub-nav clears the chrome above it', () => {
  test('the bar sits below the sticky primary nav, not under it', async ({ page }) => {
    await page.goto('/kulturen')
    await page.locator(LAND).nth(1).scrollIntoViewIfNeeded()
    await expect
      .poll(() => page.locator(SUBNAV).evaluate((el) => getComputedStyle(el).opacity))
      .toBe('1')

    const navBottom = await page.locator(NAV).evaluate((el) => el.getBoundingClientRect().bottom)
    const subnavTop = await page.locator(SUBNAV).evaluate((el) => el.getBoundingClientRect().top)
    expect(subnavTop).toBeGreaterThanOrEqual(navBottom)
  })
})

test.describe('wide: Kulturen keeps its desktop grids', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) <= SPLIT_MAX_WIDTH, 'narrow viewport')
    await page.goto('/kulturen')
  })

  test('four chips to a row and a 220px numeral column', async ({ page }) => {
    expect(await tracksOf(page.locator(CHIPS))).toHaveLength(4)
    const [first] = await tracksOf(page.locator(LAND_HEAD).first())
    expect(first).toBe('220px')
  })

  test('the essay and its sidebar sit side by side', async ({ page }) => {
    const body = page.locator(LAND_BODY).first()
    const [essay] = await boxesOf(body.locator(ESSAY))
    const [side] = await boxesOf(body.locator(SIDE))
    expect(side.x).toBeGreaterThan(essay.x)
    expect(side.top).toBe(essay.top)
  })
})
