# Metaplan — Archive (completed steps)

Detailed `Includes` / `Out of scope` / `Reference files` / `Acceptance criteria` for
**completed** steps (0–8), moved out of `Metaplan.md` to keep the active roadmap small.
These steps are done — this file is kept for reference and audit only.

**Authority unchanged:** the live roadmap, all pending steps, and the **Decision log**
stay in `Metaplan.md`. The Decision log there is the authoritative record of *why* things
changed (including reframes of these steps); this file is just the original step prose.
On any conflict, `Metaplan.md` + `best-practices.md` + `TechStack.md` win.

---

## Phase A — Visible Sanity-driven prototype (front page)

Goal: end of Phase A, the **front page is live on a Vercel preview URL**, visually faithful to the design, with the music player **visible as a non-functional visual shell** — and **everything an editor sees is editable in Sanity Studio**.

### Step 0 — Project scaffold

**Outcome:** an empty but working Next.js 15+ + TypeScript + Tailwind v4 + Sanity Studio app, deployed to a Vercel preview URL.

**Includes:**
- Create Next.js app at `C:\Users\Andre\Documents\Lokale Git Repositories\johnny-og-jeg` (App Router, TypeScript, Tailwind, ESLint).
- Initialize git, create GitHub repo, push.
- Install `next-sanity`, `sanity`, `@sanity/image-url`, `@portabletext/react`.
- Add Sanity project (new or existing), set up `sanity.config.ts`.
- Embed Studio at `app/studio/[[...tool]]/page.tsx`.
- Configure env vars locally (`.env.local`) and in Vercel.
- First commit, first Vercel deploy.

**Acceptance criteria:**
- Visiting `localhost:3000` shows the Next.js default page.
- Visiting `localhost:3000/studio` shows an empty Sanity Studio.
- `pnpm build` succeeds.
- A Vercel preview URL exists and serves both `/` and `/studio`.

### Step 1 — Design tokens and global chrome

**Outcome:** the masthead, sticky top navigation, footer ("colophon"), paper background, and font system are in place on every page.

**Includes:**
- Set up next/font for Playfair Display, Bebas Neue, IBM Plex Mono, Crimson Pro.
- Define design tokens (colors, typography scale, spacing) in `styles/tokens.css` and Tailwind config — drawn from `assets/cash-shared.css`.
- Implement paper-grain background (fixed overlay with radial gradients).
- Build `<Masthead>`, `<Nav>` (with dropdowns, page-aware active state), `<Footer>` components.
- Place them in `app/(site)/layout.tsx`.

**Note:** chrome content (masthead text, nav items, footer labels) ships hardcoded in JSX as a layout-first pass. Step 2 migrates it to a Sanity `siteSettings` singleton.

**Reference files:** `assets/cash-shared.css`, the top of any of the 18 HTML pages.

**Acceptance criteria:**
- Visiting `/` shows the warm paper background, wordmark, top nav with dropdowns, and footer.
- All four fonts load without layout shift.
- Nav highlights the current page.
- Colors and typography visually match the design within ~5% tolerance.

### Step 1.5 — Best practices research & audit

**Outcome:** a written, project-specific best-practices reference distilled from current docs for our exact stack (Next.js 16 App Router + Sanity v3 embedded + Tailwind v4 + editorial/CMS-driven content). Subsequent steps follow it. No retroactive rewrite of Step 0–1 unless something is clearly broken.

**Includes:**
- Research current best practices for:
  - **Next.js 16 App Router** — server vs. client components, async `params`/`searchParams`, `headers()`/`cookies()` rules, route handlers, `revalidateTag`/`revalidatePath`, streaming, partial prerendering, image optimization, font optimization.
  - **Sanity v3 embedded Studio** — schema authoring patterns, GROQ query organization, draft mode + Presentation tool, live preview, `next-sanity` client conventions, `sanity typegen` workflow, CORS hardening, dataset visibility, webhook revalidation pattern, image pipeline + `next/image`.
  - **Tailwind v4** — CSS-first `@theme`, when to reach for utilities vs. CSS Modules, dark-mode strategy (we have none planned but doc the choice), content/scanning config.
  - **Editorial / CMS-driven sites** — Portable Text serializer patterns, content model granularity (singletons vs. references), URL design, slug strategy, draft/published separation, image alt-text enforcement.
  - **Accessibility & performance baselines** — semantic landmarks, keyboard nav patterns for dropdowns, Lighthouse targets, LCP/CLS strategy with custom fonts.
  - **SEO & metadata** — App Router `metadata` exports, dynamic OG image patterns, sitemap/robots.
