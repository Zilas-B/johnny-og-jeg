import { expect, test } from '@playwright/test'

import { boxesOf, expectStacked, expectTappable, tracksOf, widthOf } from './viewport'

// Foredrag on mobile (#38). Same shape as kulturen.spec.ts (#34): one page, its
// ticket's acceptance criteria and nothing else. Horizontal overflow is not
// asserted here — overflow.spec.ts already runs every sitemap route at every
// width and names the offending elements when it fails.
//
// One threshold from the breakpoint ladder in docs/TechStack.md: every split
// and grid the ticket lists gives way by 1024px. The one exception is
// .metaStack, which only needs the third breakpoint (560px) — three short
// label/value cells still fit a tablet-width column.
const SPLIT_MAX_WIDTH = 1024
const META_STACK_MAX_WIDTH = 560

const HERO_GRID = '[data-foredrag-hero-grid]'
const META_STACK = '[data-foredrag-meta-stack]'
const POSTERS = '[data-foredrag-posters]'
const POSTER = '[data-foredrag-poster]'
const PRACTICAL_HEAD = '[data-foredrag-practical-head]'
const PGRID = '[data-foredrag-pgrid]'
const VENUES_GRID = '[data-foredrag-venues-grid]'
const VENUE_ITEM = '[data-foredrag-venue-item]'
const BOOKING_GRID = '[data-foredrag-booking-grid]'
const FAQ_GRID = '[data-foredrag-faq-grid]'
const FORM = '[data-foredrag-form]'
const FORM_ROW = '[data-foredrag-form-row]'
const FORM_CONTROL = '[data-foredrag-form-control]'
const FORM_SUBMIT = '[data-foredrag-form-submit]'

test.describe('narrow: the two- and three-column spreads stack', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > SPLIT_MAX_WIDTH, 'wide viewport')
    await page.goto('/foredrag')
  })

  test('the hero, practical, venues and booking splits are one column', async ({ page }) => {
    for (const grid of [HERO_GRID, PRACTICAL_HEAD, VENUES_GRID, BOOKING_GRID]) {
      expect(await tracksOf(page.locator(grid)), `${grid} kept a second track`).toHaveLength(1)
    }
  })

  test('the poster and practical-cell grids are down to two columns or one', async ({ page }, testInfo) => {
    const width = widthOf(testInfo.project.use.viewport?.width)

    const posterTracks = await tracksOf(page.locator(POSTERS))
    expect(posterTracks).toHaveLength(width <= 768 ? 1 : 2)
    const posters = await boxesOf(page.locator(POSTER))
    expect(posters.length).toBeGreaterThan(1)
    if (width <= 768) expectStacked(posters)

    const pgridTracks = await tracksOf(page.locator(PGRID))
    expect(pgridTracks).toHaveLength(width <= 768 ? 1 : 2)
  })

  test('the venues grid unfolds to a stacked list', async ({ page }) => {
    expect(await tracksOf(page.locator(VENUE_ITEM).first())).toHaveLength(1)
    // Each row's three spans (year, place, city) read top to bottom now.
    const spans = await boxesOf(page.locator(VENUE_ITEM).first().locator('span'))
    expect(spans).toHaveLength(3)
    expectStacked(spans)
  })

  test('the FAQ grid is one column', async ({ page }) => {
    expect(await tracksOf(page.locator(FAQ_GRID))).toHaveLength(1)
  })
})

test.describe('narrow: the meta stack folds at 560px', () => {
  test('three columns above 560px, one at or below it', async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > SPLIT_MAX_WIDTH, 'wide viewport')
    await page.goto('/foredrag')
    const width = widthOf(testInfo.project.use.viewport?.width)
    const expected = width <= META_STACK_MAX_WIDTH ? 1 : 3
    expect(await tracksOf(page.locator(META_STACK))).toHaveLength(expected)
  })
})

test.describe('the booking form is finger-friendly and works by touch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/foredrag')
    await page.locator(FORM).scrollIntoViewIfNeeded()
  })

  test('every field and the submit button is a 44px target', async ({ page }) => {
    await expectTappable(page.locator(FORM_CONTROL))
    await expectTappable(page.locator(FORM_SUBMIT))
  })

  test('every field is at least 16px, so iOS never auto-zooms on focus', async ({ page }) => {
    const sizes = await page.locator(FORM_CONTROL).evaluateAll((els) =>
      els.map((el) => parseFloat(getComputedStyle(el).fontSize)),
    )
    for (const size of sizes) expect(size).toBeGreaterThanOrEqual(16)
  })

  test('the field rows stack under 768px', async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > 768, 'wide viewport')
    const rows = await page.locator(FORM_ROW).all()
    for (const row of rows) {
      const fields = await boxesOf(row.locator('> *'))
      expectStacked(fields)
    }
  })

  test('the form can be filled and submitted by touch', async ({ page }) => {
    await page.locator('#b-navn').click()
    await page.locator('#b-navn').fill('Jane Doe')
    await page.locator('#b-email').click()
    await page.locator('#b-email').fill('jane@example.dk')
    await page.locator(FORM_SUBMIT).click()
    await expect(page.getByText('Tak for din anmodning.')).toBeVisible()
  })
})

test.describe('wide: Foredrag keeps its desktop grids', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) <= SPLIT_MAX_WIDTH, 'narrow viewport')
    await page.goto('/foredrag')
  })

  test('three posters, four practical cells, side-by-side splits', async ({ page }) => {
    expect(await tracksOf(page.locator(POSTERS))).toHaveLength(3)
    expect(await tracksOf(page.locator(PGRID))).toHaveLength(4)
    for (const grid of [HERO_GRID, PRACTICAL_HEAD, VENUES_GRID, BOOKING_GRID]) {
      expect(await tracksOf(page.locator(grid)), `${grid} lost its second track`).toHaveLength(2)
    }
  })

  test('the venues list keeps its three-column row', async ({ page }) => {
    expect(await tracksOf(page.locator(VENUE_ITEM).first())).toHaveLength(3)
  })
})
