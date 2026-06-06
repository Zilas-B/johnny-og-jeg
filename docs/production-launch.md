# Production launch — Step 10

The execution plan for Step 10 of `Metaplan.md`. Scoped and pressure-tested in a
grill-me session on 2026-06-05; this file is the authoritative breakdown of *what
ships, in what order, and how it's verified*. The Metaplan's Step 10 prose and its
Decision log are reconciled against this (see **Metaplan reconciliations** at the end).

**One-line goal:** move `(site)` from `force-dynamic` to SSG + on-demand ISR, launch on
`johnnyogjeg.dk`, with a non-technical admin able to publish an archive entry and see it
appear within seconds.

---

## Scope decisions (settled)

| Decision | Resolution |
|---|---|
| Webhook target | **`https://johnny-og-jeg.vercel.app/api/revalidate`** — the stable Vercel URL, not the custom domain. Survives the domain change and lets ISR be verified before the domain is bought. |
| ISR vs Presentation | **Two separate bundles.** Ship ISR first (gates the acceptance criteria). Presentation/draft mode is *not* needed for launch. |
| Rendering profile | **SSG via `generateStaticParams` + `dynamicParams = true`**, refreshed by **tag-based `revalidateTag`** (webhook). **No** time-based `revalidate` backstop. |
| Freshness failure mode | Webhook-only. Mitigation is operational: watch Sanity Manage → API → Webhooks delivery logs. Accepted risk: silent staleness if a delivery fails (fix = redeploy or manual revalidate). |
| Custom domain | `johnnyogjeg.dk` (available, not yet purchased). Buying + attaching is part of this step but is a near-independent final task. |
| 404 / errors | **Styled 404 only**, with site chrome (`app/(site)/not-found.tsx`). Generic Next fallback for all other runtime errors — no custom `error.tsx` / `global-error.tsx`. |
| Editor access | Free plan has no granular Editor role → the real (non-technical) editor becomes a Sanity **Administrator**. Accepted. |

### Deferred to Phase F / dropped
- **Presentation / draft mode** (`SANITY_API_READ_TOKEN` + `sanityFetch` refactor) → Phase F. Editor publishes and sees it live via ISR.
- **Backups** → Phase F. Launching with no backup mechanism; re-seed from `scripts/seed-*.mjs` if needed.
- **Performance ≥ 90 / Lighthouse** → not a launch gate; no Lighthouse work this step.
- **Editor handoff doc** → out of scope (walked through live if needed).

---

## Acceptance criteria

1. Site is live at **`https://johnnyogjeg.dk`**.
2. A non-developer **admin** editor can create + publish a new `archiveEntry` in Studio,
   and it appears in that landscape's feed within seconds (no redeploy).

---

## Sequence

The work is ordered so the site stays deployable at every step and ISR is fully proven on
the vercel.app URL **before** the domain is touched. Phase 0 settles account ownership
first, so every later phase configures the live infrastructure **once**, under the final
owner's accounts.

### Phase 0 — Ownership & accounts (prerequisite; do before Phase 1)

> **Status: DONE (2026-06-05).** Sanity project `xx10xher` **transferred** (not recreated)
> into the owner's org `oKqcQm8P0` (Zilas Bastrup) — Project ID + `production` dataset
> unchanged, so no code/env edits were needed; an empty duplicate the owner had created
> (`qas3bsu8`) was deleted. Vercel project created under the owner; first deploy green at
> **`johnny-og-jeg.vercel.app`** (the exact planned webhook target — no plan change).
>
> **Deviation — repo ownership:** the plan assumed the repo could stay on the developer's
> GitHub with the owner's Vercel granted read access. That doesn't work on **Vercel Hobby
> (free)**: Hobby can't deploy a collaborator repo owned by *another personal account* (Vercel
> only lists repos owned by the connected account), and it **can't deploy a GitHub-org-owned
> repo at all** (org repos require Pro). Resolution: the repo was **transferred to the owner's
> personal GitHub account** (`Zilas-B/johnny-og-jeg`), with the developer added back as a
> **collaborator** (retains push access). The developer's local `origin` was repointed to the
> new URL. Net effect: the owner now owns the source repo too; the developer keeps full dev
> access via collaborator status.

