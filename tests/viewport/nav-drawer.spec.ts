import { expect, test } from '@playwright/test'

import { widthOf } from './viewport'

// Nav Drawer (#29) — the full-screen overlay that replaces the navigation
// bar's tab row on narrow screens. See CONTEXT.md for the term.
//
// One spec, four width projects (see playwright.config.ts). The drawer's
// breakpoint is `max-width: 768px`, so 320/375/768 exercise the narrow
// behaviour and 1280 asserts the desktop tab row is untouched.
//
// Deviation, stated: docs/TechStack.md's Testing row scoped the suite to
// viewport smoke tests, "no E2E". Half of #29's acceptance criteria are
// interaction — focus trap, Escape, scroll lock, aria-expanded — and a
// screenshot cannot see any of them. The row has been amended to allow
// interaction specs for chrome components whose criteria are behavioural;
// this file is the first of them.

const DRAWER_MAX_WIDTH = 768

test.describe('narrow: menu button replaces the tab row', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) > DRAWER_MAX_WIDTH, 'wide viewport')
    await page.goto('/')
  })

  test('menu button is visible, tab row is hidden, CTA stays visible', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Primær' })
    await expect(nav.getByRole('button', { name: 'Menu' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Hjem' })).toBeHidden()
    await expect(nav.getByRole('link', { name: /Bestil foredrag/ })).toBeVisible()
  })

  test('the drawer shows the whole nav tree, children under their parent', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Primær' })
    await nav.getByRole('button', { name: 'Menu' }).click()

    const drawer = page.getByRole('dialog', { name: 'Menu' })
    await expect(drawer).toBeVisible()

    // Every top-level label and every child link is rendered at once — no
    // second level to unfold.
    for (const label of ['Hjem', 'Johnny Cash', 'USA', 'Foredrag', 'Kontakt']) {
      await expect(drawer.getByText(label, { exact: true }).first()).toBeVisible()
    }
    for (const label of ['Portræt', 'Musikeren', 'Historien', 'Kulturen']) {
      await expect(drawer.getByRole('link', { name: new RegExp(label) })).toBeVisible()
    }

    // A child sits to the right of its parent — indented, not a flat sibling.
    const parent = await drawer.getByText('Johnny Cash', { exact: true }).first().boundingBox()
    const child = await drawer.getByRole('link', { name: /Musikeren/ }).boundingBox()
    expect(child!.x).toBeGreaterThan(parent!.x)
  })

  test('aria-expanded on the trigger reflects the drawer state', async ({ page }) => {
    const trigger = page.getByRole('navigation', { name: 'Primær' }).getByRole('button', {
      name: 'Menu',
    })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  test('background scroll is locked while the drawer is open', async ({ page }) => {
    // Closed, the page scrolls — otherwise the assertion below proves nothing.
    await page.mouse.wheel(0, 600)
    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
    await page.evaluate(() => window.scrollTo(0, 0))

    const trigger = page.getByRole('navigation', { name: 'Primær' }).getByRole('button', {
      name: 'Menu',
    })
    await trigger.click()
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible()

    await page.mouse.wheel(0, 600)
    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBe(0)

    // …and the lock is lifted again on close.
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden()
    await page.mouse.wheel(0, 600)
    await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
  })

  test('focus is trapped in the drawer', async ({ page }) => {
    await page.getByRole('navigation', { name: 'Primær' }).getByRole('button', { name: 'Menu' }).click()
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible()

    // More tabs than the drawer has focusable elements — focus must wrap
    // inside it rather than escape to the page behind.
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab')
      const inside = await page.evaluate(
        () => document.getElementById('nav-drawer')?.contains(document.activeElement) ?? false,
      )
      expect(inside, `focus left the drawer after ${i + 1} Tab press(es)`).toBe(true)
    }
  })

  test('Escape closes the drawer and returns focus to the menu button', async ({ page }) => {
    const trigger = page.getByRole('navigation', { name: 'Primær' }).getByRole('button', {
      name: 'Menu',
    })
    await trigger.click()
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  test('the active section is marked in the drawer', async ({ page }) => {
    await page.getByRole('navigation', { name: 'Primær' }).getByRole('button', { name: 'Menu' }).click()
    const drawer = page.getByRole('dialog', { name: 'Menu' })
    await expect(drawer.getByRole('link', { name: 'Hjem' })).toHaveAttribute('aria-current', 'page')
  })

  test('a parent group is marked when one of its children is the current page', async ({
    page,
  }) => {
    await page.goto('/musikeren')
    await page.getByRole('navigation', { name: 'Primær' }).getByRole('button', { name: 'Menu' }).click()
    const drawer = page.getByRole('dialog', { name: 'Menu' })

    // "Musikeren" is a child of "Johnny Cash"; the group carries the same
    // active marking the tab row gives it, "USA" carries none.
    const edge = (label: string) =>
      drawer
        .getByText(label, { exact: true })
        .first()
        .evaluate((el) => getComputedStyle(el).borderLeftWidth)

    expect(await edge('Johnny Cash')).not.toBe('0px')
    expect(await edge('USA')).toBe('0px')
    await expect(drawer.getByRole('link', { name: /Musikeren/ })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  test('nothing in the navigation overflows sideways', async ({ page }) => {
    // Scoped to the nav, not the document: the pages behind it still overflow
    // at these widths (#30–#39), which overflow.spec.ts is the record of.
    const offenders = async () =>
      page.evaluate(() => {
        const limit = document.documentElement.clientWidth
        const roots = ['nav[aria-label="Primær"]', '#nav-drawer']
          .map((s) => document.querySelector(s))
          .filter((el): el is Element => el !== null)
        return roots.flatMap((root) =>
          [root, ...Array.from(root.querySelectorAll('*'))]
            .map((el) => ({ el, r: el.getBoundingClientRect() }))
            .filter(({ r }) => r.width > 0 && r.right > limit + 1)
            .map(({ el, r }) => `${el.tagName.toLowerCase()} → right edge at ${Math.round(r.right)}px`),
        )
      })

    expect(await offenders(), 'closed').toEqual([])

    await page.getByRole('navigation', { name: 'Primær' }).getByRole('button', { name: 'Menu' }).click()
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible()
    expect(await offenders(), 'drawer open').toEqual([])
  })

  test('the bar CTA stays a 44px-tall touch target', async ({ page }) => {
    const box = await page
      .getByRole('navigation', { name: 'Primær' })
      .getByRole('link', { name: /Bestil foredrag/ })
      .boundingBox()
    expect(box!.height).toBeGreaterThanOrEqual(44)
  })

  test('every touch target in the drawer is at least 44×44px', async ({ page }) => {
    await page.getByRole('navigation', { name: 'Primær' }).getByRole('button', { name: 'Menu' }).click()
    const drawer = page.getByRole('dialog', { name: 'Menu' })
    await expect(drawer).toBeVisible()

    const small = await page.evaluate(() => {
      const root = document.getElementById('nav-drawer')!
      return Array.from(root.querySelectorAll('a, button'))
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        .filter(({ r }) => r.height < 44 || r.width < 44)
        .map(({ el, r }) => `${el.textContent?.trim()} → ${Math.round(r.width)}×${Math.round(r.height)}`)
    })
    expect(small, `targets under 44×44:\n${small.join('\n')}`).toEqual([])
  })

  test('the menu button itself is at least 44×44px', async ({ page }) => {
    const box = await page
      .getByRole('navigation', { name: 'Primær' })
      .getByRole('button', { name: 'Menu' })
      .boundingBox()
    expect(box!.width).toBeGreaterThanOrEqual(44)
    expect(box!.height).toBeGreaterThanOrEqual(44)
  })
})

test.describe('wide: the tab row is untouched', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(widthOf(testInfo.project.use.viewport?.width) <= DRAWER_MAX_WIDTH, 'narrow viewport')
    await page.goto('/')
  })

  test('no menu button; the tab row and CTA are visible', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Primær' })
    await expect(nav.getByRole('button', { name: 'Menu' })).toBeHidden()
    await expect(nav.getByRole('link', { name: 'Hjem' })).toBeVisible()
    await expect(nav.getByRole('link', { name: /Bestil foredrag/ })).toBeVisible()
  })

  test('hover still opens a dropdown', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Primær' })
    const child = nav.getByRole('link', { name: /Musikeren/ })
    await expect(child).toBeHidden()
    await nav.getByRole('button', { name: /Johnny Cash/ }).hover()
    await expect(child).toBeVisible()
  })
})
