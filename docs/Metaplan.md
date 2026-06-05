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
- [x] Step 7 — Supporting pages. **Split into 7a–7d** (too large for one session). **All four done — Step 7 complete.** **7a done:** routing reconciled to a single `[slug]` dispatcher branching by `_type`; **Kulturen** (`/kulturen`) built as the rich `.land` template — `kulturenPage` singleton + `landscape` extended with `.land` essay/sidebar/timeline fields, all 8 sections authored. **7b Plan 1 done:** block infrastructure (slugged `page` doc + reorderable `blocks[]`, shared block menu `vinylHero · steppedList · cardGrid · pullQuote · nextEssay`, `BlockRenderer`, `[slug]` `page` branch) + **Musikeren** (`/musikeren`) authored & seeded. **7b Plan 2 split per essay (user decision):** **2a done** — **Cash og Jesus** (`/cash-og-jesus`, denim) on four new blocks (`hymnHero · scriptureStrip · stations · hymnal`) + reused `pullQuote`/`nextEssay` (extended). **2b done** — **Cash og Amerika** (`/cash-og-amerika`, brass) on four new blocks (`flagHero · statsBar · themes · locationGrid`) + reused `pullQuote` (ink/brass) / `nextEssay` (barn+denim); introduced the project's first Sanity image pipeline (§7: `sanity/image.ts` + `SanityImage`). **7b complete. 7c done:** **Historien** (`/historien`) built as a fixed bespoke `historienPage` singleton (hero + derived timeline strip + six alternating era sections + outro), routed via the `[slug]` dispatcher; all seven era photos uploaded through §7. **7d done:** **Foredrag** (`/foredrag`) and **Bøger, spil, film** (`/boeger-spil-film`) built as fixed bespoke singletons (`foredragPage`, `bogerPage`) routed via `[slug]`; booking form + category filter + recommendation card are client-leaf visual shells (no backend). **Step 7 complete.** See Decision log 2026-06-03, 2026-06-04 (7c) and 2026-06-04 (7d).
- [x] Step 7e — Home page → block model (Plan 3). Home migrated from its fixed named-field schema to the shared `blocks[]` model: six new home-only block types (`hubHero · setlistTicker · hubVinyls · historicalThread · hymn · contact`) ported 1:1 from the existing fields; the seven hub components reused unchanged (only prop-type aliases re-pointed); `homePage` stays a singleton rendered at `/` via the now-shared `BlockRenderer`. Visually identical; reorderable/toggleable in Studio. See Decision log 2026-06-04 (7e).
- [x] Step 8 — Accessibility & performance pass. A11y/Best-Practices/SEO Lighthouse ≥ 90 on hub + a landscape (96/100/90 and 96/100/100); Performance (88) deferred to Step 10 with the `force-dynamic` → static/ISR move. Nav dropdowns made keyboard-accessible (click/Escape/outside + `aria-expanded`); two real WCAG fixes (heading-order re-tags, MusicPlayer label-in-name); global reduced-motion fallback; LCP `priority` on the Bøger hero map. Full contrast audit in `docs/a11y-contrast-audit.md`; brass-on-light failures kept as accepted deviations (fidelity-wins). See Decision log 2026-06-04 (Step 8).
- [x] Step 9 — SEO & metadata. `app/sitemap.ts` (one `SITEMAP_QUERY` over all public slugs + `_updatedAt`, `_type`→path) and `app/robots.ts` (allow `/`, disallow `/studio`+`/api`, sitemap+host) added; `metadataBase` + a shared `buildMetadata` helper (`components/seo/metadata.ts`) centralise OG/Twitter/canonical with a single static default share image (`public/og-default.jpg`, 1200×630 from a template photo); per-page `seo.title` used verbatim while a bare-heading fallback gets the `%s — Johnny og jeg` suffix (matches the bespoke static `<title>`s); branded `app/icon.svg` + regenerated `app/favicon.ico`; `Article` JSON-LD on the three essays only via `components/seo/JsonLd.tsx`. See Decision log 2026-06-05.
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

### Step 7 — Supporting pages ✅

