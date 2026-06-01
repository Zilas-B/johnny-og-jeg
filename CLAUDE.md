# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

Danish editorial website about Johnny Cash, planned as a Next.js 15 + Sanity v3 application. The repo is currently in a **pre-scaffold state**: planning documents and a static HTML design reference only — no `package.json`, no Next.js code, no build pipeline yet. Step 0 of `Metaplan.md` covers the initial scaffold.

## Authoritative documents — read first

- **`docs/TechStack.md`** — Source of truth for stack decisions (Next.js 15 App Router, TypeScript, Tailwind v4 + CSS Modules, Sanity v3 Studio embedded at `/studio`, Vercel, pnpm), target folder layout, env vars, and explicit out-of-scope items. If any other doc conflicts with this one, this one wins until amended.
- **`docs/Metaplan.md`** — Implementation roadmap as Steps 0–12 across Phases A–F. Each numbered step is intentionally sized to be **one plan-mode session**.
- **`docs/best-practices.md`** — Stack-specific decisions for *how* we use Next.js + Sanity well: data-layer rules (pinned `next-sanity@^13`, tag-based revalidation, gated `<SanityLive>`), `defineQuery` + typegen, persistent music player without poisoning the tree with `'use client'`, design tokens + per-page accents + `/styleguide`, schema-for-editor patterns, one Portable Text component map, image pipeline with asset metadata, SEO from Sanity fields, env validation, and an a11y baseline. Numbered sections §1–§10.

Do not propose building the whole site at once. Work through the Metaplan one step at a time.

## Workflow convention (non-obvious)

This repo is built **step-by-step via repeated plan-mode sessions**. The expected loop is:

1. Enter plan mode (Shift+Tab).
2. Ask Claude to plan the next Metaplan step by number, e.g. *"Plan Step 0 from Metaplan.md."*
3. Approve the plan, exit plan mode, implement.
4. Verify against the step's **Acceptance criteria** in `Metaplan.md`.
5. Repeat with the next step.

**In plan mode, Claude must read `docs/best-practices.md` in full before producing any plan**, and the plan must explicitly reference which numbered sections (§1–§10) apply to the step and how. Any deviation from a rule there must be called out in the plan with a reason — silent deviation is not allowed.

Steps should leave the repo in a working, deployable state. If a step starts feeling too large mid-implementation, stop and split it.

## `claude-design-template/` is read-only reference

This folder contains 18 Danish HTML pages, `assets/cash-shared.css`, `assets/cash-radio.js`, and image assets — the original output from Claude Design. **Treat it as a read-only visual fidelity target**, not code to modify or refactor. When implementing pages, reproduce its layout, typography, colors, and animations in the Next.js + Sanity stack; do not edit files inside this folder.

**Visuals and content only.** The template guides *what it looks like* and *what it says*. Architecture, structure, and stack choices come from `docs/best-practices.md` and `docs/TechStack.md`, never the template. The template never overrides best practices.

Reference points inside it:
- `Johnny og jeg.html` — the hub/homepage
- 8 thematic "landscape" pages (`Naturen.html`, `Vesten.html`, `Smeltedigelen.html`, `Den forgyldte republik.html`, `Syd og Nord.html`, `Mindretallene.html`, `Vækkelsen.html`, `Drømmefabrikken.html`)
- `assets/cash-shared.css` — global design tokens, sticky nav, footer ("colophon"), music player styles
- `assets/cash-radio.js` — vanilla JS music player to port to React

## Commands

None yet. The Next.js scaffold has not been created. Once Step 0 of `Metaplan.md` is implemented, this section should be updated with `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm sanity typegen`, and any other commonly used scripts.

## Architecture

No code yet. Target architecture is documented in `TechStack.md` under "Project structure (target)". Highlights:

- Single Next.js app, App Router, with Sanity Studio embedded at `app/studio/[[...tool]]/page.tsx`.
- Site routes live under an `app/(site)/` route group so Studio and public site can share the repo without sharing chrome.
- The persistent "Cash Radio" music player must live in `app/(site)/layout.tsx` so it survives client-side navigation.
- Per-page accent colors are driven by CSS custom properties in the original design — preserve this pattern; do not hardcode colors per page.

## Gotchas

- Content is **Danish** throughout. Page filenames in `claude-design-template/` use `æ`, `ø`, `å` — be careful with filename encoding when importing.
- Sanity Studio is **embedded** in the Next.js app, not a separate project — one repo, one deploy, both served on the same Vercel domain.
- Git is initialized with branch `main` and an `origin` remote already configured. The Metaplan's "Initialize git, create GitHub repo, push" line under Step 0 is therefore already done — do not re-run `git init`.
