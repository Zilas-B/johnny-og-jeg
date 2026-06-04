# Metaplan — Johnny og Jeg

This is the full implementation roadmap for turning the 18-page static design in this folder into a production Next.js + Sanity website. Each **Step** below is sized to become its own focused plan-mode session in Claude Code: you open plan mode, ask for the next step to be planned, review the plan, then implement it.

**Read first:** `TechStack.md` (in this folder) defines the stack and structural decisions; `best-practices.md` defines *how* we use that stack well. This Metaplan describes *what gets built when*. If anything here conflicts with `TechStack.md` or `best-practices.md`, those docs win until amended.

**Completed steps are condensed.** Steps 0–6 are done; their one-line summary lives in the Progress list and their full original `Includes`/`Acceptance criteria` are archived in [`metaplan-archive.md`](./metaplan-archive.md) to keep this file small. The **Decision log** (below) and all pending steps stay here and remain authoritative.

**Build strategy: Sanity-first.** Every page-level step authors its schema, creates the Sanity document, and renders from GROQ — no "hardcode first then migrate" detour. The content model is already fully specified by the 18 static HTML pages in `claude-design-template/`, so there's no schema-discovery argument for hardcoding.

**Visual fidelity: `claude-design-template/` is the visual source of truth.** Every step that produces UI — chrome, hub, landscapes, supporting pages, music player — must reproduce the layout, typography, spacing, colour, and animation of the corresponding file(s) in `claude-design-template/`. Treat the template as a fixed visual target, not code to refactor; do not edit files inside that folder. When a step's plan is drafted, it must name the specific template file(s) it reproduces (the "Reference files" line in each step below points to the canonical one). If a `docs/best-practices.md` rule appears to conflict with a template detail, call it out in the plan with a recommendation — the *visual* outcome defers to the template, the *implementation* technique defers to the docs.

## Locations

- **Design source** (read-only reference): `C:\Users\Andre\Documents\Lokale Git Repositories\johnny-og-jeg\claude-design-template`
- **Project repo** (where code is built): `C:\Users\Andre\Documents\Lokale Git Repositories\johnny-og-jeg`

## How to use this Metaplan

For each step:
1. Open Claude Code in the project repo.
2. Enter plan mode (`/plan` or Shift+Tab to plan mode).
3. Reference this file and the step number, e.g. *"Plan Step 3 from `Metaplan.md`."*
4. Claude will explore the design, ask clarifying questions, write a detailed plan, and you approve it.
5. Exit plan mode and let Claude implement.
6. Verify against the step's **Acceptance criteria**, then move on.

Each step is intended to leave the project in a working, deployable state. If a step starts feeling too large mid-implementation, split it — the goal is "small enough to plan in one sitting."

## Progress

Convention: at the end of each step, mark its checkbox. Use `[x]` for fully done, `[~]` for partial (with a short note), `[ ]` for not started.