Split into 7a–7e (too large for one session). All supporting pages live: **Kulturen** (rich `.land` template, 7a) · the three block-composed essays **Musikeren / Cash og Jesus / Cash og Amerika** (7b) · **Historien** (bespoke era layout, 7c) · **Foredrag** + **Bøger/spil/film** (bespoke utility singletons, 7d) · plus the **home-page migration to the shared `blocks[]` model** (7e). Routing reconciled to a single `[slug]` dispatcher branching by `_type`. All 18 pages reachable; cross-references resolve. See Decision log 2026-06-03 / 2026-06-04. **Full detail → [`metaplan-archive.md`](./metaplan-archive.md).**

---

## Phase D — Production polish

### Step 8 — Accessibility & performance pass ✅

A11y/Best-Practices/SEO Lighthouse ≥ 90 on the hub + a landscape (96/100/90, 96/100/100); keyboard-accessible nav dropdowns (click/Escape/outside + `aria-expanded`); WCAG contrast audit in `docs/a11y-contrast-audit.md` with brass-on-light kept as accepted deviations (fidelity-wins); two real WCAG fixes (heading-order, label-in-name); global reduced-motion fallback; LCP `priority` hygiene. Performance (88) deferred to Step 10 with the `force-dynamic` → static/ISR move. See Decision log 2026-06-04 (Step 8). **Full detail → [`metaplan-archive.md`](./metaplan-archive.md).**

### Step 9 — SEO & metadata ✅

Per-page `<title>` / description / OG were already Sanity-driven (Steps 3–8); Step 9 added the remaining pieces: `app/sitemap.ts` + `app/robots.ts`, `metadataBase` + a shared `buildMetadata` helper with a single static default OG image, a branded favicon (`app/icon.svg` + `app/favicon.ico`), and `Article` JSON-LD on the three essays. The base URL is an unasserted `siteUrl` (env → Vercel → localhost), pending the Step 10 custom domain. See Decision log 2026-06-05.

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
- `2026-06-04` — **Step 7b Plan 1 shipped: block infrastructure + Musikeren.** New slugged `page`
  document (`blocks[]` body + `accentColor` enum + `seo`) renders through the `[slug]` dispatcher's
  new `_type == "page"` branch (`PAGE_QUERY` + `BlockRenderer`). The shared closed block menu —
  `vinylHero` (hero + sound-ticker), `steppedList` (eras), `cardGrid` (anatomy), `pullQuote` (lyric),
  `nextEssay` (next-side) — is registered in `sanity/schemas/objects/blocks/` and ported ~1:1 from
  `Musikeren.html`. Per the user-confirmed naming decision, block types use **structural names with
  no speculative props** (built pixel-faithful to Musikeren only); Plan 2 decides per band whether to
  reuse or add types. `page-musikeren` seeded via `scripts/seed-musikeren.mjs` (non-draft `_id`,
  `createOrReplace`, published directly). `ACCENT_VARS` extracted to `components/blocks/accent.ts` and
  reused by `LandscapeView`. `pnpm build`/`lint`/`tsc` clean; `/`, landscapes, and `/kulturen`
  unchanged.
  - **Deviation from the approved plan (best-practices §6 rule 2):** the plan stated "no new
    serializers — Musikeren uses only normal + em/strong." That missed the external links in the era
    prose (Wikipedia/YouTube). Added a `link` annotation to the shared `proseBlock` and a matching
    `link` mark serializer to `components/editorial/PortableText.tsx` (renders `target="_blank"
    rel="noreferrer"`). Additive and §6-correct (the component map is required to cover external
    links); existing landscape/Kulturen content has no link marks, so no regression. Schema mark +
    serializer shipped in the same commit per §6 rule 3.