The site will be **owned and paid by the site owner** (a non-technical friend), not the
developer. Both Sanity and Vercel must therefore live under the owner's accounts before any
launch infrastructure (domain, env vars, webhook) is wired up — otherwise that work is done
on the developer's accounts and redone later.

**0.1 — Sanity: transfer the project to the owner (do not recreate).**
The project already exists on the developer's account (`johnny-og-jeg`, Project ID
`xx10xher`, dataset `production`, currently **Growth Trial**). Transferring a project to a
new organization **keeps the same Project ID**, so nothing in the code or env changes —
`.env.local:1` (`NEXT_PUBLIC_SANITY_PROJECT_ID=xx10xher`), `sanity/env.ts:15`, the Vercel
env vars, and the webhook all keep working. Recreating instead would mint a new Project ID
and force re-pointing everything — so **transfer, don't recreate.** Billing is tied to the
organization, so the transfer is what makes "paid by the owner" actually possible.
- Owner creates a Sanity account + an **Organization**, adds a payment method, and picks a
  plan. The **Growth Trial expiry is the trigger** for selecting a paid plan; on free tier
  the editor remains a Sanity **Administrator** (no granular Editor role — see Scope).
- Owner invites the developer to that org as **Administrator** (developer keeps full access).
- From the project's **Settings** tab, transfer the project into the owner's organization.

**0.2 — Vercel: create the project under the owner from the start (no migration).**
Vercel is **not yet set up**, so there is nothing to migrate — create it directly under the
owner's account. This produces the stable `johnny-og-jeg.vercel.app` URL that the webhook
target depends on (see Scope decisions and 1.3).
- Owner creates a Vercel account; developer is invited / sets it up together.
- Connect this Git repo. The repo may stay on the developer's GitHub — grant the owner's
  Vercel read access to it; move the repo to the owner only if they want to own that too.
- Confirm the resulting project name produces the URL `johnny-og-jeg.vercel.app`. If Vercel
  assigns a different slug, the webhook URL in Scope decisions and 1.3 must be updated to
  match.

### Phase 1 — ISR bundle (the core; do not split across deploys mid-way)

> **Status: DONE (2026-06-06).** Shipped as one bundle (commit `30e1ffe`, deployed via
> `b673d63`). `force-dynamic` removed; `[slug]` now prerenders as SSG (16 paths) with
> `dynamicParams = true`; `FIXED_PATH` single-sourced in `sanity/queries/router.ts` (shared
> by the `[slug]` route, sitemap, and `generateStaticParams`). Webhook live and verified:
> a `homePage` publish returned `200 {"revalidated":true,"type":"homePage","slug":null}` in
> the Sanity delivery log, and edits appear on the live site with **no redeploy** — acceptance
> criterion #2 met on `johnny-og-jeg.vercel.app`.
>
> **Deviation — Vercel plan:** Phase 0 assumed **Hobby (free)**, but a collaborator/owner
> repo on Hobby blocked deploys (same root cause as the Phase 0 repo-ownership note). Resolved
> by **upgrading the owner's Vercel to Pro**, which unblocked deploys from `Zilas-B/johnny-og-jeg`.

> All of 1.1–1.5 land together and are verified as one before moving on. Each is small;
> the risk is in their interaction, so they're sequenced and then tested end-to-end.

**1.1 — Confirm required singletons are published.**
Before removing `force-dynamic`, the build will prerender pages whose layout/queries throw
if a singleton is missing. Verify in Studio (or via a published-perspective query) that all
of these exist and are **published** (not draft-only):
`siteSettings`, `homePage`, `kulturenPage`, `historienPage`, `foredragPage`, `bogerPage`.
- The layout throws on incomplete `siteSettings` (`app/(site)/layout.tsx:39`); under SSG
  that throw is now a **build failure**, so this gate is mandatory.

