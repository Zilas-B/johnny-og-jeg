# Metaplan — Johnny og Jeg

This is the full implementation roadmap for turning the 18-page static design in this folder into a production Next.js + Sanity website. Each **Step** below is sized to become its own focused plan-mode session in Claude Code: you open plan mode, ask for the next step to be planned, review the plan, then implement it.

**Read first:** `TechStack.md` (in this folder) defines the stack and structural decisions; `best-practices.md` defines *how* we use that stack well. This Metaplan describes *what gets built when*. If anything here conflicts with `TechStack.md` or `best-practices.md`, those docs win until amended.

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
- [~] Step 7 — Supporting pages. **Split into 7a–7d** (too large for one session). **7a done:** routing reconciled to a single `[slug]` dispatcher branching by `_type`; **Kulturen** (`/kulturen`) built as the rich `.land` template — `kulturenPage` singleton + `landscape` extended with `.land` essay/sidebar/timeline fields, all 8 sections authored. Remaining: 7b essay family (Musikeren / Cash og Jesus / Cash og Amerika), 7c Historien, 7d utility pages (Foredrag, Bøger/spil/film). See Decision log 2026-06-03.
- [ ] Step 8 — Accessibility & performance pass
- [ ] Step 9 — SEO & metadata
- [ ] Step 10 — Production launch

Step 0 note: Vercel link + first deploy deferred to a follow-up session (acceptance criterion #4 of Step 0).
Step 1 note: chrome ships hardcoded in JSX; Step 2 migrates it to Sanity — no extended hardcoded period.

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

### Step 7 — Supporting pages

**Split (2026-06-03):** the seven supporting pages are not uniform (three `cash-shared.css`
essay pages, Historien's bespoke era layout, two bespoke utility pages, and the rich Kulturen
`.land` template) and need a routing prerequisite first — too large for one session. Broken into:
- **7a — Routing + Kulturen (done).** Reconciled `[landscape]` → a single `[slug]` dispatcher
  that branches by `_type`; built the Kulturen `.land` template. See below + Decision log.
- **7b — Essay family:** Musikeren, Cash og Jesus, Cash og Amerika (shared `cash-shared.css`
  layout; per-page accent barn/denim/brass).
- **7c — Historien:** bespoke 6-era alternating layout.
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
- `2026-06-01` — **Step 4 reduced to a visual shell. Music player functionality postponed indefinitely.** Original Step 4 included a `track`/`playlist` Sanity model, server-side fetch, transport state, and external streaming link-outs. All removed — Step 4 now ships the player markup + CSS only, with inert buttons and hardcoded placeholder track names from `cash-radio.js`. Reason: editorial focus is text + design fidelity; even link-out playback adds Sanity model + state + per-track URL maintenance disproportionate to the editorial value. The Phase F "real audio" optional was already dropped on 2026-05-26 — this extends that ethos to the link-out shell too. If the player ever becomes interactive, it lands as a separate scoped step.