- `2026-06-04` — **Step 7b Plan 2 split per essay (user decision); Plan 2a shipped: Cash og Jesus.**
  Plan 2 was framed as one session for both remaining essays, but each needs ~4 bespoke bands
  (~8 new block types) — larger than Plan 1. Per the CLAUDE.md "split if too large, stay deployable"
  rule, split into **2a (Cash og Jesus, done)** and **2b (Cash og Amerika, next session)**.
  - **2a built `/cash-og-jesus` (denim) with four new blocks** — `hymnHero` (text + CSS-only
    stained-glass figure), `scriptureStrip` (accent divider band), `stations` (six numbered narrative
    stops; `items[].quote` is the one schema-optional field, §5-justified as legitimately absent on
    stations IV & V), `hymnal` (two-column song list linking out). Ported ~1:1 from
    `Cash og Jesus.html`. Seeded via `scripts/seed-cash-og-jesus.mjs` (non-draft `_id`,
    `createOrReplace`).
  - **Two shared blocks extended (additive, backward-compatible).** `nextEssay.colorScheme` gained a
    `barn` value (+ a `CARD_COLOR` map in the component) for the barn-red Musikeren "Vend pladen"
    card. `pullQuote` gained `background` (`ink`/`accentDeep`) + `borderTone` (`accent`/`brass`) closed
    enums, driven via `--pq-bg`/`--pq-border` CSS vars with a `.glow` modifier swapping the barn-stripe
    overlay for a brass radial — so the denim `gospel-pull` (accent-deep bg, brass borders, brass glow)
    is faithful while Musikeren's `.lyric` is unchanged (both fields default to the Musikeren values
    when unset; Musikeren's seeded doc has them null, no reseed).
  - **No §6 deviation this time** — the `proseBlock` `link` annotation from Plan 1 already covers the
    station Wikipedia links; no new serializers. **§7 not engaged** — Cash og Jesus has no raster
    images (the stained glass is pure CSS). The `/cash-og-amerika` `nextEssay` card is a known forward
    404 until 2b ships (same pattern as the `boeger-spil-film` forward links). `pnpm types`/`build`/
    `lint` clean; `/`, landscapes, `/kulturen`, and `/musikeren` verified unchanged.
