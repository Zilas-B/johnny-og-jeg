import { expect, test } from '@playwright/test'

import { boxesOf, expectTappable, tracksOf, widthOf } from './viewport'

// Bøger on mobile (#39). Same shape as foredrag.spec.ts (#38) and kulturen.spec.ts
// (#34): one page, its ticket's acceptance criteria and nothing else. Horizontal
// overflow is not asserted here — overflow.spec.ts already runs every sitemap
// route at every width and names the offending elements when it fails.
//
// SPLIT_MAX_WIDTH is the breakpoint ladder's 1024px step, per docs/TechStack.md
// — the hero, index bar, book entries and invitation all give way there. The
// verdict box (`1fr auto`) has room beside its badge until the next step down,
// same shape as Stations' 110px column (#36), so it gets its own threshold.
const SPLIT_MAX_WIDTH = 1024
const VERDICT_MAX_WIDTH = 768

const HERO_GRID = '[data-boger-hero-grid]'
const INDEX_GRID = '[data-boger-index-grid]'
const FILTERS = '[data-boger-filters]'
const FILTER = '[data-boger-filter]'
const ENTRY = '[data-boger-entry]'
const COVER = '[data-boger-cover]'
const VERDICT = '[data-boger-verdict]'
const INVITE_GRID = '[data-boger-invite-grid]'

const ROUTE = '/boeger-spil-film'

test.describe('narrow: the hero, index bar, entries and invitation stack', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > SPLIT_MAX_WIDTH, 'wide viewport')
    await page.goto(ROUTE)
  })

  test('the hero, index bar, entry and invitation grids are one column', async ({ page }) => {
    for (const grid of [HERO_GRID, INDEX_GRID, INVITE_GRID]) {
      expect(await tracksOf(page.locator(grid)), `${grid} kept a second track`).toHaveLength(1)
    }
    const entries = await page.locator(ENTRY).all()
    expect(entries.length).toBeGreaterThan(0)
    for (const entry of entries) {
      expect(await tracksOf(entry), 'an entry kept its 280px 1fr split').toHaveLength(1)
    }
  })

  test('the cover never forces the viewport past its own width', async ({ page }) => {
    const covers = await page.locator(COVER).all()
    expect(covers.length).toBeGreaterThan(0)
    for (const cover of covers) {
      // computed width, not the rotated element's bounding box (#39's cover
      // keeps the template's -1.2deg tilt, which widens the box slightly).
      const width = await cover.evaluate((el) => parseFloat(getComputedStyle(el).width))
      expect(width).toBeLessThanOrEqual(240)
    }
  })
})

test.describe('narrow: the category filter is finger-friendly and still works', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > SPLIT_MAX_WIDTH, 'wide viewport')
    await page.goto(ROUTE)
  })

  test('every filter is a 44px target', async ({ page }) => {
    await expectTappable(page.locator(FILTER))
  })

  test('tapping a category still filters the entries', async ({ page }) => {
    const filmTab = page.locator(FILTER, { hasText: 'Film' })
    await filmTab.click()

    const booksEntries = page.locator(ENTRY)
    await expect(booksEntries.first()).toBeHidden()
  })

  test('the filter bar does not overrun the viewport', async ({ page }) => {
    const filtersBox = await page.locator(FILTERS).evaluate((el) => el.getBoundingClientRect().right)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(filtersBox).toBeLessThanOrEqual(clientWidth + 1)
  })
})

test.describe('narrow: the verdict box folds under 768px', () => {
  test('one column at or below 768px, two above it (up to the 1024px split)', async ({ page }, testInfo) => {
    const width = widthOf(testInfo.project.use.viewport?.width)
    test.skip(width > SPLIT_MAX_WIDTH, 'wide viewport')
    await page.goto(ROUTE)

    const expected = width <= VERDICT_MAX_WIDTH ? 1 : 2
    expect(await tracksOf(page.locator(VERDICT).first())).toHaveLength(expected)
  })
})

test.describe('wide: Bøger keeps its desktop grids', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) <= SPLIT_MAX_WIDTH, 'narrow viewport')
    await page.goto(ROUTE)
  })

  test('the entry keeps its cover column beside the text', async ({ page }) => {
    const entry = page.locator(ENTRY).first()
    const [cover] = await boxesOf(entry.locator(COVER))
    const [text] = await boxesOf(entry.locator('> *').nth(1))
    expect(text.x).toBeGreaterThan(cover.x)
  })

  test('the invitation keeps its two-column split', async ({ page }) => {
    expect(await tracksOf(page.locator(INVITE_GRID))).toHaveLength(2)
  })
})
