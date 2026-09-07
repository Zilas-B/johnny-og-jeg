import { expect, test } from '@playwright/test'

import { widthOf } from './viewport'

// The Milestone Carousel on mobile (#32). Same pattern and same limits as
// nav-drawer.spec.ts (#29) and home-blocks.spec.ts (#31), per docs/TechStack.md's
// Testing row: one component, its ticket's acceptance criteria and nothing else,
// skipped at the widths they do not apply to. None of these — an animation that
// stops, a scroll container that snaps, a card that leaves the next one peeking —
// is visible to a screenshot.
//
// 768px is the breakpoint the CSS Module uses, so it is narrow here.

const NARROW_MAX_WIDTH = 768

const CAROUSEL = '[data-milestone-carousel]'
const MILESTONE = '[data-milestone]'

/** The card width in SetlistTicker.module.css is `flex: 0 0 85%`. */
const PEEK = { min: 0.1, max: 0.2 }

test.describe('narrow: the Milestone Carousel is reader-driven', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > NARROW_MAX_WIDTH, 'wide viewport')
    await page.goto('/')
  })

  test('the auto-scroll animation is off', async ({ page }) => {
    const animation = await page
      .locator(`${CAROUSEL} > div`)
      .evaluate((el) => getComputedStyle(el).animationName)
    expect(animation).toBe('none')
  })

  test('the strip scrolls horizontally and snaps one Milestone at a time', async ({ page }) => {
    const strip = page.locator(CAROUSEL)

    const style = await strip.evaluate((el) => {
      const s = getComputedStyle(el)
      return { overflowX: s.overflowX, snap: s.scrollSnapType }
    })
    expect(['auto', 'scroll']).toContain(style.overflowX)
    expect(style.snap).toContain('x')

    const scrollable = await strip.evaluate((el) => el.scrollWidth > el.clientWidth)
    expect(scrollable, 'the strip has nothing to scroll to').toBe(true)

    const align = await page
      .locator(MILESTONE)
      .first()
      .evaluate((el) => getComputedStyle(el).scrollSnapAlign)
    expect(align).toContain('start')
  })

  test('the next Milestone is about 15% visible at the right edge', async ({ page }) => {
    const { card, strip } = await page.locator(CAROUSEL).evaluate((el) => ({
      strip: el.clientWidth,
      card: el.querySelector('[data-milestone]')!.getBoundingClientRect().width,
    }))
    const peek = 1 - card / strip
    expect(peek).toBeGreaterThan(PEEK.min)
    expect(peek).toBeLessThan(PEEK.max)
  })

  test('the loop copy is dropped, so each Milestone is swiped once', async ({ page }) => {
    await expect(page.locator('[data-milestone-loop-copy]').first()).toBeHidden()
  })

  // Scoped to what the strip contributes, not to the document's absolute
  // width: `/` still carries residual overflow from #28
  // (docs/responsive-overflow.md), which this ticket does not own. Asserting
  // `scrollWidth <= clientWidth` here would go red and green on causes outside
  // #32. The delta across a scroll is the criterion.
  test('the strip scrolls inside itself, not the document', async ({ page }) => {
    const strip = page.locator(CAROUSEL)
    const before = await page.evaluate(() => document.documentElement.scrollWidth)

    await strip.evaluate((el) => el.scrollBy(el.clientWidth, 0))
    await expect.poll(() => strip.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)

    const doc = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      scrollLeft: document.documentElement.scrollLeft,
    }))
    expect(doc.scrollWidth, 'the strip widened the document').toBe(before)
    expect(doc.scrollLeft, 'the strip dragged the document sideways').toBe(0)
  })
})

test.describe('wide: the Milestone Carousel still auto-scrolls', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) <= NARROW_MAX_WIDTH, 'narrow viewport')
    await page.goto('/')
  })

  test('the auto-scroll runs and the strip is clipped, not scrollable', async ({ page }) => {
    const track = await page
      .locator(`${CAROUSEL} > div`)
      .evaluate((el) => getComputedStyle(el).animationName)
    expect(track).not.toBe('none')

    const overflowX = await page.locator(CAROUSEL).evaluate((el) => getComputedStyle(el).overflowX)
    expect(overflowX).toBe('hidden')
  })

  test('the animation is off when the reader asks for reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const animation = await page
      .locator(`${CAROUSEL} > div`)
      .evaluate((el) => getComputedStyle(el).animationName)
    expect(animation).toBe('none')
  })
})
