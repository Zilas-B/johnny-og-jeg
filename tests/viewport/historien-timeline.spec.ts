import { expect, test } from '@playwright/test'

import { boxesOf, expectStacked, widthOf } from './viewport'

// Historien on mobile (#33). Same shape and same limits as home-blocks.spec.ts
// (#31) and milestone-carousel.spec.ts (#32), per docs/TechStack.md's Testing
// row: one page, its ticket's acceptance criteria and nothing else, skipped at
// the widths they do not apply to. Horizontal overflow is not asserted here —
// overflow.spec.ts already runs every sitemap route at every width and names
// the offending elements when it fails.
//
// One threshold, not the usual two: the whole page reaches its narrow layout at
// 1024px. Six 1fr timeline columns are already ~150px each there — the width
// #33 calls too narrow to follow a sequence in — so the strip reflows on the
// same breakpoint as the spreads it sits between.
const NARROW_MAX_WIDTH = 1024

const TIMELINE = '[data-timeline]'
const POINT = '[data-timeline-point]'
const YEAR = '[data-timeline-year]'
const NAME = '[data-timeline-name]'
const ERA = '[data-era]'
const PHOTO = '[data-era-photo]'
const TEXT = '[data-era-text]'

const ERA_COUNT = 6

/** Below this a phone reader pinches to zoom — names and their years both. */
const MIN_READABLE_PX = 12

test.describe('narrow: the timeline is a vertical list', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > NARROW_MAX_WIDTH, 'wide viewport')
    await page.goto('/historien')
  })

  test('the six-column grid is gone — one track, six rows', async ({ page }) => {
    const tracks = await page
      .locator(TIMELINE)
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length)
    expect(tracks, 'the timeline still has more than one column').toBe(1)

    const points = await boxesOf(page.locator(POINT))
    expect(points).toHaveLength(ERA_COUNT)
    expectStacked(points)
  })

  test('every year sits in the same left gutter, beside its name', async ({ page }) => {
    const rows = await page.locator(POINT).evaluateAll(
      (els, sel) =>
        els.map((el) => ({
          year: el.querySelector(sel.year)!.getBoundingClientRect(),
          name: el.querySelector(sel.name)!.getBoundingClientRect(),
        })),
      { year: YEAR, name: NAME },
    )

    expect(rows).toHaveLength(ERA_COUNT)
    const gutter = rows[0].year.left
    for (const [i, row] of rows.entries()) {
      expect(row.year.left, `year ${i + 1} is not aligned with the others`).toBeCloseTo(gutter, 0)
      expect(row.year.right, `year ${i + 1} overlaps its name`).toBeLessThanOrEqual(row.name.left)
      expect(row.name.left, `name ${i + 1} is not to the right of the gutter`).toBeGreaterThan(row.year.left)
    }
  })

  test('each point is readable without zoom, and none of it is clipped', async ({ page }) => {
    for (const selector of [NAME, YEAR]) {
      const cells = await page.locator(selector).evaluateAll((els) =>
        els.map((el) => ({
          fontSize: parseFloat(getComputedStyle(el).fontSize),
          fits: el.scrollWidth <= el.clientWidth + 1,
        })),
      )
      expect(cells).toHaveLength(ERA_COUNT)
      for (const [i, cell] of cells.entries()) {
        expect(cell.fontSize, `${selector} ${i + 1} is set too small to read`).toBeGreaterThanOrEqual(
          MIN_READABLE_PX,
        )
        expect(cell.fits, `${selector} ${i + 1} is clipped`).toBe(true)
      }
    }
  })

  test('every era spread stacks photo-first, mirrored acts included', async ({ page }) => {
    const eras = page.locator(ERA)
    await expect(eras).toHaveCount(ERA_COUNT)

    for (let i = 0; i < ERA_COUNT; i++) {
      const era = eras.nth(i)
      expectStacked([...(await boxesOf(era.locator(PHOTO))), ...(await boxesOf(era.locator(TEXT)))])
    }
  })
})

test.describe('wide: the timeline is still a six-column strip', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) <= NARROW_MAX_WIDTH, 'narrow viewport')
    await page.goto('/historien')
  })

  test('six columns on one row', async ({ page }) => {
    const tracks = await page
      .locator(TIMELINE)
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length)
    expect(tracks).toBe(ERA_COUNT)
  })

  test('the mirrored acts still put the photo on the right', async ({ page }) => {
    const act = page.locator(ERA).nth(1)
    const [photo] = await boxesOf(act.locator(PHOTO))
    const [text] = await boxesOf(act.locator(TEXT))
    expect(photo.x).toBeGreaterThan(text.x)
  })
})