- [x] Step 0 — Project scaffold
- [x] Step 1 — Design tokens and global chrome (hardcoded; migrated in Step 2)
- [x] Step 1.5 — Best practices research & audit
- [x] Step 2 — Chrome → Sanity (`siteSettings` singleton + typegen)
- [x] Step 3 — Hub page "Johnny og jeg" (Sanity-first) — schemas, query, components, Presentation/draft-mode plumbing landed; `homePage` doc seeded from the template via `scripts/seed-homePage.mjs` and published.
- [x] Step 4 — Music player (Cash Radio) visual shell — `<MusicPlayer>` Server Component mounted in `app/(site)/layout.tsx`; markup, vinyl spin, tracks, transport buttons, and listen-on chips ported as visual-only chrome. Inert; no Sanity model; `prefers-reduced-motion` halts the disc and live-dot.
- [x] Step 5 — Landscape page template (Naturen archive-stub, Sanity-first) — `landscape` + `archiveEntry` schemas, `[landscape]` dynamic route, three components (`LandscapeHero/Posts/Siblings`), all 8 landscape docs seeded (Naturen fully authored, other 7 identity-only). See Decision log 2026-06-01 for the archive-stub reframe.
- [x] Step 6 — Remaining 7 landscape pages — all eight `landscape` docs fully authored (hero + empty-state + seo) via the extended `scripts/seed-landscapes.mjs`; the seven non-Naturen pages now render instead of `notFound()`. Top-nav criterion dropped (template fidelity). See Decision log 2026-06-01.
- [~] Step 7 — Supporting pages. **Split into 7a–7d** (too large for one session). **7a done:** routing reconciled to a single `[slug]` dispatcher branching by `_type`; **Kulturen** (`/kulturen`) built as the rich `.land` template — `kulturenPage` singleton + `landscape` extended with `.land` essay/sidebar/timeline fields, all 8 sections authored. Remaining: 7b essay family — **reframed as block-composed pages** (Musikeren / Cash og Jesus / Cash og Amerika; 2 plan sessions), 7c Historien, 7d utility pages (Foredrag, Bøger/spil/film). See Decision log 2026-06-03 and 2026-06-04.
- [ ] Step 7e — Home page → block model (Plan 3; gated on 7b). See Decision log 2026-06-04.
- [ ] Step 8 — Accessibility & performance pass
- [ ] Step 9 — SEO & metadata
- [ ] Step 10 — Production launch

