# Tech Stack — Johnny og Jeg

This document defines the technology choices for the Johnny og Jeg website. It is the source of truth for all stack decisions and wins over any other doc on conflict, until amended.

## Purpose of the project

A multi-page editorial website (in Danish) exploring America through Johnny Cash. 18 designed pages currently exist as static HTML in this folder. The build target is a Next.js + Sanity application that preserves the editorial design system and supports an "archive that grows over time" content model.

- **Design source**: `C:\Users\Andre\Desktop\Cash hjemmeside` (this folder, static HTML reference)
- **Project repo (code)**: `C:\Users\Andre\Documents\Lokale Git Repositories\johnny-og-jeg`

## Core stack

| Concern         | Choice                                              | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|-----------------|-----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Framework       | **Next.js 16+ (App Router)**                        | Server Components by default; client components only where interactivity demands it. Scaffolded on **Next 16.2.6** (2026-05-26) from `create-next-app@latest`.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Language        | **TypeScript** (strict mode)                        | All source files `.ts` / `.tsx`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Runtime         | **Node.js 20 LTS**                                  | Required by current Next.js + Sanity tooling.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Package manager | **pnpm**                                            | Fast, disk-efficient, good monorepo story if we ever split. Acceptable fallback: npm.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| CMS             | **Sanity Studio v5**                                | Schema-as-code, Portable Text for long-form essays, image pipeline via `@sanity/image-url`. Installed `sanity@5.26`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Studio location | **Embedded at `/studio`** inside the Next.js app    | Pattern: `app/studio/[[...tool]]/page.tsx` using `next-sanity/studio`. Single repo, single deploy.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Styling         | **Tailwind CSS v4 + CSS Modules**                   | Tailwind for layout, spacing, color tokens, common utilities. CSS Modules for the bespoke editorial pieces (drop caps, paper grain, vinyl spin animation, per-page accent overrides).                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Fonts           | **next/font/google**                                | Playfair Display (display serif), Bebas Neue (poster sans), IBM Plex Mono (mono), Crimson Pro (body serif). Self-hosted via next/font for zero layout shift.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Images          | **next/image** + **Sanity image pipeline**          | Hot path: `urlFor(image).width(...).auto('format').url()` piped through `next/image`. Local hero images go through `next/image` directly.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Rich text       | **@portabletext/react**                             | Custom serializers for drop caps, footnotes, internal links, image captions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Type generation | **`sanity typegen`**                                | Generates TypeScript types from schema + GROQ queries for type-safe content.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Hosting         | **Vercel**                                          | Zero-config deploys from GitHub. Free tier covers this project. Sanity Studio served from the same domain at `/studio`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Version control | **GitHub**                                          | Branch model: `main` deploys to production; preview deploys per PR on Vercel.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Linting         | **ESLint** (next/core-web-vitals + next/typescript) | Run on commit and in CI.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Formatting      | Not configured yet                                  | Prettier was planned but not installed at scaffold time. Add `prettier` + `prettier-plugin-tailwindcss` when consistency starts to matter.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Testing         | **Playwright** viewport smoke tests only            | `pnpm test:viewport`, pinned `@playwright/test`, Chromium only. Runs every route in `/sitemap.xml` at 320 / 375 / 768 / 1280 px, asserts the document never scrolls horizontally, and saves a screenshot per route × width as an artefact for a human to look at. A small `unit` project covers the sitemap parser. **No pixel-diff baselines, no E2E, no unit tests of presentational components.** ADR 0002's Vitest test of the contact route handler is still to come and is not superseded by this row. CI runs it in report mode (artefact uploaded, non-blocking) until #40 makes it blocking. |

## Optional / decide-later

| Concern               | Default until decided otherwise                                                                                                                          |
|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Analytics             | None in prototype. Vercel Analytics (free tier) when going live.                                                                                         |
| Search                | None in prototype. Sanity Embeddings Index for semantic search when content volume justifies it.                                                         |
| Forms                 | None in design. If "Foredrag" page later needs a contact form: native HTML form → Resend (email) or Formspree.                                           |
| Animations beyond CSS | CSS keyframes are sufficient for vinyl spin, ticker, hover lifts. Add **Framer Motion** only if a future step needs scroll-driven or gesture animations. |
| i18n                  | **Not needed.** Site is Danish-only.                                                                                                                     |
| Error monitoring      | None in prototype. **Sentry** (free tier) if real users start hitting bugs.                                                                              |