**1.2 — Add `generateStaticParams` + `dynamicParams` to `[slug]`.**
File: `app/(site)/[slug]/page.tsx`.
- Add a small query (or reuse the `SITEMAP_QUERY` shape in `sanity/queries/sitemap.ts`)
  returning every public `[slug]` route. Note the dispatch mapping from
  `sanity/queries/router.ts`:
  - `landscape` (with `deck`) → `slug.current`
  - `page` → `slug.current`
  - `kulturenPage` → `"kulturen"`, `historienPage` → `"historien"`,
    `foredragPage` → `"foredrag"`, `bogerPage` → `"boeger-spil-film"` (fixed paths)
  - **Exclude `homePage`** — it renders at `/` via `app/(site)/page.tsx`, not `[slug]`.
- Return `{ slug }` for each. Add `export const dynamicParams = true` so a freshly
  published doc with a not-yet-built slug renders on demand instead of 404ing until the
  next deploy.

**1.3 — Wire the webhook secret + the Sanity webhook.**
- Add `SANITY_WEBHOOK_SECRET` in Vercel (Production + Preview) **and** `.env.local`. The
  route already reads it (`app/api/revalidate/route.ts:5`) and 500s without it.
- In **Sanity Manage → API → Webhooks**, create a webhook:
  - URL: `https://johnny-og-jeg.vercel.app/api/revalidate`
  - Trigger: create / update / delete; dataset `production`
  - HTTP method POST; **secret** = the same `SANITY_WEBHOOK_SECRET`
  - Projection must emit `_type` (and `slug` where applicable) — the route reads
    `body._type` and optional `body.slug` and busts `revalidateTag(_type)` +
    `revalidateTag(`${_type}:${slug}`)`.
- The `archiveEntry → landscape feed` path already works: `LANDSCAPE_QUERY` joins entries
  and the fetch is tagged `['landscape:<slug>', 'landscape', 'archiveEntry']`
  (`components/landscape/LandscapeView.tsx:17`), so an `archiveEntry` publish busts the
  `archiveEntry` tag and regenerates the landscape page.

**1.4 — Remove `force-dynamic`.**
File: `app/(site)/layout.tsx` — delete `export const dynamic = 'force-dynamic'` (and the
explanatory comment above it). This is done **last** in Phase 1, only after 1.1–1.3 hold.
- Leave the raw `client.fetch(..., { next: { tags } })` calls as-is. They prerender fine at
  build under `perspective: 'published'` and tag-revalidation drives freshness. The unused
  `sanityFetch` (`sanity/lib/live.ts`) stays unused — it's only for the deferred Presentation
  work. `<SanityLive />` is gated behind `isDraft`, so it's inert without draft mode.

**1.5 — Verify ISR end-to-end (on vercel.app, pre-domain).**
- `pnpm build` succeeds and the build log shows the `[slug]` routes prerendered (●/SSG),
  not ƒ (dynamic). `pnpm types` / `pnpm lint` clean.
- Deploy to Vercel. All routes return 200; spot-check `/`, a landscape, `/kulturen`,
  `/musikeren`, `/historien`, `/foredrag`, `/boeger-spil-film`, `/styleguide`.
- **The acceptance test:** in Studio, create + publish a new `archiveEntry` referencing a
  landscape, then reload that landscape — the new entry appears in the feed (the empty-state
  flips to the feed at `components/landscape/LandscapePosts.tsx:25`). Confirm a matching
  delivery in the Sanity Manage webhook log.
- Edit a published singleton (e.g. a `siteSettings` footer string), publish, reload — the
  change appears without redeploy.

### Phase 2 — Styled 404

