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
- [ ] Step 3 — Hub page "Johnny og jeg" (Sanity-first)
- [ ] Step 4 — Music player (Cash Radio) shell (Sanity-first)
- [ ] Step 5 — Landscape page template (one landscape, Sanity-first)
- [ ] Step 6 — Remaining 7 landscape pages
- [ ] Step 7 — Supporting pages
- [ ] Step 8 — Accessibility & performance pass
- [ ] Step 9 — SEO & metadata
- [ ] Step 10 — Production launch

Step 0 note: Vercel link + first deploy deferred to a follow-up session (acceptance criterion #4 of Step 0).
Step 1 note: chrome ships hardcoded in JSX; Step 2 migrates it to Sanity — no extended hardcoded period.

---

## Phase A — Visible Sanity-driven prototype (front page)

Goal: end of Phase A, the **front page is live on a Vercel preview URL**, visually faithful to the design, with the music player visible (link-out only) — and **everything an editor sees is editable in Sanity Studio**.

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
- `homePage` singleton schema with: hero kicker, display title, deck, era chip array (each with roman numeral, name, motto), landscape teaser array (4 items), intro essay (Portable Text), section dividers config.
- Reusable object types introduced here as needed: `eraChip`, `landscapeTeaser`, and `portableTextEssay` with custom blocks (drop cap, internal link, footnote, image with caption).
- Author the `homePage` document in Studio with all hub content extracted from `Johnny og jeg.html`.
- Render the hub page as a server component via GROQ + Portable Text serializers.
- Wire the **Sanity Presentation tool** so editors see drafts inline at `/studio/presentation`.

**Reference files:** `Johnny og jeg.html`.

**Acceptance criteria:**
- Side-by-side, the React version and the original HTML are visually indistinguishable on a 1440px viewport (acceptable: minor pixel-level shifts).
- All hub content is editable in Sanity Studio.
- Editing a hub field in Studio and publishing updates the live page within a few seconds.
- Presentation tool shows draft + published states.
- Hover interactions work on chips.
- Responsive down to 768px without obvious breakage.

### Step 4 — Music player (Cash Radio) shell (Sanity-first)

**Outcome:** the sticky bottom music player is present on every page with vinyl animation, **driven from Sanity**. Editor adds/reorders tracks in Studio. Play buttons open external streaming links in a new tab — no in-page audio yet (real audio is Phase F-1).

**Includes:**
- `track` document schema: title, artist (default "Johnny Cash"), year, external URL (Spotify/YouTube/etc.), runtime, notes.
- Active playlist: either a `tracks: track[]` array on `siteSettings`, or a separate `playlist` singleton referencing tracks. Decide during planning.
- Author 6–8 starter tracks in Studio.
- Server-side fetch of tracks in `app/(site)/layout.tsx`; pass as props to `<MusicPlayer>` client component.
- Vinyl disc CSS spin animation.
- Now-playing display, track list carousel.
- Play / skip-forward / skip-back UI (skip cycles through tracks visually).
- "Play" button opens YouTube / Spotify / Wistia link in `target="_blank"`.
- Mobile breakpoint at 1100px.

**Reference files:** `assets/cash-radio.js`, the player markup at the bottom of any HTML page.

**Acceptance criteria:**
- Player persists across navigation (it's in the layout, not the page).
- Vinyl spins when a track is "playing."
- Track list reflects Sanity order.
- Adding a track in Studio adds it to the player.
- Reordering tracks in Studio reorders them in the player.
- External links open in a new tab.

→ **Phase A complete.** Share the Vercel URL. Get feedback. Decide whether to proceed to Phase B.

---

## Phase B — One landscape template

Goal: one of the 8 landscape pages is fully built and Sanity-driven. The template is reusable for the remaining seven.

### Step 5 — Landscape page template ("Naturen" or chosen first)

**Outcome:** one landscape page (e.g. `/naturen`) is live, Sanity-driven, visually matching the design.

**Includes:**
- `landscape` document schema with slug, accent color (oklch / hex), kicker, title, deck, hero image, alternating dark/light section blocks (Portable Text with side essays, drop caps), era timeline (large roman numeral + years + sub-cards via `era` document references), archive entry feed (via `archiveEntry` references).
- New document types as needed: `era`, `archiveEntry`.
- Dynamic route `app/(site)/[landscape]/page.tsx`.
- Page-height editorial layout: alternating dark/light sections, drop caps, side essays, metadata sidebars.
- Per-page accent color override via CSS custom properties (read from the `landscape` doc, applied as a body-level `--accent`).
- Cross-references to other landscapes resolve to internal links.
- Author the first landscape (Naturen) in Studio.

**Reference files:** `Naturen.html` (or chosen first landscape) plus `assets/cash-shared.css`.

**Acceptance criteria:**
- The landscape page renders correctly with content from Sanity.
- Per-page accent color works (Naturen uses a green accent, etc.).
- Archive entries appear in reverse chronological order.
- Visual fidelity to the original HTML.

→ **Phase B complete.** This is the major architectural milestone. The remaining landscapes are repetitions of this pattern.

---

## Phase C — Roll out all content

### Step 6 — Remaining 7 landscape pages

**Outcome:** all 8 landscapes (Naturen, Vesten, Den forgyldte republik, Smeltedigelen, Syd og Nord, Mindretallene, Vækkelsen, Drømmefabrikken) are live with content.

**Includes:**
- Author landscape documents in Studio (one per landscape).
- Verify the template handles each landscape's variations; tweak schema if a landscape needs a field the template doesn't have.
- Add navigation entries (already in `siteSettings` from Step 2 — just populate).

**Acceptance criteria:**
- All 8 landscapes load at their respective URLs.
- Top nav dropdown links to each.
- Per-landscape accent colors all distinct and on-brand.

### Step 7 — Supporting pages

**Outcome:** the remaining non-landscape pages (Historien, Musikeren, Cash og Amerika, Cash og Jesus, Foredrag, Kulturen, Bøger spil film) are live.

**Includes:**
- Each as a Sanity document with appropriate schema (some may share schema, some may need bespoke).
- May require 1–2 new Portable Text custom blocks (e.g. timeline entries on Historien).

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

Real audio playback was previously listed here; removed by decision (see Decision log). Music player is link-out only, indefinitely.

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
