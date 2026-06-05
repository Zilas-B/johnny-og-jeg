# CLAUDE.md

Danish editorial website about Johnny Cash — Next.js App Router + Sanity v3, one repo, one Vercel deploy. Built **step-by-step through repeated plan-mode sessions**, one Metaplan step at a time. Do not propose building the whole site at once.

## Where information lives

| For… | Look in | Authority |
| --- | --- | --- |
| Stack, folder layout, env vars, out-of-scope | `docs/TechStack.md` | **Source of truth.** Wins over any other doc on conflict, until amended. |
| What to build next, in what order (Steps 0–12, Phases A–F) + acceptance criteria | `docs/Metaplan.md` | Each numbered step = one plan-mode session. |
| *How* to use the stack well — data layer, typegen, music player, design tokens, schema, Portable Text, images, SEO, a11y (§1–§10) | `docs/best-practices.md` | Binding rules. |
| Token / agent-usage discipline | `docs/agent-mistakes.md` | |

> The original visual-fidelity reference (`claude-design-template/` — 18 static HTML pages) was **removed** once all pages were built. It lives in git history if you need to consult the original design; code/copy lifted from it is noted in per-file "Ported from…" comments.

## Rules that live nowhere else

- **Plan mode:** read `docs/best-practices.md` *in full* before producing any plan. The plan must cite which §1–§10 sections apply and how. Any deviation must be called out with a reason — silent deviation is not allowed.
- **Each step leaves the repo working and deployable.** If a step feels too large mid-implementation, stop and split it.
- **The design template has been removed** (all pages are built). Historically it was a read-only, visuals-only reference: layout, typography, colors, copy, and animations were reproduced in the stack from it, while architecture and stack choices always came from `docs/` and never the template. Consult git history if you need the original design.

## Gotchas

- Content is **Danish** throughout — watch `æ`, `ø`, `å` filename/string encoding.
- Sanity Studio is **embedded** in the Next.js app at `app/studio/[[...tool]]/page.tsx` — not a separate project. Site routes live under `app/(site)/` so Studio and site don't share chrome.
- The persistent "Cash Radio" player lives in `app/(site)/layout.tsx` so it survives client-side navigation. Per-page accent colors are CSS custom properties — never hardcode colors per page.
- Git is already initialized (`main` + `origin` remote configured). Do not re-run `git init`.

## Commands

`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm types` (Sanity schema extract + typegen; also runs automatically via `predev`/`prebuild`). See `package.json` scripts for the full list.