- Distill findings into **`BestPractices.md`** at the repo root. Keep it concrete and project-specific — checklists and rules, not encyclopedia entries. Each rule has a one-line "why" and (where useful) a reference link.
- Update **`CLAUDE.md`** to reference `BestPractices.md` so future Claude sessions load these rules.
- Add **a "Best practices applied" sub-section to each subsequent step's plan-mode session** — Step 2+ plans must explicitly check the practices that apply.
- Add a **Decision log** entry in `Metaplan.md` summarising any choices that emerged (e.g. "draft mode via Sanity Presentation, not custom preview routes").

**Out of scope:**
- Refactoring code that's already shipped in Step 0 or Step 1 — only do that if something is provably wrong or unsafe. Otherwise the rules apply *forward*.

**Reference files:**
- Official docs (Next.js, Sanity, Tailwind, MDN) — fetch via WebFetch/WebSearch as needed.
- The Sanity MCP server's `get_sanity_rules` / `search_docs` / `read_docs` tools (see `CLAUDE.md`).
- `TechStack.md` for stack decisions already locked in.

**Acceptance criteria:**
- `BestPractices.md` exists and is concrete (not generic). At minimum it covers the six topics listed above with project-specific rules.
- `CLAUDE.md` references it.
- A short Decision log entry is added to `Metaplan.md` for any new architectural choices.
- A skim of the doc by a fresh Claude session is enough to know "the way we build here" without re-deriving it.

### Step 2 — Chrome → Sanity (`siteSettings` singleton)

**Outcome:** the masthead, primary nav, footer columns, and copyright line are editable in Sanity Studio. Editing in `/studio` updates the live chrome.

