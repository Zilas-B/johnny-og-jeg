import { readFileSync } from 'node:fs'
import path from 'node:path'

import { expect, test } from '@playwright/test'

import { ROUTES_FILE, SCREENSHOTS_DIR } from './paths'

// One test per route (× one project per width, see playwright.config.ts).
//
// Assertion: the document must not scroll horizontally — `scrollWidth` may not
// exceed `clientWidth`. On failure the message names the elements that stick
// out past the right edge, so the report says *where* the site overflows, not
// just that it does.
//
// Every route × width also saves a full-page screenshot, both to a stable path
// under test-results/screenshots/ and as an attachment in the HTML report.
// Screenshots are for humans to look at; nothing is compared automatically.

const routes: string[] = JSON.parse(readFileSync(ROUTES_FILE, 'utf8'))

type Overflow = {
  scrollWidth: number
  clientWidth: number
  offenders: { selector: string; right: number }[]
}

function measureOverflow(): Overflow {
  const clientWidth = document.documentElement.clientWidth
  const scrollWidth = document.documentElement.scrollWidth

  const clipped = (el: Element) => {
    for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      const ox = getComputedStyle(p).overflowX
      if (ox === 'hidden' || ox === 'clip' || ox === 'scroll' || ox === 'auto') return true
    }
    return false
  }
  const name = (el: Element) => {
    const id = el.id ? `#${el.id}` : ''
    const cls = el.classList.length ? `.${Array.from(el.classList).slice(0, 2).join('.')}` : ''
    return `${el.tagName.toLowerCase()}${id}${cls}`
  }
  // An anonymous wrapper is named by its nearest classed ancestor, so the
  // report points at a CSS Module rather than at "div".
  const labelFor = (el: Element) => {
    if (el.id || el.classList.length) return name(el)
    let p = el.parentElement
    while (p && p !== document.body && !p.id && !p.classList.length) p = p.parentElement
    return p && p !== document.body ? `${name(el)} in ${name(p)}` : name(el)
  }

  // Document order visits ancestors before descendants, so an element whose
  // ancestor is already reported is a consequence, not a cause — skip it.
  const reported = new Set<Element>()
  const insideReported = (el: Element) => {
    for (let p = el.parentElement; p; p = p.parentElement) if (reported.has(p)) return true
    return false
  }

  const offenders: Overflow['offenders'] = []
  for (const el of Array.from(document.body.querySelectorAll('*'))) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.right <= clientWidth + 1) continue
    if (getComputedStyle(el).position === 'fixed') continue
    if (clipped(el) || insideReported(el)) continue
    reported.add(el)
    offenders.push({ selector: labelFor(el), right: Math.round(r.right) })
  }
  offenders.sort((a, b) => b.right - a.right)
  return { scrollWidth, clientWidth, offenders: offenders.slice(0, 12) }
}

for (const route of routes) {
  test(route, async ({ page }, testInfo) => {
    const width = testInfo.project.use.viewport?.width ?? 0
    const slug = route === '/' ? 'front-page' : route.replace(/^\//, '').replace(/\//g, '__')

    const response = await page.goto(route, { waitUntil: 'networkidle' })
    if (response?.status() === 404) {
      const reason = `${route} answered 404 — listed in the sitemap but not served; skipped`
      console.log(`viewport: ${reason}`) // the list reporter prints skips without their reason
      test.skip(true, reason)
    }
    expect(response?.ok(), `${route} answered ${response?.status()}`).toBe(true)

    await page.evaluate(() => document.fonts.ready.then(() => undefined))

    const shot = path.join(SCREENSHOTS_DIR, `w${width}`, `${slug}.png`)
    await page.screenshot({ path: shot, fullPage: true, animations: 'disabled' })
    await testInfo.attach(`${slug}@${width}`, { path: shot, contentType: 'image/png' })

    const overflow = await page.evaluate(measureOverflow)
    const detail = overflow.offenders.length
      ? overflow.offenders.map((o) => `  ${o.selector} → right edge at ${o.right}px`).join('\n')
      : '  (no unclipped element found past the right edge)'

    expect(
      overflow.scrollWidth,
      `${route} @ ${width}px scrolls horizontally: scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}\nSticking out past ${overflow.clientWidth}px:\n${detail}`,
    ).toBeLessThanOrEqual(overflow.clientWidth)
  })
}
