# Metaplan — Johnny og Jeg

This is the full implementation roadmap for turning the 18-page static design in this folder into a production Next.js + Sanity website. Each **Step** below is sized to become its own focused plan-mode session in Claude Code: you open plan mode, ask for the next step to be planned, review the plan, then implement it.

**Read first:** `TechStack.md` (in this folder) defines the stack and structural decisions. This Metaplan describes *what gets built when*. If anything here conflicts with `TechStack.md`, the stack doc wins until amended.

## Locations

- **Design source** (read-only reference): `C:\Users\Andre\Documents\Lokale Git Repositories\johnny-og-jeg\claude-design-template` 
- **Project repo** (where code is built): `C:\Users\Andre\Documents\Lokale Git Repositories\johnny-og-jeg`

## How to use this Metaplan

For each step:
1. Open Claude Code in the project repo.
2. Enter plan mode (`/plan` or Shift+Tab to plan mode).
3. Reference this file and the step number, e.g. *"Plan Step 2 from `Desktop\Cash hjemmeside\Metaplan.md`."*
4. Claude will explore the design, ask clarifying questions, write a detailed plan, and you approve it.
5. Exit plan mode and let Claude implement.
6. Verify against the step's **Acceptance criteria**, then move on.

Each step is intended to leave the project in a working, deployable state. If a step starts feeling too large mid-implementation, split it — the goal is "small enough to plan in one sitting."

## Progress

Convention: at the end of each step, mark its checkbox. Use `[x]` for fully done, `[~]` for partial (with a short note), `[ ]` for not started.

- [x] Step 0 — Project scaffold
- [x] Step 1 — Design tokens and global chrome
- [ ] Step 1.5 — Best practices research & audit
- [ ] Step 2 — Hub page "Johnny og jeg" (hardcoded)
- [ ] Step 3 — Music player (Cash Radio) shell
- [ ] Step 4 — Sanity schema (foundations)
- [ ] Step 5 — Migrate hub page content to Sanity
- [ ] Step 6 — Music player content from Sanity
- [ ] Step 7 — Landscape page template
- [ ] Step 8 — Remaining 7 landscape pages
- [ ] Step 9 — Supporting pages
- [ ] Step 10 — Accessibility & performance pass
- [ ] Step 11 — SEO & metadata
- [ ] Step 12 — Production launch

