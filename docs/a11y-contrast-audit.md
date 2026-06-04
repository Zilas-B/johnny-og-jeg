# Accessibility audit — Step 8

Companion record for Metaplan **Step 8 (Accessibility & performance pass)**.
Covers the WCAG AA colour-contrast audit, the keyboard / reduced-motion /
alt-text state, and the Lighthouse run.

## 1. Colour-contrast audit (WCAG 2.1)

**Method.** Ratios computed from the sRGB tokens in `styles/tokens.css` using the
WCAG 2.1 relative-luminance formula. Thresholds: **AA normal text ≥ 4.5:1**,
**AA large text (≥ 24px, or ≥ 18.66px bold) ≥ 3:1**.

**Decision (user, 2026-06-04): fidelity wins — audit + document only.** The
template's exact palette is preserved; failing pairs are recorded as **accepted
deviations**, not recoloured. This continues the project's standing precedent of
template fidelity over abstract criteria (e.g. accents all barn, dropped nav
criterion — Metaplan Decision log 2026-06-01).

### Text-on-light (paper family)

| Foreground | Background | Ratio | AA normal | AA large |
|---|---|---|---|---|
| ink | paper | 15.41 | ✅ | ✅ |
| ink-2 | paper | 14.17 | ✅ | ✅ |
| ink-soft | paper | 11.90 | ✅ | ✅ |
| barn | paper | 5.71 | ✅ | ✅ |
| barn-deep | paper | 8.70 | ✅ | ✅ |
| barn | paper-2 | 5.11 | ✅ | ✅ |
| barn | paper-3 | 4.28 | ❌ | ✅ |
| denim | paper | 8.61 | ✅ | ✅ |
| denim-deep | paper | 11.49 | ✅ | ✅ |
| **brass** | **paper** | **2.03** | ❌ | ❌ |
| **brass** | **paper-2** | **1.82** | ❌ | ❌ |
| **brass** | **paper-3** | **1.52** | ❌ | ❌ |
| brass-deep | paper | 3.94 | ❌ | ✅ |
| brass-deep | paper-2 | 3.52 | ❌ | ✅ |
| brass-deep | paper-3 | 2.95 | ❌ | ❌ |

### Text-on-dark (ink / denim bands)

| Foreground | Background | Ratio | AA normal | AA large |
|---|---|---|---|---|
| paper | ink | 15.41 | ✅ | ✅ |
| paper-2 | ink | 13.78 | ✅ | ✅ |
| paper-3 | ink | 11.55 | ✅ | ✅ |
| brass | ink | 7.59 | ✅ | ✅ |
| brass | denim-deep | 5.66 | ✅ | ✅ |
| brass | denim | 4.24 | ❌ | ✅ |
| brass-deep | ink | 3.91 | ❌ | ✅ |
| paper | denim / denim-deep / barn / barn-deep | 8.61 / 11.49 / 5.71 / 8.70 | ✅ | ✅ |

### Failures and disposition

All body copy (ink/ink-2/ink-soft on paper) and all link/heading reds
(barn/barn-deep, denim) pass AA comfortably. The failures are **brass / brass-deep
used as a foreground**:

1. **brass text on light paper** (2.03 / 1.82 / 1.52) — the mono small-caps
   eyebrows, kickers, station/era numerals, and "✶" dividers on light bands.
   Representative: `*.module.css` `color: var(--brass)` on paper sections across
   Historien, Kulturen, Bøger, Foredrag, and the essay blocks (HymnHero,
   ScriptureStrip, SteppedList). Brass on **dark** bands (ink 7.59, denim-deep
   5.66) passes — the same token is fine wherever the template places it on dark.
2. **brass-deep on paper** (3.94) and **brass on denim** (4.24) — pass AA *large*
   but fail AA *normal*; used for small accent labels.
3. **barn on paper-3** (4.28) — marginal; barn on paper / paper-2 passes. Only
   the darkest paper tier drops barn under 4.5.