**Includes:**
- `siteSettings` singleton schema with fields for: masthead kicker, masthead left/right sides, wordmark sub-line, nav items (with dropdown children — title, mark/roman, href), CTA href + label, footer mark, footer blurb, footer quote, footer column groups (Johnny Cash / USA / Sidens hjørne) with link lists, copyright line, bottom tagline.
- Singleton enforcement via desk structure (pin to a single list item; don't show it under generic document list).
- Author the singleton in Studio with the current hardcoded chrome content.
- Refactor `components/chrome/{Masthead,Nav,Footer}.tsx` to read from `siteSettings` via GROQ (server-side fetch in `app/(site)/layout.tsx`, pass as props).
- Set up `sanity typegen` so types regenerate when schema changes; chrome components import the generated types.
- Add a Sanity webhook → Next.js revalidation route for `siteSettings`.
- **Best-practices retrofit** (gaps in Step 0 + 1 vs. `docs/best-practices.md`, audited 2026-05-26 — all minor, folded in here):
  - Add skip-link as first focusable element in `app/(site)/layout.tsx`; verify/add `:focus-visible` styles in `tokens.css` (§10).
  - Create a `/styleguide` route stub at `app/(site)/styleguide/page.tsx` rendering tokens + (once Sanity has them) accent swatches and editorial primitives (§4).
  - Extend `sanity.cli.ts` with typegen config + `overloadClientMethods: true` (§2).
  - Add `types`, `predev`, `prebuild` scripts to `package.json` (§2).
  - Gate `<SanityLive />` to Draft Mode only; disable Stega in the base client; add `app/api/revalidate/route.ts` with webhook secret verification (§1).
  - Confirm or remove `styled-components` from `package.json` (TechStack.md "no CSS-in-JS" rule — likely an unused `create-next-app` default).
  - Extend `sanity/env.ts` to validate `SANITY_API_READ_TOKEN` and `SANITY_WEBHOOK_SECRET` (§9) when they're first used.

**Reference files:** current `components/chrome/*` source (the literal text + `NAV_ITEMS` array become the singleton's initial values).

**Acceptance criteria:**
- A `siteSettings` singleton exists in Studio with all chrome fields populated.
- Editing a chrome field in Studio and publishing updates the live site within a few seconds.
- The chrome looks visually identical before and after migration.
- `pnpm sanity typegen generate` produces typed schema; components import generated types.
- The `Nav` client component still computes active state from `usePathname()` against the Sanity-driven items.

### Step 3 — Hub page "Johnny og jeg" (Sanity-first)

**Outcome:** the front page (`/`) is a visually faithful reproduction of `Johnny og jeg.html`, **driven from Sanity**. Editor can change every block.

**Includes:**
- `homePage` singleton schema modelled on what `Johnny og jeg.html` actually shows: `hero` (kicker, title, deck PT, meta strings), `signatureCard` (stamp, fore-label, headline, body PT, scripture PT), `ticker` (array of `tickerItem` `{year, milestone}`), `vinyls` (exactly 3 `vinylTile` — corner num/tag, accent, vinyl labels, headline, subhead, body PT, 4-track `vinylTrack` list, link), `historicalThread` (kicker, headline PT, intro PT, 8-event `timelineEvent` timeline), `hymn` (kicker, quote PT, attribution), `contact` (kicker, headline, deck PT, booking text + href), `seo` (title/description/ogImage).
- Reusable object types: `vinylTile`, `vinylTrack`, `tickerItem`, `timelineEvent`.
- Introduce the shared **PortableText wrapper** (`components/editorial/PortableText.tsx`, per `best-practices.md` §6) — used by every Portable Text field on the hub and forward. Initial component map: paragraph, italic, strong, line break, opt-in drop-cap.
- Author the `homePage` document in Studio with all hub content extracted from `Johnny og jeg.html`.
- Render the hub page as a server component via GROQ + the shared PortableText wrapper.
- Wire the **Sanity Presentation tool** so editors see drafts inline at `/studio/presentation` — landing the `app/api/draft-mode/{enable,disable}/route.ts` plumbing that `<SanityLive />` was already gated on.

**Reference files:** `Johnny og jeg.html`.

**Acceptance criteria:**
- Side-by-side, the React version and the original HTML are visually indistinguishable on a 1440px viewport (acceptable: minor pixel-level shifts).
- All hub content is editable in Sanity Studio.
- Editing a hub field in Studio and publishing updates the live page within a few seconds.
- Presentation tool shows draft + published states.
- Hover interactions work on chips.
- Responsive down to 768px without obvious breakage.

> **Note:** the home page is migrated to the `blocks[]` model in **Step 7e** (Decision log 2026-06-04). The fixed schema above is the *original* Step 3 build.

### Step 4 — Music player (Cash Radio) — **visual shell only**

**Outcome:** the sticky bottom music player markup is present on every page, visually faithful to the design (vinyl disc, now-playing label, track list, transport controls). **No functionality.** Buttons are inert, nothing fetches, nothing opens external links, no Sanity model. Track names and metadata visible in the shell are baked-in placeholder text drawn straight from `assets/cash-radio.js` — they exist only so the visual reads correctly.

**Includes:**
- `<MusicPlayer>` component placed in `app/(site)/layout.tsx` so it persists across navigation.
- Sticky bottom positioning, paper/ink palette per the template, mobile breakpoint at 1100px.
- Vinyl disc CSS art with the spin animation always-on (or `prefers-reduced-motion`-aware halt). The "is the disc spinning" state is hardcoded — not driven by a play state.
- Visual-only elements: now-playing track + artist text, track list, play / skip-forward / skip-back buttons.
- Buttons are real `<button>` elements (for a11y and visual fidelity) with `type="button"` and no `onClick` — they have visible focus rings but do nothing when clicked.

**Explicitly out of scope (postponed indefinitely):**
- No `track` / `playlist` schema. No Sanity model for music content at all.
- No GROQ fetch, no client component for state, no `'use client'` directives.
- No play / pause / skip behaviour. No external streaming link-outs (Spotify/YouTube).
- No real audio playback.
- No "editor adds/reorders tracks in Studio" — the player is not editable. If the visible track names ever need to change, the placeholder array in the component is edited in code.

When (or if) the player becomes interactive, that lands as a separate, scoped step — not folded back into Step 4.

**Reference files:** `assets/cash-radio.js` (placeholder copy + visual layout), the player markup at the bottom of any HTML page.

**Acceptance criteria:**
- Player markup persists across navigation (it lives in the layout, not the page).
- Visual fidelity to the design template at 1440px and at the 1100px mobile breakpoint.
- Vinyl disc spins via CSS, halts under `prefers-reduced-motion`.
- Transport buttons render with correct icons and focus styles, but clicking them does nothing.
- The component is a Server Component — no `'use client'` directive anywhere in the player tree.
- No new Sanity types, no new GROQ queries, no new env vars.

→ **Phase A complete.** Share the Vercel URL. Get feedback. Decide whether to proceed to Phase B.

---

## Phase B — One landscape template

Goal: one of the 8 landscape pages is fully built and Sanity-driven. The template is reusable for the remaining seven.

### Step 5 — Landscape page template ("Naturen")

**Correction (2026-06-01):** the original "Includes" below described a rich page-height
editorial layout (alternating dark/light sections, drop caps, side essays, era timeline).
Reading the templates shows that layout does **not** live on the landscape pages — all eight
landscape files (`Naturen.html`, `Vesten.html`, …) are thin **archive-stub** pages
(`arkiv-hero` + empty `posts` placeholder + `siblings` grid). The rich `.land` editorial layout
lives only on `Kulturen.html`, which renders all eight landscapes; that work moves to **Step 7**.
See the Decision log. The text below is rewritten to match what was actually built.

**Outcome:** the landscape archive page `/naturen` is live, Sanity-driven, visually matching
`Naturen.html`. A reusable `landscape` + `archiveEntry` model the remaining seven landscapes reuse.

**Includes (as built):**
- `landscape` document schema: identity (inline-PT `name`, `shortName`, `slug`, `order`,
  `romanNumeral`, `toponym`, `period`, `accentColor`), hero (`eyebrow`, `motto`, `deck`,
  `topics`/`topicsLabel`, crumb back-link), empty-state (`emptyMeta/Label/Heading/Body/Actions`),
  and `seo`. Hero/empty fields are optional; the page guards on `deck`.
- `archiveEntry` document type (referenced by `landscape`; zero entries authored — the feed
  renders the empty state, and lists reverse-chronologically once entries exist).
- Dynamic route `app/(site)/[landscape]/page.tsx`; components `LandscapeHero`, `LandscapePosts`,
  `LandscapeSiblings` under `components/landscape/`; `components/editorial/InlineText.tsx` for
  inline PT inside headings.
- Per-page accent via `--accent`/`--accent-deep` on the page wrapper (resolves to barn — see Decision log).
- Siblings grid built from a lightweight all-landscapes query, so it is always complete.
- All eight `landscape` docs seeded (`scripts/seed-landscapes.mjs`); Naturen fully authored,
  the other seven identity-only (they `notFound()` until Step 6).

**Reference files:** `Naturen.html` plus `assets/cash-shared.css`.

**Acceptance criteria:**
- `/naturen` renders from Sanity, visually matching `Naturen.html` at 1280px. ✓
- Per-page accent wired (`--accent`); ships barn-red per the template. ✓
- The posts section shows the empty state (0 entries); entries would list reverse-chronologically. ✓
- Siblings grid shows all eight, current highlighted. ✓
- `[landscape]` route 404s unknown/unauthored slugs. ✓

> **Note:** the `[landscape]` route was later renamed to a single `[slug]` dispatcher branching by `_type` (Step 7a, Decision log 2026-06-03).

→ **Phase B complete (archive-stub).** The remaining landscapes (Step 6) reuse this pattern; the
rich `.land` editorial template is the Kulturen page in Step 7.

---

## Phase C — Roll out all content

### Step 6 — Remaining 7 landscape pages

**Outcome:** all 8 landscape archive pages (Naturen, Vesten, Den forgyldte republik, Smeltedigelen, Syd og Nord, Mindretallene, Vækkelsen, Drømmefabrikken) are live with content.

**Includes:**
- The eight `landscape` docs already exist as identity stubs (seeded in Step 5). Author the hero +
  empty-state fields for the seven non-Naturen landscapes (from each `*.html` archive-stub) so they
  pass the page's `deck` guard and stop 404-ing.
- Verify the template handles each landscape's variations; tweak schema if a landscape needs a field the template doesn't have.
- Add navigation entries (already in `siteSettings` from Step 2 — just populate).

**Acceptance criteria:**
- All 8 landscapes load at their respective URLs.
- Top nav dropdown links to each.
- Each renders its own archive stub faithfully (accent ships barn-red per the template; distinct per-landscape accents are a later polish — see Decision log).

> **Note:** the "top nav dropdown links to each" criterion was dropped (template fidelity, Decision log 2026-06-01) — landscapes are reached via the siblings grid and Kulturen.

### Step 7 — Supporting pages

**Split (2026-06-03):** the seven supporting pages are not uniform (three `cash-shared.css`
essay pages, Historien's bespoke era layout, two bespoke utility pages, and the rich Kulturen
`.land` template) and need a routing prerequisite first — too large for one session. Broken into:
- **7a — Routing + Kulturen (done).** Reconciled `[landscape]` → a single `[slug]` dispatcher
  that branches by `_type`; built the Kulturen `.land` template. See below + Decision log.
- **7b — Essay family (block-composed):** Musikeren, Cash og Jesus, Cash og Amerika, built on
  a new reorderable `blocks[]` model (full design in the **Step 7b detail** section below + Decision
  log 2026-06-04). Per-page accent barn/denim/brass. **Two plan-mode sessions:** Plan 1 (block infra
  + Musikeren), Plan 2 (the other two essays).
- **7c — Historien (done):** bespoke 6-era alternating layout (fixed `historienPage` singleton,
  *not* block-composed); routed via the `[slug]` dispatcher. See Decision log 2026-06-04 (7c).
- **7d — Utility pages (done):** Foredrag (ticket/posters/booking form/FAQ) and Bøger/spil/film
  (filter bar/book entries/suggestion form), both fixed bespoke singletons routed via `[slug]`.
  See Decision log 2026-06-04 (7d).

**Outcome:** the remaining non-landscape pages (Historien, Musikeren, Cash og Amerika, Cash og Jesus, Foredrag, Kulturen, Bøger spil film) are live.

**Includes:**
- Each as a Sanity document with appropriate schema (some may share schema, some may need bespoke).
- **Kulturen** is the heavy one: it is the landscapes index/essay and the home of the **rich `.land`
  editorial template** (hero + 8 chips + intro essay + 8 `.land` sections with drop caps, side-essay
  sidebars, era timelines, pull-quotes + outro) that Step 5 originally — and mistakenly — described.
  It reads from the existing eight `landscape` docs; expect to extend the `landscape` schema with the
  `.land` essay/sidebar/timeline fields here. This is the real "rich editorial layout" milestone.
- **Routing note:** the top-level `[landscape]` route from Step 5 will collide with a top-level
  `[slug]` route for these supporting pages (Next.js forbids two differently-named dynamic segments as
  siblings). Reconcile here — e.g. a single disambiguating dynamic segment that branches by document
  type, or route groups.
- May require 1–2 new Portable Text custom blocks (e.g. timeline entries on Historien; drop-cap,
  pull-quote and side-essay serializers for Kulturen's `.land` sections).

**Acceptance criteria:**
- All 18 pages from the original design are reachable on the live site.
- Internal cross-references work.

#### Step 7b — Essay family, block-composed (Plans 1 & 2)

**Reframed 7b.** The three essay pages become the first pages built on a reorderable `blocks[]`
model. Full rationale: **Decision log 2026-06-04** — read it before planning. Summary of what was
decided (a block-builder proposal was pressure-tested and deliberately narrowed):

- **Scope is narrow.** `blocks[]` composition applies to the **home page + these 3 essays only**.
  `landscape` (×8), `kulturenPage`, Historien, Foredrag, and Bøger/spil/film stay **fixed bespoke
  schemas**. The idea of one universal `page` type replacing existing types was **rejected** — it
  would break the landscape set-semantics the siblings grid and `KULTUREN_QUERY` rely on.
- **Curated, closed menu of designed blocks ported ~1:1 from the templates** — pixel-faithful, *not*
  a generic page-builder, *not* genericized up front. **Adding a new block type is a code deploy**
  (accepted); the editor's ongoing power is reorder / toggle / place existing blocks in Studio.
  Cross-page reuse is mostly theoretical on day one — the 3 essays share almost no section types
  (each is 5 bespoke bands; only `next-side` is common) — but the shared menu costs nothing.
- **Fail-loud, no graceful degradation.** `Rule.required()` stays on each block's inner fields
  (Studio won't publish a malformed block); the renderer trusts required fields. **No `best-practices.md`
  §5 rule 5 deviation**, no error boundaries, no `Rule.warning()`. A missing section is just absent
  from the array, not an error.

**Type & routing model.**
- New **slugged `page` document type**: `blocks[]` body + `slug`, `accentColor`
  (barn/denim/brass enum per §4), `seo`. `homePage`/`landscape`/`kulturenPage` untouched here.
- The existing dispatcher `app/(site)/[slug]/page.tsx` (`SLUG_TYPE_QUERY`, `sanity/queries/router.ts`)
  gains a `_type == "page"` branch rendering a new **`BlockRenderer`** that maps each `block._type`
  → its React component. `landscape` + `kulturenPage` branches unchanged.
- Per-page accent via the existing `--accent`/`--accent-deep` wrapper pattern (§4).
- Blocks of essay prose render through the shared `components/editorial/PortableText.tsx` (§6).
- `blocks[]` is a discriminated union typed via `defineQuery` + `sanity typegen` (§2); commit the
  regenerated `sanity/types.ts`.

**Plan 1 — Block infrastructure + Musikeren (one session).**
- Design the shared block object-type menu needed by `Musikeren.html` (sections:
  `vinyl-hero · eras · anatomy · lyric · next-side`). Candidate block types: an essay-hero block,
  a stepped/numbered-list block (`eras`), a prose block (`anatomy`), a pull-quote block (`lyric`),
  a "next essay" link block (`next-side`). **Look for shared structure under the bespoke class names**
  so one type can serve multiple essays (e.g. `eras` / `stations` / `themes` may collapse into one
  `steppedListBlock` with an accent prop) — but only where pixel-fidelity survives; keep genuinely
  distinctive sections as one-off blocks.
- `page` schema + `blocks[]` using `defineType` / `defineField` / `defineArrayMember`, with `preview`
  + `icon` on every type (§5).
- `BlockRenderer` + per-block components under `components/blocks/`.
- `[slug]` dispatcher `page` branch; author + seed the Musikeren `page` doc (follow the existing
  `scripts/seed-*.mjs` pattern, idempotent `createOrReplace` + publish).
- `pnpm types`; commit `sanity/types.ts`.
- **Acceptance:** `/musikeren` renders from Sanity, visually matches `Musikeren.html` at 1280px;
  blocks reorderable/toggleable in Studio; home, landscapes, and Kulturen unchanged; `pnpm build` clean.

**Plan 2 — Cash og Jesus + Cash og Amerika. Split per essay (2026-06-04, user decision):**
each needs ~4 bespoke bands (~8 new block types total), larger than Plan 1 — so one session per
essay, each independently deployable.

**Plan 2a — Cash og Jesus (done).** `/cash-og-jesus` (denim) on four new blocks
(`hymnHero · scriptureStrip · stations · hymnal`) + reused `pullQuote` (extended with
`background`/`borderTone` tone enums for the accent-deep/brass `gospel-pull`) and `nextEssay`
(extended with a `barn` colorScheme). Seeded via `scripts/seed-cash-og-jesus.mjs`. See Decision
log 2026-06-04.

**Plan 2b — Cash og Amerika (remaining).** `/cash-og-amerika` (brass): new blocks `flagHero`
(telegram card + `cash-stars-and-stripes.jpeg` background — engages §7, upload via seed), `statsBar`
(republic-bar), `themes`, `locationGrid` (ameri-map); reuses `pullQuote` (ink/brass, no extension)
and `nextEssay`.
- **Acceptance:** `/cash-og-amerika` renders faithfully at 1280px; 7b complete.

**Reference files:** `Musikeren.html`, `Cash og Jesus.html`, `Cash og Amerika.html`, `assets/cash-shared.css`.

#### Step 7e — Migrate the home page to the block model (Plan 3)

**Gated on 7b** — build the home migration against the proven block system. Independent of 7c/7d;
can land any time after 7b. Full rationale: **Decision log 2026-06-04**.

**What.** Convert the shipped `homePage` singleton from its fixed named-field schema
(`hero` / `ticker` / `vinyls` / `historicalThread` / `hymn` / `contact`, rendered at
`app/(site)/page.tsx:50-58`) to a `blocks[]` body drawing from the shared menu, **reusing the
existing hub components** (`HubHero`, `SetlistTicker`, `HubVinyls`, `HistoricalThread`, `Hymn`,
`ContactSection`) as block components. This is a **refactor, not a redesign** — `/` must look identical.

**Includes.**
- Add the home-specific block types to the shared menu (hub-hero, ticker, vinyl-row,
  historical-thread, hymn, contact). These are home-only on day one — the shared menu is mostly
  disjoint from the essays (accepted, Decision log 2026-06-04).
- `homePage` **stays a singleton** (rendered at `/`, not via `[slug]`); its fixed fields become a
  `blocks[]` array. Keep `seo`.
- `app/(site)/page.tsx` renders via the same `BlockRenderer`; keep a top-level fail-loud throw if
  `blocks` is empty/unpublished (consistent with the current home + layout throws).
- **Content-migrate the one existing `homePage` document** into the block array — update
  `scripts/seed-homePage.mjs` to emit `blocks[]` (idempotent `createOrReplace` + publish, per the
  Step 3 pattern, Decision log 2026-06-01).
- `pnpm types`; commit the regenerated `sanity/types.ts`.

**Acceptance.**
- `/` is **visually identical** to the current shipped home (side-by-side at 1440px).
- Home sections reorderable/toggleable in Studio; editing + publishing a home block updates `/`.
- `pnpm build` clean; no regression to landscapes, Kulturen, or the essays.

**Reference files:** `Johnny og jeg.html`, current `app/(site)/page.tsx` + `components/hub/*`.

---

## Phase D — Production polish

### Step 8 — Accessibility & performance pass

**Includes:**
- WCAG AA color contrast audit.
- Alt text on every image (enforced via Sanity schema validation).
- Keyboard navigation: nav dropdowns (click-to-open + Escape), music player controls, focus rings.
- Lighthouse pass on Performance, A11y, Best Practices, SEO.
- LCP / image size optimization where needed.

**Acceptance criteria:**
- Lighthouse scores ≥ 90 across the board on the hub and one landscape.

> **As built (2026-06-04):** scoped to a11y + perf hygiene; Performance score deferred to Step 10
> with the `force-dynamic` → static/ISR move. A11y/Best-Practices/SEO Lighthouse ≥ 90 on hub +
> `/naturen` (96/100/90 and 96/100/100). Full contrast audit + Lighthouse record in
> `docs/a11y-contrast-audit.md`; brass-on-light contrast failures kept as accepted deviations
> (fidelity-wins). See Metaplan Decision log 2026-06-04 (Step 8).
