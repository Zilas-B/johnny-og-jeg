import { expect, test } from '@playwright/test'

// Masthead and Colophon on mobile (#30). Both are in every page's chrome, so
// the rules here have site-wide effect and are worth pinning down once.
//
// Same shape as nav-drawer.spec.ts (#29), and the same stated deviation from
// docs/TechStack.md's "viewport smoke tests only": the acceptance criteria are
// about which elements exist, where they sit and how big they are, none of
// which a screenshot artefact can assert. The breakpoint is `max-width: 768px`,
// matching the Nav Drawer, so the whole chrome switches to its mobile form at
// one width; 320/375/768 exercise it and 1280 asserts the desktop form.

const MOBILE_MAX_WIDTH = 768

function widthOf(width: number | undefined): number {
  if (!width) throw new Error('project has no viewport width')
  return width
}

test.describe('narrow: masthead reduced to its wordmark, colophon stacked', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > MOBILE_MAX_WIDTH, 'wide viewport')
    await page.goto('/')
  })

  // `data-masthead-side` marks the two flanking blocks so the assertion does
  // not depend on the lines an editor happens to have published.
  test('the flanking colophon lines are hidden', async ({ page }) => {
    const sides = page.locator('header [data-masthead-side]')
    await expect(sides).toHaveCount(2)
    await expect(sides.first()).toBeHidden()
    await expect(sides.last()).toBeHidden()
  })

  test('the wordmark is centred and reduced in size', async ({ page }) => {
    const name = page.getByRole('banner').getByText('Johnny & jeg')
    const box = (await name.boundingBox())!
    // clientWidth, not viewportSize: it excludes a classic scrollbar, which
    // shifts the true centre. overflow.spec.ts measures the same way.
    const layoutWidth = await page.evaluate(() => document.documentElement.clientWidth)

    // Centred within a pixel or two of the layout viewport's middle.
    expect(Math.abs(box.x + box.width / 2 - layoutWidth / 2)).toBeLessThan(2)

    // Reduced from the 52px desktop size.
    const size = await name.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    expect(size).toBeLessThanOrEqual(40)
  })

  test('the double rule under the wordmark is kept', async ({ page }) => {
    const style = await page
      .locator('header')
      .evaluate((el) => getComputedStyle(el).borderBottomStyle)
    expect(style).toBe('double')
  })

  test('the masthead scrolls away; the navigation bar stays stuck', async ({ page }) => {
    await page.mouse.wheel(0, 800)
    await expect
      .poll(async () => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(200)

    const mast = (await page.locator('header').boundingBox())!
    expect(mast.y + mast.height).toBeLessThan(0)

    const nav = (await page.getByRole('navigation', { name: 'Primær' }).boundingBox())!
    expect(nav.y).toBeLessThan(1)
  })

  test('the colophon columns are stacked, brand block first', async ({ page }) => {
    const columns = page.locator('footer [data-colophon-column]')
    await expect(columns).toHaveCount(4)

    const boxes = await columns.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect()
        return { x: Math.round(r.x), y: Math.round(r.y) }
      }),
    )

    // One column: same left edge, strictly increasing tops.
    const [first] = boxes
    for (const box of boxes) expect(box.x).toBe(first.x)
    for (let i = 1; i < boxes.length; i++) expect(boxes[i].y).toBeGreaterThan(boxes[i - 1].y)
  })

  test('every colophon link is at least a 44×44px touch target', async ({ page }) => {
    const small = await page.evaluate(() => {
      const root = document.querySelector('footer')!
      return Array.from(root.querySelectorAll('a'))
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        .filter(({ r }) => r.height < 44 || r.width < 44)
        .map(({ el, r }) => `${el.textContent?.trim()} → ${Math.round(r.width)}×${Math.round(r.height)}`)
    })
    expect(small, `targets under 44×44:\n${small.join('\n')}`).toEqual([])
  })
})

test.describe('wide: both keep their full layout', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) <= MOBILE_MAX_WIDTH, 'narrow viewport')
    await page.goto('/')
  })

  test('the colophon lines flank the wordmark', async ({ page }) => {
    const left = page.locator('header [data-masthead-side]').first()
    const right = page.locator('header [data-masthead-side]').last()
    await expect(left).toBeVisible()
    await expect(right).toBeVisible()

    const name = (await page.getByRole('banner').getByText('Johnny & jeg').boundingBox())!
    expect((await left.boundingBox())!.x).toBeLessThan(name.x)
    expect((await right.boundingBox())!.x).toBeGreaterThan(name.x)
  })

  test('the colophon keeps its four columns on one row', async ({ page }) => {
    const tops = await page
      .locator('footer [data-colophon-column]')
      .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().y)))
    expect(tops).toHaveLength(4)
    for (const top of tops) expect(top).toBe(tops[0])
  })
})

test.describe('every width: the chrome stays inside the viewport', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // The two chrome components are the same code at every width, and the
  // criterion is "no horizontal overflow at any of the four widths".
  test('nothing in the masthead or the colophon overflows sideways', async ({ page }) => {
    // Scoped to the two chrome components: the page between them still
    // overflows at the narrow widths (#31-#39), which overflow.spec.ts records.
    const offenders = await page.evaluate(() => {
      const limit = document.documentElement.clientWidth
      return ['header', 'footer']
        .map((s) => document.querySelector(s))
        .filter((el): el is Element => el !== null)
        .flatMap((root) =>
          [root, ...Array.from(root.querySelectorAll('*'))]
            .map((el) => ({ el, r: el.getBoundingClientRect() }))
            .filter(({ r }) => r.width > 0 && r.right > limit + 1)
            .map(({ el, r }) => `${el.tagName.toLowerCase()} -> right edge at ${Math.round(r.right)}px`),
        )
    })
    expect(offenders).toEqual([])
  })
})