Step 0 note: Vercel link + first deploy deferred to a follow-up session (acceptance criterion #4 of Step 0).
Step 1 note: chrome ships hardcoded in JSX; Step 2 migrates it to Sanity — no extended hardcoded period.

---

## Phase A — Visible Sanity-driven prototype (front page)

Goal: end of Phase A, the **front page is live on a Vercel preview URL**, visually faithful to the design, with the music player **visible as a non-functional visual shell** — and **everything an editor sees is editable in Sanity Studio**.

### Step 0 — Project scaffold ✅

Next.js 16 + TS + Tailwind v4 + embedded Sanity Studio, deployed to a Vercel preview. **Full detail → [`metaplan-archive.md`](./metaplan-archive.md).**

### Step 1 — Design tokens and global chrome ✅

Fonts, design tokens (`styles/tokens.css`), paper-grain background, `<Masthead>`/`<Nav>`/`<Footer>` in `app/(site)/layout.tsx` (hardcoded; migrated in Step 2). **Full detail → [`metaplan-archive.md`](./metaplan-archive.md).**

### Step 1.5 — Best practices research & audit ✅

Produced `docs/best-practices.md` (§1–§10) for this stack; `CLAUDE.md` references it. **Full detail → [`metaplan-archive.md`](./metaplan-archive.md).**

### Step 2 — Chrome → Sanity (`siteSettings` singleton) ✅

Chrome migrated to a `siteSettings` singleton; typegen + revalidation route + the a11y/styleguide/env retrofits. **Full detail → [`metaplan-archive.md`](./metaplan-archive.md).**

### Step 3 — Hub page "Johnny og jeg" (Sanity-first) ✅

`homePage` singleton + hub components + shared `PortableText` wrapper + Presentation/draft-mode plumbing; seeded via `scripts/seed-homePage.mjs`. **Migrated to the `blocks[]` model in Step 7e (Decision log 2026-06-04).** **Full detail → [`metaplan-archive.md`](./metaplan-archive.md).**

### Step 4 — Music player (Cash Radio) — visual shell only ✅

`<MusicPlayer>` Server Component in the layout; visual-only, inert, no Sanity model; `prefers-reduced-motion`-aware. **Full detail → [`metaplan-archive.md`](./metaplan-archive.md).**

→ **Phase A complete.**

---

## Phase B — One landscape template

Goal: one of the 8 landscape pages is fully built and Sanity-driven. The template is reusable for the remaining seven.

### Step 5 — Landscape page template ("Naturen") ✅

`landscape` + `archiveEntry` schemas; archive-stub layout (hero + posts + siblings); per-page accent wrapper; all 8 docs seeded (Naturen authored, others identity-only). Route later folded into the `[slug]` dispatcher (Step 7a). Reframed mid-step from a rich editorial layout to an archive-stub — see Decision log 2026-06-01. **Full detail → [`metaplan-archive.md`](./metaplan-archive.md).**

→ **Phase B complete (archive-stub).**

---

## Phase C — Roll out all content

### Step 6 — Remaining 7 landscape pages ✅

All eight `landscape` docs fully authored via `scripts/seed-landscapes.mjs`; the seven non-Naturen pages render. Top-nav criterion dropped (template fidelity, Decision log 2026-06-01). **Full detail → [`metaplan-archive.md`](./metaplan-archive.md).**

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
- **7c — Historien:** bespoke 6-era alternating layout (fixed schema, *not* block-composed).
- **7d — Utility pages:** Foredrag (ticket/posters/booking form/FAQ), Bøger/spil/film
  (filter bar/book entries/suggestion form).

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

---

### Step 7b — Essay family, block-composed (Plans 1 & 2)

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

**Plan 2 — Cash og Jesus + Cash og Amerika (one session).**
- Add the block types unique to these two (`hymn-hero` / `flag-hero`, `stations` / `themes`,
  `hymnal` / `ameri-map`, `gospel-pull` / `ragged`), reusing Plan 1's menu types where structure
  matches. Accents denim / brass (confirm against templates).
- Author + seed both `page` docs; reuse the `BlockRenderer` + dispatcher from Plan 1.
- **Acceptance:** `/cash-og-jesus` and `/cash-og-amerika` render faithfully at 1280px; 7b complete.

**Reference files:** `Musikeren.html`, `Cash og Jesus.html`, `Cash og Amerika.html`, `assets/cash-shared.css`.

---

### Step 7e — Migrate the home page to the block model (Plan 3)

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

### Step 9 — SEO & metadata

**Includes:**
- Per-page `<title>`, meta description, Open Graph tags driven from Sanity.
- `app/sitemap.ts` and `app/robots.ts`.
- Favicons and OG default image.
- Structured data (Article schema) on essay pages.

### Step 10 — Production launch

**Includes:**
- Custom domain configured in Vercel.
- Sanity dataset hardened (review access roles, set up backups).
- 404 / error pages styled.
- **Rendering bundle: move `(site)` from `force-dynamic` to static/ISR.** Today every `(site)` route renders dynamically per request (Decision log 2026-05-26) and fetches via raw `client.fetch(..., {next:{tags}})` with `perspective: 'published'` — the `sanityFetch` helper from `sanity/lib/live.ts` is defined but unused, so Presentation cannot show drafts through these fetches. Static/ISR is the production-correct profile for this read-heavy editorial site and is what the §1 tag-revalidation system was designed for. These pieces are entangled — sequence them as one bundle, do not flip in isolation:
  1. **Wire the `SANITY_API_READ_TOKEN`** in `.env.local` + Vercel (deferred per Decision log 2026-06-01) — prerequisite for both live/draft fetching and the webhook route.
  2. **Wire the Sanity publish → `revalidateTag` webhook** in Sanity Manage (route already ships, Decision log 2026-06-01); without it, ISR pages won't reflect published edits until a rebuild.
  3. **Confirm required singletons (`siteSettings`, `homePage`, `kulturenPage`) are published** — the fail-fast guards in the layout/pages throw, which would break build-time prerender otherwise.
  4. **Refactor page fetches to `sanityFetch`** (§1/§2 intended path) so caching + draft/published switching work; retain a plain `client` for token-less contexts (sitemap, seed scripts). Note call-site shape change (`const { data } = await sanityFetch(...)`).
  5. **Remove `force-dynamic`** from `app/(site)/layout.tsx` last, once 1–4 hold, and verify ISR + tag revalidation end-to-end.
- Final QA pass.

**Acceptance criteria:**
- Site is live at the custom domain.
- A non-developer editor can publish a new archive entry from Studio.

---

## Phase F — Optional enhancements

Pick these à la carte. Each is independently valuable but not required for launch.

- **F1** Search across archive entries (Sanity Embeddings Index for semantic search, or simple text search).
- **F2** RSS / Atom feed for archive entries.
- **F3** Richer scroll-driven animations via Framer Motion.
- **F4** Analytics (Vercel Analytics or Plausible).
- **F5** Newsletter signup (Buttondown / Mailchimp).
- **F6** Print stylesheet for essays.

Music player functionality (real audio AND link-out playback) was previously listed here and in Step 4; both removed by decision (see Decision log). The music player is a visual-only shell, indefinitely.

---

## Estimated effort

These are rough ranges assuming a solo developer working with Claude Code, not promises.

| Phase | Steps | Effort |
|---|---|---|
| A — Visible Sanity-driven prototype | 0–4 | 4–6 days |
| B — One landscape template | 5 | 3–5 days |
| C — All content | 6–7 | 5–8 days |
| D — Production polish | 8–10 | 2–4 days |
| F — Optional | à la carte | varies |

**Total to production (A–D):** roughly 3–4 weeks of focused work.

## Decision log

Track major decisions here as the project evolves. Date, decision, rationale.

- `2026-05-26` — Stack chosen: Next.js 15+ + TypeScript + Tailwind v4 + CSS Modules + Sanity v3 embedded at `/studio`, deployed on Vercel. See `TechStack.md`.
- `2026-05-26` — *Initial* build strategy: prototype front page first (Phase A), then layer Sanity (Phase B), then expand. **Superseded — see entry below.**
- `2026-05-26` — **Build strategy revised: Sanity-first.** The 18 static HTML pages in `claude-design-template/` already fully specify the content model — there's no schema-discovery argument for hardcoding then migrating. The old Phase B (Steps 4–6: schema foundations + hub migration + player migration) dissolves into per-page work. Old Steps 7–12 renumbered to 5–10. Step 1's chrome was the only thing built under the old strategy; new Step 2 migrates it immediately.
- `2026-05-26` — Scaffolded on Next.js 16.2.6 (current latest from `create-next-app@latest`), not 15 as originally planned. Verified compatible with Sanity v5.26.
- `2026-05-26` — **Slug encoding**: ASCII-only (`æ→ae`, `ø→oe`, `å→aa`, lowercase, space/comma → `-`). Reason: no encoding surprises in shares, no edge cases. Native Danish slugs explicitly rejected.
- `2026-05-26` — **Studio language**: keep English Studio UI; content is Danish. Solo developer, all Sanity docs/tutorials match the English labels.
- `2026-05-26` — **Image strategy**: all images go through Sanity assets (image pipeline, focal points, responsive sizes). Reference PNGs/JPGs in `claude-design-template/images/` will be uploaded to Sanity as part of content authoring from Step 3 onward.
- `2026-05-26` — **Per-landscape accent colors**: Sanity dropdown of named palette presets (~8 tokens like `barn / denim / brass / forest / dust / copper / lilac / ochre`, each mapped to a CSS variable in `tokens.css`). Editor can swap which preset a landscape uses but cannot invent new colors. Free color picker explicitly rejected.
- `2026-05-26` — **Music player audio**: link-out only, indefinitely. Real audio (formerly Phase F-1) removed from the optional list. Reason: the editorial focus is text + design fidelity; real playback adds API/state/licensing complexity disproportionate to the editorial value.
- `2026-05-26` — **`siteSettings` is one singleton with grouped fields** (masthead / nav / footer), not three separate singletons. Reason: chrome is conceptually one editor-facing surface; splitting adds navigation friction in Studio.
- `2026-05-26` — **CTA modeled in Sanity** (`siteSettings.cta`), not hardcoded in `Nav.tsx`. Reason: matches Step 2's spirit ("everything an editor sees is editable").
- `2026-05-26` — **Env validation kept on the existing `assertValue` pattern**, not migrated to Zod, despite `docs/best-practices.md` §9 rule 1. Reason: same boot-time-failure behaviour at smaller blast radius; no new dependency. Server secrets are exposed as raw strings (possibly undefined) and asserted at point of use, not at module load — keeps CLI tooling (`pnpm types`) and public page renders working without secrets being set.
- `2026-05-26` — **`styled-components` retained** as a direct dependency. Earlier audit (Step 1.5) flagged it as an unused `create-next-app` default — that was wrong: it is a required peer dependency of `next-sanity@^13`. `TechStack.md`'s "no CSS-in-JS runtime" rule is interpreted as "we won't *author* CSS-in-JS," not "no transitive deps using it."
- `2026-05-26` — **`<SanityLive />` import path**: in `next-sanity@^13`, `defineLive` is exported from `next-sanity/live` (subpath export), not from the package root. `docs/best-practices.md` §1 sketch shows the v11/v12 path; corrected at implementation.
- `2026-05-26` — **`(site)` routes are `force-dynamic`** because every page fetches `siteSettings` server-side via the layout. Freshness comes from tag-based revalidation, not static prerender. `/studio` and `/_not-found` remain static.
- `2026-05-26` — **`revalidateTag` profile**: Next 16 requires a profile argument. Used `'max'` per the Sanity advisory pattern — tag has the longest-lived cache profile and we bust it explicitly on webhook.
- `2026-06-01` — **Step 2 webhook deferred.** `/api/revalidate` route ships with secret verification, but the Sanity webhook itself is not configured in Sanity Manage yet. Dev verification works via `force-dynamic` per-request fetch on `(site)` routes. Production wiring (read token + webhook secret in Vercel, webhook URL pointing at the deployed preview, secret matched) is folded into the first step that exercises a production deploy end-to-end.
- `2026-06-01` — **Masthead side-line bold dropped.** Original Step 1 chrome bolded `Forår MMXXVI` and `Anno MMXXVI` via `<b>` tags. The Sanity-driven Masthead renders the side fields as plain strings (no rich text). Accepted within Step 1's stated ~5% visual tolerance — restoring it would require either a CSS rule that bolds the second line unconditionally or splitting each side into a richer object, both disproportionate for chrome that rarely changes.
- `2026-06-01` — **Schema deploy via Sanity CLI.** Running the MCP authoring tools required the schema to be deployed to the project. Used `pnpm sanity schema deploy` from the local Studio (the MCP's `deploy_schema` tool refuses when a local Studio exists, to prevent source/deploy drift). Schema redeploys happen on-demand when MCP work is needed against new types — not added to `predev`/`prebuild`.
- `2026-06-01` — **`claude-design-template/` is for visuals and content only.** The 18 HTML pages dictate layout, typography, colour, animation, and the literal Danish copy. They do **not** dictate architecture, structure, or stack — those decisions live in `docs/best-practices.md` and `docs/TechStack.md`, and the template never overrides them. Codified in `CLAUDE.md`.
- `2026-06-01` — **Step 3 schema extended past the plan: `vinylsSection`.** Plan modelled `vinyls` as a flat array of 3 `vinylTile` items. The hub design has a section header above the vinyl row ("— Tre rubrikker · Side A · Side B · Side C —" / "Manden i tre spor" / deck). Per the Step 2 "everything an editor sees is editable" principle, the field was widened to an object `{ kicker, heading, deck, items }`. The flat-array shape would have left those strings hardcoded.
- `2026-06-01` — **Step 3 `PortableText` wrapper accepts loose block-like types.** `@portabletext/react`'s exported `PortableTextBlock` type marks `children` as required; Sanity TypeGen marks it optional. Rather than cast at every call site, the wrapper's `value` prop accepts `{_type: string; _key?: string}[]` — the runtime payload is identical and `BasePortableText` doesn't need stricter typing to render correctly.
- `2026-06-01` — **Step 3 draft-mode token check is request-time, not module-load.** `defineEnableDraftMode` needs a Sanity read token to validate Presentation's preview secrets. Token isn't in `.env.local` yet (deferred with the webhook). The enable route returns a 500 with a clear message when the token is missing instead of throwing at import time — keeps `pnpm build` working without a token and makes the missing-token path obvious to a future operator.
- `2026-06-01` — **Step 3 marked done.** `homePage` singleton seeded from the template via `scripts/seed-homePage.mjs` (`sanity exec ... --with-user-token` → `createOrReplace({_id: 'drafts.homePage', ...})` → publish), so `/` renders end-to-end without a manual Studio authoring pass. Script kept in-tree as the canonical re-seed path. `useCdn` flipped to `false` on the server client so editor publish→reload is immediate (no 60s CDN TTL); revisit when the revalidation webhook is wired.
- `2026-06-01` — **Step 5 reframed: landscape pages are archive-stubs, not the rich editorial layout.** Reading the templates showed all eight landscape files (`Naturen.html`, …) are thin archive-stub pages — `arkiv-hero` + an empty `posts` placeholder + a `siblings` grid. The rich page-height editorial layout the original Step 5 prose described (alternating dark/light sections, drop caps, side-essay sidebars, era timeline, pull-quotes) lives **only on `Kulturen.html`**, which renders all eight landscapes as `.land` sections. The Metaplan author conflated the two. Step 5 builds the faithful `/naturen` archive-stub; the rich `.land` template moves to **Step 7 (Kulturen)**. Consequently Step 5 introduced **no `era` document type** (deferred to Kulturen) — only `landscape` + `archiveEntry`.
- `2026-06-01` — **Per-landscape accent ships barn-red (template fidelity).** The static templates (incl. `Naturen.html`) use barn-red throughout; there is no green/“distinct” accent in the design despite the Step 5 acceptance criterion and the 2026-05-26 named-palette decision. Step 5 keeps an `accentColor` field (`options.list` barn/denim/brass) wired to `--accent`/`--accent-deep` on the page wrapper, but every landscape ships `barn`. Introducing visually distinct accents is a deliberate future enhancement, not part of reproducing the design.
- `2026-06-01` — **Step 5 hero/empty-state fields are schema-optional with a page-level guard.** Against `best-practices.md` §5 rule 5 (required on anything rendered unconditionally), the `landscape` hero/empty fields are optional and `[landscape]/page.tsx` calls `notFound()` when `deck` is absent. Reason: landscapes roll out across Steps 5–6, so the seven non-Naturen docs exist as identity-only stubs (seeded for the siblings grid + future Kulturen chips) and would otherwise be permanently invalid in Studio. The guard enforces presence at render time instead.
- `2026-06-01` — **Per-page topstrip + masthead side-lines not reproduced on landscapes.** The archive templates show page-specific topstrip/masthead values; the live chrome is the global `siteSettings` singleton (and the topstrip isn’t implemented at all). Consistent with Step 3, the landscape page renders only its body (hero + posts + siblings) and inherits the global chrome.
- `2026-06-01` — **`[landscape]` route will collide with a future `[slug]` supporting-page route (Step 7).** Next.js forbids two differently-named dynamic segments as siblings at the same level. Step 5 ships `[landscape]` per `TechStack.md`'s target structure; reconciliation (single disambiguating segment branching by `_type`, or route groups) is deferred to Step 7 when the supporting pages land.
- `2026-06-01` — **Step 6 top-nav criterion dropped (template fidelity).** Step 6's "Add navigation entries… Top nav dropdown links to each" rested on the same template/structure conflation as the Step 5 reframe: the static templates' top nav never lists the eight landscapes — `USA ▾` links to `Kulturen.html`, and landscapes are reached only via the siblings grid (built Step 5, queries all eight) and the future Kulturen page (Step 7). The live `siteSettings` nav already mirrors this. Decision (user-approved): leave the nav untouched; cross-landscape navigation works through the siblings grid. The "top nav dropdown" sub-task and acceptance criterion are dropped.
- `2026-06-01` — **`syd-og-nord` H1 corrected to "Syd vs. Nord."** Step 5 seeded the `name` as "Syd & Nord." (`IDENTITY.pre = 'Syd & '`), but `Syd og Nord.html` titles it `Syd vs. <em>Nord</em>.`. Step 6 changed `pre` → `'Syd vs. '` (em-word `Nord` unchanged). `shortName` stays `'Syd & Nord'` — that is what the **siblings grid** shows (`Naturen.html:466`), a legitimately distinct field from the H1.
- `2026-06-01` — **`boeger-spil-film` href normalized.** Naturen's empty-state secondary action linked to `/boger-spil-film`, but the slug rule is `ø → oe` and the live nav uses `/boeger-spil-film`. Step 6 standardized on `/boeger-spil-film` for all eight (fixing Naturen too). Still a forward link until the page lands in Step 7.
- `2026-06-01` — **`seed-landscapes.mjs` refactored to author all eight uniformly.** Step 5 special-cased Naturen and left the other seven as identity-only stubs. Step 6 drove all eight through one `CONTENT` table + a shared `emptyState()` helper (the empty "posts" placeholder is identical boilerplate apart from the bold display name and roman numeral). `createOrReplace` keeps re-runs idempotent.
- `2026-06-03` — **Step 7 split into 7a–7d.** The seven "supporting pages" are heterogeneous (an essay family on `cash-shared.css`, Historien's bespoke era layout, two bespoke utility pages, and the rich Kulturen `.land` template) and gated on a routing fix — ~3–4 sessions, not one. Sub-stepped per the CLAUDE.md "split if too large, stay deployable" rule. 7a (routing + Kulturen) shipped; 7b/7c/7d deferred to their own sessions.
- `2026-06-03` — **Route collision reconciled via a single `[slug]` dispatcher branching by `_type`.** `app/(site)/[landscape]/` was renamed to `app/(site)/[slug]/`; the page fetches `SLUG_TYPE_QUERY` (`sanity/queries/router.ts`) and renders `<LandscapeView>` (`_type == "landscape"`), `<KulturenView>` (`kulturenPage`), or `notFound()`. The old landscape page body moved verbatim into `components/landscape/LandscapeView.tsx` (incl. the `!data.deck` stub guard and `ACCENT_VARS` map). Static siblings (`styleguide`, index `page.tsx`) and `/studio` are unaffected. Chosen over per-page static routes (user-approved) to match TechStack's target structure and avoid 7 near-identical route files.
- `2026-06-03` — **Kulturen models its `.land` content on the existing `landscape` docs, not a separate type.** Added a `kulturenPage` singleton (hero/chips-header/intro/outro/seo) and extended `landscape` with a "Kulturen (.land)" group: `kulturenBgVariant` (paper/paper-2/dark enum), `kulturenEssay` (block array with Normal/h4/pull styles), `kulturenSidebar` (array of `kulturenSideNote` + `kulturenTimeline` objects), plus `kulturenArchiveCta` and `kulturenCardTag` strings. The chip grid, the eight `.land` sections, and the outro archive list all derive from one `KULTUREN_QUERY` that joins the singleton with all eight landscapes (`order asc`), so editing a landscape updates Kulturen too. The `.lside.deep-link` "Til <X>-arkivet →" box is auto-rendered from the slug, not authored.
- `2026-06-03` — **Per-`.land`-section accent driven by `kulturenBgVariant`, reusing the `--accent` wrapper pattern.** `LandSection` sets `--accent`/`--accent-deep` on the section (dark → brass, paper/paper-2 → barn), matching the template's `.land.dark` rules without per-section CSS. The shared `PortableText.module.css` dropcap colour changed `var(--barn)` → `var(--accent)` (no-op for the barn-only landscape archive pages; lets dark Kulturen sections render the cap in brass). The PortableText map gained `h4` + `pull` block styles in the single shared component (§6).
- `2026-06-03` — **`KulturenSubnav` is the page's only `'use client'` leaf** (§3 rule 4): a scroll-revealed sticky TOC ported from the template's vanilla-JS IntersectionObserver to a `useEffect` scroll listener. Everything else on `/kulturen` is server-rendered.
- `2026-06-04` — **Block composition for the home page + the 3 essay pages (and only those).** A
  walkthrough of a (now-deleted) `revision.md` block-builder proposal was pressure-tested and
  substantially narrowed. This entry is the authoritative record; Steps 7b + 7e implement it.
  - **Scope.** Introduce a reorderable `blocks[]` body on the **home page and the three essay pages
    only** (Musikeren, Cash og Jesus, Cash og Amerika). `landscape` (×8), `kulturenPage`,
    **Historien**, **Foredrag**, and **Bøger/spil/film** stay fixed bespoke schemas. The proposal's
    "one universal `page` type replacing homePage/landscape/kulturenPage" is **rejected** — collapsing
    `_type` would break the landscape **set-semantics** the siblings grid and `KULTUREN_QUERY` depend
    on (Decision log 2026-06-03), demoting a real `_type` to a hand-managed discriminator. Historien
    (bespoke era cadence), Foredrag, and Bøger/spil/film were judged structured/functional pages
    (forms, filters, query-driven feeds), not freeform editorial sequences — so not block-composed.
  - **Curated, closed menu of designed blocks ported ~1:1 from the templates** (pixel-faithful per
    Metaplan line 9). *Not* a generic page-builder; *no* up-front genericization. A code **deploy is
    acceptable to add a new block type**; the editor's ongoing power is **placement / reorder / toggle**
    of existing blocks in Studio. Reuse is mostly theoretical day one — the 3 essays share almost no
    section types (each is 5 bespoke bands; grep shows only `next-side` is common). The shared menu
    costs nothing, but expect little cross-page reuse until future (post-18) pages exist.
  - **Two document types, one shared block menu.** `homePage` stays a **singleton** (gains `blocks[]`,
    rendered at `/`); a **new slugged `page` type** serves the essays via the existing `[slug]`
    dispatcher, which gains a `_type == "page"` branch + a `BlockRenderer`. Both draw members from one
    shared object-type menu. **Rejected:** one universal type with optional slug — it would force
    manual home-singleton enforcement and an ambiguous `/` route.
  - **Fail-loud kept; graceful degradation rejected.** `Rule.required()` stays on block inner fields
    (Studio blocks publishing a malformed block); the renderer maps `blocks[] → components` trusting
    required fields, with a top-level throw as backstop. No error boundaries, no `Rule.warning()`, no
    per-block fallbacks. A missing section is simply absent from the array, not an error. **No
    `best-practices.md` §5 rule 5 deviation.** The proposal's claim that degradation removes the
    `force-dynamic` coupling is therefore moot — Step 10's "confirm singletons published before static
    prerender" stands unchanged.
  - **Typing/§6 unchanged.** `blocks[]` is a discriminated union typed via `defineQuery` +
    `sanity typegen` (§2); per-block typed dispatch via `BlockRenderer`. Essay prose still flows
    through the shared `components/editorial/PortableText.tsx` wrapper (§6).
  - **Sequencing — 3 plan-mode sessions.** Plan 1 (block infra + Musikeren) and Plan 2 (the other two
    essays) = reframed **Step 7b**. Plan 3 (migrate the shipped home page last, against the proven
    system, zero-regression target) = new **Step 7e**. Build greenfield essays first; touch the
    working home page last.
- `2026-06-01` — **Step 4 reduced to a visual shell. Music player functionality postponed indefinitely.** Original Step 4 included a `track`/`playlist` Sanity model, server-side fetch, transport state, and external streaming link-outs. All removed — Step 4 now ships the player markup + CSS only, with inert buttons and hardcoded placeholder track names from `cash-radio.js`. Reason: editorial focus is text + design fidelity; even link-out playback adds Sanity model + state + per-track URL maintenance disproportionate to the editorial value. The Phase F "real audio" optional was already dropped on 2026-05-26 — this extends that ethos to the link-out shell too. If the player ever becomes interactive, it lands as a separate scoped step.