Step 0 note: Vercel link + first deploy deferred to a follow-up session (acceptance criterion #4 of Step 0).

---

## Phase A — Visible prototype (front page)

Goal: end of Phase A, the **front page is live on a Vercel preview URL**, visually faithful to the design, with the music player visible (link-out only). Content is hardcoded; Sanity isn't wired yet.

### Step 0 — Project scaffold

**Outcome:** an empty but working Next.js 15 + TypeScript + Tailwind + Sanity Studio app, deployed to a Vercel preview URL.

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

### Step 2 — Hub page "Johnny og jeg" (hardcoded)

**Outcome:** the front page (`/`) is a visually faithful reproduction of `Johnny og jeg.html`, content still hardcoded in JSX.

**Includes:**
- Hero section with kicker + display title + deck.
- Era chip grid (4-column, hover lift, roman numerals + names + mottos).
- Landscape teaser sections.
- Intro essay block.
- All section transitions and ornamental dividers.

**Reference files:** `Johnny og jeg.html`.

**Acceptance criteria:**
- Side-by-side, the React version and the original HTML are visually indistinguishable on a 1440px viewport (acceptable: minor pixel-level shifts).
- Hover interactions work on chips.
- The page is responsive down to 768px without obvious breakage.

### Step 3 — Music player (Cash Radio) shell

**Outcome:** the sticky bottom music player is present on every page, with vinyl animation and a hardcoded track list. Play buttons open external streaming links in a new tab — no in-page audio yet.

**Includes:**
- Client component `<MusicPlayer>` mounted in `app/(site)/layout.tsx`.
- Vinyl disc CSS spin animation.
- Now-playing display, track list carousel.
- Play / skip-forward / skip-back UI (skip cycles through tracks visually).
- "Play" button opens YouTube / Spotify / Wistia link in `target="_blank"`.
- Hardcoded track data in a TypeScript file (will move to Sanity in Phase B).
- Mobile breakpoint at 1100px.

**Reference files:** `assets/cash-radio.js`, the player markup at the bottom of any HTML page.

**Acceptance criteria:**
- Player persists across navigation (it's in the layout, not the page).
- Vinyl spins when a track is "playing."
- Track list shows correct track names.
- External links open in a new tab.

→ **Phase A complete.** Share the Vercel URL. Get feedback. Decide whether to proceed to Phase B.

---

## Phase B — Content in Sanity

Goal: the front page is driven by Sanity. Editing in Studio updates the site. The architecture is in place for the 8 landscape pages.

### Step 4 — Sanity schema (foundations)

**Outcome:** Sanity schema covers the hub page and is ready for landscapes.

**Includes:**
- Document types: `siteSettings` (singleton), `homePage` (singleton), `landscape`, `era`, `archiveEntry`, `track` (for music player), `person`.
- Object types: `portableTextEssay`, `imageWithCaption`, `metadataItem`, `eraChip`, `landscapeTeaser`.
- Portable Text custom blocks: drop cap, internal link, footnote, image with caption.
- Configure Vision plugin and Presentation tool for live preview.
- `sanity typegen` configured so types regenerate on schema change.

**Acceptance criteria:**
- Studio shows all document types in the navigation.
- A test homepage document can be created and saved.
- `pnpm sanity typegen generate` produces `sanity.types.ts` without errors.

### Step 5 — Migrate hub page content to Sanity

**Outcome:** the hub page reads from Sanity. Editing in Studio updates the published site (with revalidation).

**Includes:**
- Author the homepage document in Studio with all hub content (extracted from `Johnny og jeg.html`).
- Replace hardcoded JSX with GROQ queries.
- Set up `next-sanity` client (server-side, with `revalidate` strategy).
- Add Sanity webhook → Next.js revalidation route.
- Wire Sanity Presentation tool so editors see drafts inline.

**Acceptance criteria:**
- The hub page renders content fetched from Sanity.
- Editing a field in Studio and publishing updates the live page within a few seconds.
- Visual fidelity from Step 2 is preserved.

### Step 6 — Music player content from Sanity

**Outcome:** the music player track list is editable in Sanity.

**Includes:**
- Move hardcoded track data into Sanity `track` documents.
- Site settings references the active playlist.
- Player component fetches tracks server-side and hydrates the client component with the data.

**Acceptance criteria:**
- Adding a track in Studio adds it to the player.
- Reordering tracks in Studio reorders them in the player.

---

## Phase C — One landscape template

Goal: one of the 8 landscape pages is fully built and Sanity-driven. The template is reusable for the remaining seven.

### Step 7 — Landscape page template ("Naturen" or chosen first)

**Outcome:** one landscape page (e.g. `/naturen`) is live, Sanity-driven, visually matching the design.

**Includes:**
- Dynamic route `app/(site)/[landscape]/page.tsx` (or similar).
- Page-height editorial layout: alternating dark/light sections, drop caps, side essays, metadata sidebars.
- Era timeline section (large roman numeral + years + sub-cards).
- Archive entry feed at bottom ("notebook that grows" model).
- Per-page accent color override via CSS custom properties.
- Cross-references to other landscapes resolve to internal links.

**Reference files:** `Naturen.html` (or chosen first landscape) plus `assets/cash-shared.css`.

**Acceptance criteria:**
- The landscape page renders correctly with content from Sanity.
- Per-page accent color works (e.g. Naturen uses a green accent, Vesten uses something else).
- Archive entries appear in reverse chronological order.
- Visual fidelity to the original HTML.

→ **Phase C complete.** This is the major architectural milestone. The remaining landscapes are repetitions of this pattern.

---

## Phase D — Roll out all content

### Step 8 — Remaining 7 landscape pages

**Outcome:** all 8 landscapes (Naturen, Vesten, Den forgyldte republik, Smeltedigelen, Syd og Nord, Mindretallene, Vækkelsen, Drømmefabrikken) are live with content.

**Includes:**
- Author landscape documents in Studio (one per landscape).
- Verify the template handles each landscape's variations.
- Add navigation entries.

**Acceptance criteria:**
- All 8 landscapes load at their respective URLs.
- Top nav dropdown links to each.

### Step 9 — Supporting pages

**Outcome:** the remaining non-landscape pages (Historien, Musikeren, Cash og Amerika, Cash og Jesus, Foredrag, Kulturen, Bøger spil film) are live.

**Includes:**
- Each as a Sanity document with appropriate schema (some may share schema, some may need bespoke).
- May require 1–2 new Portable Text custom blocks (e.g. timeline entries on Historien).

**Acceptance criteria:**
- All 18 pages from the original design are reachable on the live site.
- Internal cross-references work.

---

## Phase E — Production polish

### Step 10 — Accessibility & performance pass

**Includes:**
- WCAG AA color contrast audit.
- Alt text on every image (enforced via Sanity schema validation).
- Keyboard navigation: nav dropdowns, music player controls.
- Lighthouse pass on Performance, A11y, Best Practices, SEO.
- LCP / image size optimization where needed.

**Acceptance criteria:**
- Lighthouse scores ≥ 90 across the board on the hub and one landscape.

### Step 11 — SEO & metadata

**Includes:**
- Per-page `<title>`, meta description, Open Graph tags driven from Sanity.
- `app/sitemap.ts` and `app/robots.ts`.
- Favicons and OG default image.
- Structured data (Article schema) on essay pages.

### Step 12 — Production launch

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

- **F1** Real audio playback (YouTube IFrame API or Spotify Web Playback SDK).
- **F2** Search across archive entries (Sanity Embeddings Index for semantic search, or simple text search).
- **F3** RSS / Atom feed for archive entries.
- **F4** Richer scroll-driven animations via Framer Motion.
- **F5** Analytics (Vercel Analytics or Plausible).
- **F6** Newsletter signup (Buttondown / Mailchimp).
- **F7** Print stylesheet for essays.

---

## Estimated effort

These are rough ranges assuming a solo developer working with Claude Code, not promises.

| Phase | Steps | Effort |
|---|---|---|
| A — Visible prototype | 0–3 | 3–5 days |
| B — Sanity-driven hub | 4–6 | 3–5 days |
| C — One landscape template | 7 | 3–5 days |
| D — All content | 8–9 | 5–8 days |
| E — Production polish | 10–12 | 2–4 days |
| F — Optional | à la carte | varies |

**Total to production (A–E):** roughly 3–4 weeks of focused work.

## Decision log

Track major decisions here as the project evolves. Date, decision, rationale.

- `2026-05-26` — Stack chosen: Next.js 15 + TypeScript + Tailwind + CSS Modules + Sanity v3 embedded at `/studio`, deployed on Vercel. See `TechStack.md`.
- `2026-05-26` — Build strategy: prototype front page first (Phase A), then layer Sanity (Phase B), then expand. Do not attempt the whole site in one go.
