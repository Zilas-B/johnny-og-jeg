import { expect, type Locator, type Page } from '@playwright/test'

// Helpers shared by the per-component specs (nav-drawer #29, masthead-footer
// #30, home-blocks #31, historien-timeline #33). Each spec runs once per width
// project — see playwright.config.ts — so each one needs its own width, each one
// measures the viewport the same way, and most of them have to prove that some
// row of boxes became a column. Each helper was extracted at its third copy.

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

type Box = { x: number; top: number; bottom: number }

/** Rounded boxes for every match, in document order. */
export function boxesOf(locator: Locator): Promise<Box[]> {
  return locator.evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect()
      return { x: Math.round(r.x), top: Math.round(r.top), bottom: Math.round(r.bottom) }
    }),
  )
}

/** One column: a shared left edge, and each box starting below the last. */
export function expectStacked(boxes: Box[]) {
  const [first] = boxes
  for (const box of boxes) expect(box.x).toBe(first.x)
  for (let i = 1; i < boxes.length; i++) {
    expect(boxes[i].top).toBeGreaterThanOrEqual(boxes[i - 1].bottom)
  }
}

/** WCAG 2.5.8, pulled into #24 from #14: every interactive box is 44x44 or more. */
export const MIN_TARGET_PX = 44

/**
 * Asserts every matched element is a finger-sized target, naming the ones that
 * are not. `locator` should match the interactive elements themselves — a link
 * or a button — not their container.
 */
export async function expectTappable(locator: Locator) {
  const small = await locator.evaluateAll(
    (els, min) =>
      els
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        .filter(({ r }) => r.height < min || r.width < min)
        .map(({ el, r }) => `${el.textContent?.trim()} → ${Math.round(r.width)}×${Math.round(r.height)}`),
    MIN_TARGET_PX,
  )
  expect(small, `targets under ${MIN_TARGET_PX}×${MIN_TARGET_PX}:\n${small.join('\n')}`).toEqual([])
}

/** The tracks a `grid-template-columns` computed to, as used-value strings. */
export function tracksOf(locator: Locator): Promise<string[]> {
  return locator.evaluate((el) => getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/))
}