## Project structure (target)

```
johnny-og-jeg/
├── app/
│   ├── (site)/                       # Public site route group
│   │   ├── layout.tsx                # Masthead, sticky nav, footer
│   │   ├── page.tsx                  # "Johnny og jeg" hub page
│   │   ├── [landscape]/page.tsx      # 8 landscapes: Naturen, Vesten, etc.
│   │   └── [slug]/page.tsx           # Other top-level pages (Historien, Musikeren, …)
│   ├── studio/[[...tool]]/page.tsx   # Embedded Sanity Studio
│   └── api/                          # Route handlers (revalidation webhooks, etc.)
├── components/
│   ├── chrome/                       # Masthead, Nav, Footer
│   ├── editorial/                    # PortableText, SanityImage, EraChip, drop cap, …
│   ├── hub/                          # Hub-page section blocks (HubHero, HubVinyls, …)
│   ├── <page-type>/                  # Same pattern for landscape/, supporting/, etc.
│   └── ui/                           # Low-level primitives if needed
├── sanity/
│   ├── schemas/                      # Document + object schemas
│   ├── queries/                      # GROQ queries (co-located with usage when possible)
│   ├── client.ts                     # Sanity client + image URL builder
│   └── env.ts                        # Validated env config
├── styles/
│   ├── globals.css                   # Tailwind directives, paper grain, root vars
│   └── tokens.css                    # Design tokens (colors, typography scale)
├── public/                           # Static assets (favicons, OG images)
├── tests/viewport/                   # Playwright viewport smoke tests (routes from sitemap)
├── playwright.config.ts              # One Chromium project per width; webServer = dev locally, start in CI
├── sanity.config.ts                  # Studio configuration
├── sanity.cli.ts                     # Sanity CLI (dataset, deploy, typegen)
├── next.config.mjs
├── tailwind.config.ts                # If we end up needing JS config (TW v4 prefers CSS)
├── tsconfig.json
└── package.json
```

Per-page-type folders under `components/` (e.g. `hub/`, future `landscape/`) hold section blocks first introduced for that page-type. They live under `components/` rather than a route-private folder so they remain importable from any page that wants to reuse a block.

## Environment variables

| Variable                         | Where                 | Purpose                                                                                                                                                          |
| -------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | Vercel + `.env.local` | Public, used by browser-side image URLs.                                                                                                                         |
| `NEXT_PUBLIC_SANITY_DATASET`     | Vercel + `.env.local` | Usually `production`.                                                                                                                                            |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Vercel + `.env.local` | Pinned ISO date, e.g. `2026-05-01`.                                                                                                                              |
| `SANITY_API_READ_TOKEN`          | Vercel (server only)  | Viewer token. Draft mode / preview queries. Server-only — never sent to the browser.                                                                             |
| `SANITY_WEBHOOK_SECRET`          | Vercel (server only)  | Verifies revalidation webhook signatures.                                                                                                                        |
| `NEXT_PUBLIC_SITE_URL`           | Vercel (Production)   | The public origin, `https://johnnyogjeg.dk`. Drives `metadataBase`, canonicals, OG URLs, sitemap and robots. Falls back to the Vercel deployment URL when unset. |

## Versioning policy

- Pin Next.js, Sanity, and Tailwind major versions in `package.json`.
- Re-evaluate upgrades quarterly. No "latest" tags in production dependencies.
- Sanity API version: pin to a specific ISO date; update intentionally with `sanity typegen` regeneration.

## Out of scope

The following are explicitly **not** part of this stack — adding any of them requires updating this document first:

- No GraphQL layer (GROQ is sufficient).
- No state management library (Zustand, Redux, etc.) — Server Components + URL state cover this site.
- No CSS-in-JS runtime (styled-components, emotion) — Tailwind + CSS Modules cover everything.
- No headless UI library (Radix, shadcn) unless a specific component justifies it.
- No authentication for the public site. Sanity Studio handles its own auth.
- No e-commerce.
- No audio playback of any kind — no player, no embed, no "listen on" widget. See `.out-of-scope/music-player.md`. Music links, if wanted, belong in article body text.