**Disposition: accepted deviations (no recolor).** These are the template's
signature brass-on-paper editorial labels; darkening brass to reach 4.5:1 would
visibly alter the design language across every page. Per the fidelity-wins
decision they are kept as-is and logged here and in the Metaplan Decision log.
If a future step revisits this, the minimal fix is a darker brass token used
*only* on light backgrounds (the dark-band brass already passes) — a token +
`tokens.css`/`@theme` change, not per-component CSS.

## 2. Alt text (best-practices §5 r5 / §7 r4)

`alt` is `Rule.required()` in every schema whose image is rendered to a page:
`sanity/schemas/objects/historienEra.ts`, `documents/bogerPage.ts`,
`objects/blocks/flagHero.ts`. The only optional `alt` is `seo.ogImage.alt`
(`objects/seo.ts`), which is **not rendered on-page** (OG/social only) — accepted.
`SanityImage` (`components/editorial/SanityImage.tsx`) trusts the required alt;
no raw `<img>` exists anywhere in `components/` or `app/` (§7 r6 grep-clean).

## 3. Keyboard navigation & focus (§10 r2/r3, Step 8)

- **Skip-link** is the first focusable element (`app/(site)/layout.tsx`,
  `styles/globals.css`).
- **Global `:focus-visible`** accent outline (`styles/tokens.css`).
- **Nav dropdowns** (`components/chrome/Nav.tsx`) — Step 8 added click-to-open,
  `aria-expanded`/`aria-controls`, Escape-to-close-and-refocus-trigger, and
  click/focus-outside-to-close, while keeping CSS `:hover`/`:focus-within` for
  pointer users (`.itemOpen` added alongside in `Nav.module.css`).
- **Music player** controls carry `aria-label`s and an `aria-live="polite"`
  now-playing region (`components/chrome/MusicPlayer.tsx`); buttons are inert
  (visual shell, Step 4 decision). Step 8 removed the radio-tab's
  `aria-label="Toggle player"` so its accessible name now equals its visible text
  (fixes WCAG 2.5.3 *Label in Name*, Lighthouse `label-content-name-mismatch`).
- **Heading order** (§10 r4) — Lighthouse flagged three level skips, fixed by
  re-tagging (CSS-class-driven styling unchanged, zero visual impact):
  `HubHero` sig-quote `h3`→`h2`, `ContactSection` booking `h4`→`h3`, `Footer`
  column titles `h5`→`h2` (`h2` never skips from any preceding level on any page).

## 4. Reduced motion (§10 r6)

Per-module animations (vinyl spin, ticker, live dot) already gate on
`prefers-reduced-motion`. Step 8 added a **global fallback** in
`styles/globals.css` so any future animation/transition degrades safely.

## 5. Lighthouse

**Scope note (user, 2026-06-04):** rendering is `force-dynamic` and the read
token is unwired; the static/ISR profile is deferred to **Step 10** (Metaplan
271–276). So the binding **Performance ≥ 90** acceptance is finalized in Step 10.
Step 8 records the run and targets **Accessibility / Best Practices / SEO ≥ 90**.

Run against a local production build:

```bash
pnpm build && pnpm start    # serves on http://localhost:3000
npx lighthouse http://localhost:3000/ --only-categories=accessibility,best-practices,seo,performance --chrome-flags="--headless" --quiet --output=json --output-path=./lh-home.json
npx lighthouse http://localhost:3000/naturen --only-categories=accessibility,best-practices,seo,performance --chrome-flags="--headless" --quiet --output=json --output-path=./lh-naturen.json
```

Results (Lighthouse 12, local `pnpm start`, headless Chrome, 2026-06-04):

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` (hub) | 88 † | **96** | **100** | **90** |
| `/naturen` | 88 † | **96** | **100** | **100** |

† Performance < 90 is the **`force-dynamic`** render profile, deferred to Step 10
(static/ISR). Targets for Step 8 — **Accessibility / Best Practices / SEO ≥ 90** —
are met on both pages.

The only remaining Accessibility deduction on both pages is `color-contrast`,
which corresponds entirely to the **accepted brass-on-light deviation** in §1
(e.g. the paper-on-brass vinyl-tile label at 2.03, and a 4.49 footer quote a hair
under 4.5). `heading-order` and `label-content-name-mismatch` were fixed (§3).