> **Status: DONE (2026-06-06).** Added `app/(site)/not-found.tsx` (+ `not-found.module.css`),
> designed from the editorial token system (no template — poster `404`, display-italic
> "Siden findes ikke", mono kicker, ink CTA back to `/`). Carries a `metadata.title`
> ("Siden findes ikke", suffixed by the root template). `pnpm lint` and `pnpm build` clean;
> `[slug]` still SSG (●), `/_not-found` prerenders.
>
> **Unmatched-route fallthrough — verified, no root handler added.** Tested against `pnpm
> start`: a bad single-segment slug (`/denne-side-findes-ikke`) returns **404 with full
> `(site)` chrome** (masthead + nav + footer + music player + skip-link) — `[slug]` calls
> `notFound()`, caught by the `(site)` boundary inside its layout. A deep unmatched path
> (`/a/b/c`) returns 404 via Next's **generic chrome-less fallback**. Decision: leave it — no
> internal link produces deep paths, the plan's error scope explicitly accepts a generic
> fallback for non-`[slug]` cases, and a root `app/not-found.tsx` couldn't carry the `(site)`
> chrome anyway (chrome lives in the site layout, not the root layout).

- Create `app/(site)/not-found.tsx` rendering inside the site layout (so it carries
  masthead + nav + footer + music player). Short Danish copy ("Siden findes ikke" + a link
  home), styled to the editorial system (no template exists — design minimally, consistent
  with tokens).
- During implementation, check the **unmatched-route fallthrough**: a path matching no route
  at all may hit Next's root-level not-found without `(site)` chrome. If so, decide whether a
  root handler is needed; the common case (`notFound()` from a bad `[slug]`) is covered by the
  `(site)` handler.
- No custom `error.tsx` / `global-error.tsx` — generic fallback accepted.

### Phase 3 — Custom domain

Independent of the webhook (which points at vercel.app), so done after ISR is proven.
1. Buy `johnnyogjeg.dk`.
2. Add it in Vercel → Project → Domains; configure DNS per Vercel's instructions; wait for
   SSL.
3. Set `NEXT_PUBLIC_SITE_URL=https://johnnyogjeg.dk` in Vercel (Production) so
   `metadataBase`, canonical, OG, sitemap, and robots resolve to the real origin
   (`sanity/env.ts:27` currently falls back to the Vercel URL / localhost).
4. Redeploy. Verify canonical tags, `/sitemap.xml`, `/robots.txt`, and OG URLs all point at
   `johnnyogjeg.dk`.
5. Leave the webhook pointed at `johnny-og-jeg.vercel.app` — it keeps working and is
   decoupled from the domain.

### Phase 4 — Final QA

- All 18 routes return 200 with correct content + chrome.
- Titles / canonicals / OG correct on a sample of pages (verbatim `seo.title`, else the
  `— Johnny og jeg` suffix — the split in `components/seo/metadata.ts`).
- Essay JSON-LD present on the three `page` essays only.
- Music player visible and inert; reduced-motion respected.
- Re-run the archive-entry publish test once more against the live domain.
- Confirm Sanity webhook delivery log is green for the test publishes.

---

## Metaplan reconciliations to record

These deviate from / refine Step 10's original prose; log them in `Metaplan.md`'s Decision
log under `2026-06-05`:

- **Webhook target = stable `johnny-og-jeg.vercel.app`** (not the custom domain).
- **ISR / Presentation split:** ISR ships in Step 10; the read token + `sanityFetch`
  refactor (Step 10 sub-steps 1 & 4) move to **Phase F** — they serve Presentation/draft
  mode only and aren't needed for launch.
- **Rendering profile = SSG (`generateStaticParams` + `dynamicParams`) + tag-based
  `revalidateTag`, no time-based `revalidate` backstop.**
- **Backups struck from Step 10 → Phase F** (launching with none).
- **Performance ≥ 90 is not a launch gate** — voids the Step 8 note that moved it to
  Step 10.
- **Error scope = styled 404 only** (with chrome); generic fallback otherwise.
- **Editor = Sanity Administrator** (free plan has no Editor role); handoff doc out of scope.