- `2026-06-04` — **Step 7b Plan 2b shipped: Cash og Amerika; 7b complete.** Built `/cash-og-amerika`
  (brass) with four new blocks ported ~1:1 from `Cash og Amerika.html` — `flagHero` (flag-photo
  background + telegram card), `statsBar` (`republic-bar`), `themes` (five numbered themes + song-pin
  link-outs), `locationGrid` (`ameri-map`, 4 place cards). Reuses the shared `pullQuote`
  (`background:'ink'` + `borderTone:'brass'` for the `.ragged` band) and `nextEssay` (barn + denim
  cards) with **no further extension**. Seeded via `scripts/seed-cash-og-amerika.mjs` (non-draft `_id`,
  `createOrReplace`). The Cash og Jesus → `/cash-og-amerika` forward link now resolves.
  - **§7 (image pipeline) engaged for the first time.** The flag background is the project's first
    raster image. User decision (this session): build the full §7 path and keep the image in Sanity
    (not a local CSS-only fallback). Added `sanity/image.ts` (`createImageUrlBuilder` → `urlFor`) and
    `components/editorial/SanityImage.tsx` (a reusable `next/image` wrapper reading
    `asset.metadata.dimensions` + `lqip`, with a `fill` mode for backgrounds), plus `cdn.sanity.io` in
    `next.config.ts` `images.remotePatterns`. The seed performs the first `client.assets.upload('image',
    …)` (Sanity dedupes by content hash, so re-runs reuse the asset). Verified: the flag renders through
    `/_next/image?url=…cdn.sanity.io…&auto=format` with a base64 lqip blur placeholder. This is the
    reusable precedent for all future images and Step 8's perf pass.
  - **Deviation 1 (heading colours).** The flagHero `<h1>` carries two distinct non-accent colours —
    `og` barn-red, `Amerika.` brass — which the shared `inlineBlock`/`InlineText` (single `em` accent)
    cannot express. Modelled the heading as three bespoke string parts (`headingLead`/`headingAmp`/
    `headingGold`); the component renders the `.amp`/`.gold` spans. Documented deviation from the
    inlineBlock-heading convention, justified by the fixed two-colour structure (not editor-variable).
  - **Deviation 2 (ragged texture).** Reusing `pullQuote` for `.ragged` reproduces ink bg + brass
    borders/quote-marks/✶ + brass kicker faithfully, but `pullQuote`'s overlay is a single 12px barn
    horizontal stripe whereas `.ragged` layers brass-horizontal (18px) + barn-vertical (4px) stripes —
    a sub-10%-opacity texture behind dark text. Accepted within the ~5% visual tolerance; **no third
    overlay variant added** (honouring the Metaplan's explicit "pullQuote, no extension").
  - `pnpm types`/`tsc`/`build`/`lint` clean. Regression: `/`, `/musikeren`, `/cash-og-jesus`,
    `/kulturen`, and the landscapes all return 200 and are unchanged.
- `2026-06-04` — **Step 7c shipped: Historien (`/historien`).** Built as a fixed bespoke
  **`historienPage` singleton** — *not* block-composed (Decision log 2026-06-04 keeps Historien a fixed
  schema). Modelled exactly like `kulturenPage`: a pinned singleton (structure.ts) routed through the
  `[slug]` dispatcher via `SLUG_TYPE_QUERY`'s new `(_type == "historienPage" && $slug == "historien")`
  branch (mirrors the kulturen fixed-path match). Ported 1:1 from `Historien.html`.
  - **Schema.** `historienPage` (hero · `eras[]` · outro · seo) + a registered `historienEra` object
    (roman/period/navName/timelineName/heading/deck/body/image(+collage)/credit/cashnote/posts). The
    hero "Bladre i" list **and** the timeline strip are both **derived from `eras[]`** in the renderer
    (single source). **Dark + photo-reversed acts (II/IV/VI) are derived from the array index**, not a
    stored field. Per §5: every type has `preview` + the page/object carry `icon`/preview; required
    validation on everything rendered unconditionally (only `posts`/`imageCollage` optional).
  - **§7 engaged.** Seven era photos uploaded via `scripts/seed-historien.mjs` (the second image-using
    seed). Act IV renders the two-photo collage (`era-4-migrant-mother` + `era-4-iwo-jima`); the others
    are single framed photos with a `shape` (wide/tall/sq) field, all through `SanityImage` (`fill`).
  - **§6 unchanged** — era prose uses only the existing normal + em/strong; cash-note song + outro
    card lines render through `InlineText`; no new serializers.
  - **Deviation (minor, ~5% tolerance):** the schema uses one `period` per era for the stamp, year-chip,
    hero-list and timeline. Act VI therefore shows `1989 — nutid` in the hero-list/timeline where the
    template shows the shorter `1989 — nu` (stamp/chip already say `nutid`). Judged not worth a second
    field. Outro buttons forward-link to `/boeger-spil-film` + `/foredrag` (known forward-404 until 7d,
    same pattern as prior steps).
  - `pnpm types`/`tsc`/`build`/`lint` clean; seed verified (6 eras, act-IV collage, image dims+lqip,
    7 outro items, router → `historienPage`). `/`, `/musikeren`, `/cash-og-jesus`, `/cash-og-amerika`,
    `/kulturen`, and the landscapes unchanged. **Remaining in Step 7: 7d (utility pages).**
- `2026-06-04` — **Step 7d shipped: Foredrag + Bøger/spil/film; Step 7 complete.** The two utility
  pages built as fixed bespoke singletons (`foredragPage` `/foredrag`, `bogerPage`
  `/boeger-spil-film`) — *not* block-composed (Decision log 2026-06-04 keeps both as
  structured/functional pages). Both pinned in structure.ts and routed via `SLUG_TYPE_QUERY`'s new
  fixed-path branches (`$slug == "foredrag"` / `$slug == "boeger-spil-film"`), mirroring kulturen/
  historien. Ported 1:1 from `Foredrag.html` and `Bøger, spil, film.html`.
  - **Foredrag.** hero + ticket-stub · three programme posters · dark practical grid · venues +
    testimonial · booking copy · FAQ. The **booking form is a visual shell** (`BookingForm.tsx`, the
    one client leaf, §3 rule 4) — required-field validation + a client-side success note, nothing sent
    (TechStack: forms out of scope; a real Resend/Formspree backend is a later decision, consistent
    with the music-player visual-shell precedent). Form field labels/placeholders are functional UI
    hardcoded in the component; only the surrounding editorial copy is authored.
  - **Bøger/spil/film.** hero + literary-map (§7) · category filter bar · three full book reviews
    (§7 covers + Saxo buy-links) · empty Spil/Film states with "coming" preview lists · invitation +
    recommendation card. Two client leaves (§3 rule 4): `CategoryFilter.tsx` (toggles visibility of the
    server-rendered category blocks — heavy review/image rendering stays on the server, the client only
    flips a `hidden` class, a faithful rewrite of the template's vanilla-JS handler) and `AddCard.tsx`
    (visual-shell recommendation input). Four images uploaded via `scripts/seed-boger.mjs`
    (`literary-usa-map` + 3 covers); `rating` modelled as a 1–5 number rendered to ★/dimmed-★.
  - **§6 unchanged** — both pages use only normal + em/strong prose through `PortableText`/`InlineText`;
    no new serializers. **§5** — every object has `preview`; required validation throughout (shared
    loosely-typed `req` helper, documented). Internal links resolved: Historien's outro and Cash og
    Jesus/Amerika `nextEssay` forward-links to `/foredrag` + `/boeger-spil-film` now all resolve.
  - `pnpm types`/`tsc`/`build`/`lint` clean; both seeds verified (Foredrag: 3 programs/10 venues/6 FAQ/
    4 practical cells/4 ticket lines; Bøger: 3 books w/ cover dims + map lqip, 4+5 previews; both
    routers resolve). All prior routes unchanged. **Step 7 (all of 7a–7d) complete; next is 7e (home →
    block model) or Step 8.**
- `2026-06-04` — **Step 7e shipped: home page migrated to the block model; the "home + 3 essays on blocks" scope is complete.** The `homePage` singleton was converted from its fixed named-field schema (`hero`/`signatureCard`/`ticker`/`vinyls`/`historicalThread`/`hymn`/`contact`) to a `blocks[]` body drawing from six **new home-only block object types** (`hubHero` — combines hero + signature card into one block since `HubHero` renders them as a single grid — · `setlistTicker` · `hubVinyls` · `historicalThread` · `hymn` · `contact`), each ported 1:1 from the prior fields (inner `tickerItem`/`vinylTile`/`timelineEvent` objects reused unchanged; shared `_shared.inlineBlock` reused for the inline PT fields). A **refactor, not a redesign** — `/` is byte-for-byte identical.
  - **`homePage` stays a singleton** rendered at `/` (not via `[slug]`); its body now renders through the **shared `BlockRenderer`**, which 7e broadened to serve both `page` and `homePage` blocks. Typed as an **array of the union** (`AnyBlock[]`), not a union of arrays, so `.map` typechecks; `PageBlock[]`/`HomeBlock[]` are assignable by array covariance, leaving the `[slug]` essay branch untouched.
  - **Hub components reused unchanged in markup** — only their derived prop-type aliases re-pointed from named fields (`HOME_PAGE_QUERY_RESULT['vinyls']` …) to block members (`Extract<HomeBlock, { _type: 'hubVinyls' }>`), mirroring the essay block-component pattern. The two components that take inner fields (`HubHero`, `SetlistTicker`) are fed `block.hero!`/`block.items!` — required fields trusted (fail-loud §6, no graceful degradation), consistent with existing `!` usage.
  - **Content-migrated** the one `homePage` doc via the rewritten `scripts/seed-homePage.mjs` (now `createOrReplace` on published `_id: 'homePage'`, same Danish copy verbatim, idempotent) and **deleted the stale pre-7e `drafts.homePage`** (old named-field shape) so Studio shows the clean published block doc.
  - **No §3 client leaves added** (all hub components stay Server Components); **§4/§7 not engaged** (home has no per-page accent or new images); **§8 preserved** (`generateMetadata` still reads `seo`; H1 fallback moved to the first `hubHero` block). `pnpm types`/`tsc`/`build`/`lint` clean; `/` renders all six sections and `/musikeren`, `/cash-og-jesus`, `/cash-og-amerika`, `/kulturen`, `/historien`, `/foredrag`, `/boeger-spil-film`, `/naturen`, `/styleguide` all return 200, unchanged. **Next: Step 8 (a11y & performance).**
- `2026-06-04` — **Step 8 shipped: accessibility & performance pass.** The codebase
  already satisfied most of best-practices §10 (`<html lang="da">`, skip-link, global
  `:focus-visible`, required image `alt`, a reduced-motion + `aria-live` music player).
  Step 8 closed the remaining gaps and ran Lighthouse. **Two scoping decisions (user, this
  session):**
  - **Contrast — fidelity wins, audit + document only.** Produced `docs/a11y-contrast-audit.md`
    (WCAG 2.1 ratios for every real text/background token pair). The only AA failures are
    **brass / brass-deep as a foreground on light paper** (e.g. paper-on-brass vinyl-tile label
    2.03; brass kickers/eyebrows/numerals on paper) plus a 4.49 footer quote a hair under 4.5 —
    the template's signature editorial labels. **Kept as accepted deviations, not recoloured**,
    continuing the standing fidelity-over-criteria precedent (2026-06-01). Brass on *dark* bands
    (ink 7.59, denim-deep 5.66) passes, so the token is fine wherever the template puts it on dark;
    a future minimal fix would be a darker brass token used only on light backgrounds.
  - **Performance — a11y-focused now, score deferred to Step 10.** Rendering is still
    `force-dynamic` with the read token unwired (the static/ISR bundle is Step 10, lines 271–276),
    which caps Lighthouse Performance. Step 8 targeted **A11y / Best Practices / SEO ≥ 90** and did
    cheap perf hygiene; the binding **Performance ≥ 90** acceptance moves to Step 10.
  - **Code changes.** (1) **Nav dropdowns made keyboard-accessible** (`components/chrome/Nav.tsx`,
    the one real change): click-to-open, `aria-expanded`/`aria-controls`, Escape-closes-and-refocuses,
    click/focus-outside-closes (document listeners mounted only while open, mirroring the
    `KulturenSubnav` client-leaf pattern); CSS gains `.itemOpen` alongside the existing
    `:hover`/`:focus-within` so pointer hover is unchanged (template fidelity). (2) Global
    `prefers-reduced-motion` fallback in `styles/globals.css` (per-module guards already existed).
    (3) LCP `priority` added to the above-the-fold Bøger hero map (`BogerView`); all `SanityImage`
    call sites already passed `sizes`, no raw `<img>` anywhere (§7). **Two real WCAG fixes surfaced
    by Lighthouse and fixed (not contrast, visually free):** `heading-order` skips re-tagged
    (`HubHero` sig-quote h3→h2, `ContactSection` booking h4→h3, `Footer` columns h5→h2 — styling is
    CSS-class-driven, zero visual change) and `label-content-name-mismatch` (removed the music
    player's mismatched `aria-label` so its accessible name equals its visible text, WCAG 2.5.3).
  - **Lighthouse (local `pnpm start`, headless):** hub `/` = 88 / 96 / 100 / 90, `/naturen` =
    88 / 96 / 100 / 100 (Perf / A11y / BP / SEO). A11y/BP/SEO ≥ 90 met on both; the sole remaining
    A11y deduction is the accepted brass `color-contrast`. `pnpm lint`/`build` clean; all routes
    return 200, visually unchanged. **No best-practices deviation** (the contrast call is an
    explicit user decision, recorded; no §-rule was broken). **Next: Step 9 (SEO & metadata).**
- `2026-06-05` — **Step 9 shipped: SEO & metadata.** Most of §8 was already in place from
  Steps 3–8 (an `seo` object on every public document type; per-page `generateMetadata` reading
  it with H1/first-paragraph/hero fallbacks). Step 9 added the four missing pieces and refactored
  the repeated metadata construction into one helper.
  - **Base URL.** New unasserted `siteUrl` export in `sanity/env.ts` (`NEXT_PUBLIC_SITE_URL` →
    `https://$VERCEL_PROJECT_PRODUCTION_URL` → `http://localhost:3000`), documented in
    `.env.example`. Intentionally *not* asserted (unlike the Sanity public vars) because no
    production domain is wired until Step 10 — the fallback keeps sitemap/robots/canonical correct
    on previews and locally. Set the real origin at launch.
  - **`metadataBase` + shared `buildMetadata`** (`components/seo/metadata.ts`). The root layout sets
    `metadataBase` (so relative OG/canonical URLs resolve) and owns the `%s — Johnny og jeg` title
    template. `buildMetadata` centralises `openGraph` + `twitter` (`summary_large_image`) + canonical
    and the default-OG fallback, replacing the ~7 hand-rolled `openGraph` blocks across the root
    layout, home, the five `[slug]` branches, and `landscapeMetadata`.
  - **Title resolution mirrors the bespoke static `<title>`s.** They are *not* a uniform suffix
    ("Musikeren — Johnny Cash", "Naturen — Kulturen · Johnny og jeg", "Foredrag — Johnny og jeg").
    So an editor-set `seo.title` is used **verbatim** (`title.absolute`); only the bare-heading
    `fallbackTitle` flows through the root template and gets the `— Johnny og jeg` suffix. (First cut
    used a single string title under the template and double-suffixed every page — caught by a live
    `<title>` check and corrected to the `seoTitle`/`fallbackTitle` split.) Live titles now match the
    templates exactly.
  - **One OG source (§8 rule 6).** A single static `public/og-default.jpg` (1200×630, cover-crop of a
    template photo via `scripts/gen-brand-assets.mjs` + sharp) is the fallback; editor `seo.ogImage`
    overrides it per page. No `opengraph-image.tsx` — everything flows through the metadata API, so no
    file-convention/metadata precedence surprises.
  - **Favicon.** Branded `app/icon.svg` (ink rounded square + brass five-point star, from the
    palette in `tokens.css`) is the source of truth; `app/favicon.ico` is regenerated from it by the
    same script (PNG-in-ICO) so the two can't drift. The generic create-next-app favicon is replaced.
  - **JSON-LD `Article` on the three essays only** (`components/seo/JsonLd.tsx` + `articleSchema`),
    built from the same Sanity fields rendered on-page; `_createdAt`/`_updatedAt` added to
    `PAGE_QUERY` for `datePublished`/`dateModified`. Per the user decision this session, scope is the
    literal §8 "per essay" — the `_type == "page"` docs (Musikeren, Cash og Jesus, Cash og Amerika);
    Historien/Kulturen/landscapes/utility pages emit none. Verified live: 1 block per essay, 0
    elsewhere.
  - **Deviation (best-practices §6 rule 5).** `JsonLd` uses `dangerouslySetInnerHTML` for the
    `<script type="application/ld+json">`. §6 rule 5 ("no `dangerouslySetInnerHTML`, ever") is scoped
    to *Portable Text content* rendering; JSON-LD injection is the Next.js-sanctioned mechanism and
    the payload is `JSON.stringify` output we control, with `<` escaped to `<` to bar a
    `</script>` breakout. No untrusted-HTML path.
  - **Sitemap + robots.** `app/sitemap.ts` (one `SITEMAP_QUERY` — 8 landscapes with a `deck` + 3
    `page` essays + 5 fixed singletons = 16 URLs, tagged with every public `_type` so the §1 webhook
    busts it) and `app/robots.ts` (allow `/`, disallow `/studio`+`/api`, `sitemap`+`host`).
  - `pnpm types`/`build`/`lint` clean; live smoke test of `/sitemap.xml`, `/robots.txt`, all route
    titles/canonicals/OG, the essay JSON-LD, and HTTP 200 + correct content-type for every route,
    `icon.svg`, `favicon.ico`, `og-default.jpg`. **Next: Step 10 (production launch).**
- `2026-06-01` — **Step 4 reduced to a visual shell. Music player functionality postponed indefinitely.** Original Step 4 included a `track`/`playlist` Sanity model, server-side fetch, transport state, and external streaming link-outs. All removed — Step 4 now ships the player markup + CSS only, with inert buttons and hardcoded placeholder track names from `cash-radio.js`. Reason: editorial focus is text + design fidelity; even link-out playback adds Sanity model + state + per-track URL maintenance disproportionate to the editorial value. The Phase F "real audio" optional was already dropped on 2026-05-26 — this extends that ethos to the link-out shell too. If the player ever becomes interactive, it lands as a separate scoped step.
