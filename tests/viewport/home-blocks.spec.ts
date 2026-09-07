import { expect, test, type Locator } from '@playwright/test'

import { layoutWidth, widthOf } from './viewport'

// The front page's Blocks on mobile (#31): Hero Block with its Hero Foreword,
// the three Vinyl Tiles, the Teaser Overviews and the contact section. See
// CONTEXT.md for the terms. The Milestone Carousel belongs to #32 and is not
// asserted here.
//
// Same shape as masthead-footer.spec.ts (#30), and the deviation it rests on is
// now written into docs/TechStack.md's Testing row: a per-component spec is
// allowed for a ticket's acceptance criteria that a screenshot cannot see —
// widened in #31 from chrome to any component, and from behavioural criteria to
// layout ones. The `data-*` attributes are test hooks only; layout is styled
// through CSS Module classes as everywhere else.
//
// Two thresholds, both from docs/TechStack.md's three breakpoints: the Hero
// Block, the Vinyl Tiles and the contact columns collapse at 1024px (so every
// width the suite runs below 1280 is narrow for them), the Teaser Points and
// the form's own fields at 768px.

const COLUMN_MAX_WIDTH = 1024
const STACK_MAX_WIDTH = 768

type Box = { x: number; top: number; bottom: number }

/** Rounded boxes for every match, in document order. */
function boxesOf(locator: Locator): Promise<Box[]> {
  return locator.evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect()
      return { x: Math.round(r.x), top: Math.round(r.top), bottom: Math.round(r.bottom) }
    }),
  )
}

/** One column: a shared left edge, and each box starting below the last. */
function expectStacked(boxes: Box[]) {
  const [first] = boxes
  for (const box of boxes) expect(box.x).toBe(first.x)
  for (let i = 1; i < boxes.length; i++) {
    expect(boxes[i].top).toBeGreaterThanOrEqual(boxes[i - 1].bottom)
  }
}

test.describe('narrow: the Hero Block, the Vinyl Tiles and the contact section are one column', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > COLUMN_MAX_WIDTH, 'wide viewport')
    await page.goto('/')
  })

  test('the Hero Foreword sits below the title, upright and inside the page', async ({ page }) => {
    const title = (await page.getByRole('heading', { level: 1 }).boundingBox())!
    const foreword = page.locator('[data-hero-foreword]')
    const box = (await foreword.boundingBox())!

    expect(box.y).toBeGreaterThan(title.y + title.height)

    // The desktop card is rotated 1.4deg and pushed 28px right / 80px down out
    // of its column. Both are dropped here, so it reads straight and level.
    const transform = await foreword.evaluate((el) => getComputedStyle(el).transform)
    expect(transform).toBe('none')

    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual((await layoutWidth(page)) + 1)
  })

  test('the three Vinyl Tiles stack in one column', async ({ page }) => {
    const tiles = page.locator('[data-vinyl-tile]')
    await expect(tiles).toHaveCount(3)
    expectStacked(await boxesOf(tiles))
  })

  test('the contact section stacks its two columns', async ({ page }) => {
    const contact = page.locator('#kontakt')
    const booking = (await contact.locator('#foredrag').boundingBox())!
    const form = (await contact.locator('form').boundingBox())!
    expect(form.y).toBeGreaterThan(booking.y + booking.height)
  })
})

test.describe('narrow: the Teaser Points stack and the contact section is tappable', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > STACK_MAX_WIDTH, 'wide viewport')
    await page.goto('/')
  })

  test('the Teaser Points read as one list, four per Teaser Overview', async ({ page }) => {
    const points = page.locator('[data-teaser-point]')
    const count = await points.count()
    expect(count).toBeGreaterThanOrEqual(4)
    expect(count % 4).toBe(0)
    expectStacked(await boxesOf(points))
  })

  // Scoped to the whole section, not the form: the booking CTA is styled to the
  // same 44px minimum and is the section's primary action.
  test('every field and button in the contact section is at least 44px tall', async ({ page }) => {
    const small = await page.evaluate(() => {
      const section = document.querySelector('#kontakt')!
      return Array.from(section.querySelectorAll('input, select, textarea, button, a'))
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        .filter(({ r }) => r.height < 44)
        .map((entry) => {
          const { el, r } = entry
          const name = el.id || el.textContent?.trim() || '(unnamed)'
          return `${el.tagName.toLowerCase()} ${name} → ${Math.round(r.height)}px tall`
        })
    })
    expect(small, `controls under 44px:\n${small.join('\n')}`).toEqual([])
  })
})

test.describe('wide: the front page keeps its desktop layout', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) <= COLUMN_MAX_WIDTH, 'narrow viewport')
    await page.goto('/')
  })

  test('the Hero Foreword sits beside the title, tilted', async ({ page }) => {
    const title = (await page.getByRole('heading', { level: 1 }).boundingBox())!
    const foreword = page.locator('[data-hero-foreword]')
    expect((await foreword.boundingBox())!.x).toBeGreaterThan(title.x + title.width - 1)

    const transform = await foreword.evaluate((el) => getComputedStyle(el).transform)
    expect(transform).not.toBe('none')
  })

  test('the three Vinyl Tiles sit on one row', async ({ page }) => {
    const boxes = await boxesOf(page.locator('[data-vinyl-tile]'))
    expect(boxes).toHaveLength(3)
    for (const box of boxes) expect(box.top).toBe(boxes[0].top)
  })

  test('the Teaser Points sit four to a row', async ({ page }) => {
    const boxes = await boxesOf(page.locator('[data-teaser-point]'))
    // Each row of four shares the top of its first member.
    for (let i = 0; i < boxes.length; i++) expect(boxes[i].top).toBe(boxes[i - (i % 4)].top)
  })
})

test.describe('every width: the front page stays inside the viewport', () => {
  // overflow.spec.ts makes the same assertion for the document as a whole; this
  // one is scoped to `main` and names the offending Block, so a regression
  // points at the CSS Module that caused it.
  test('nothing on the front page overflows sideways', async ({ page }) => {
    await page.goto('/')
    const limit = await layoutWidth(page)
    const offenders = await page.evaluate((max) => {
      const clipped = (el: Element) => {
        for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
          if (getComputedStyle(p).overflowX !== 'visible') return true
        }
        return false
      }
      return Array.from(document.querySelector('main')!.querySelectorAll('*'))
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        .filter(({ el, r }) => r.width > 0 && r.right > max + 1 && !clipped(el))
        .map(({ el, r }) => {
          const cls = el.classList.length ? `.${el.classList[0]}` : ''
          return `${el.tagName.toLowerCase()}${cls} → right edge at ${Math.round(r.right)}px`
        })
    }, limit)
    expect(offenders).toEqual([])
  })
})
