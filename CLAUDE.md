# CLAUDE.md

Danish editorial website about Johnny Cash — Next.js App Router + Sanity v3, one repo, one Vercel deploy. Built **step-by-step through repeated plan-mode sessions**, one Metaplan step at a time. Do not propose building the whole site at once.

## Where information lives

| For… | Look in | Authority |
| --- | --- | --- |
| Stack, folder layout, env vars, out-of-scope | `docs/TechStack.md` | **Source of truth.** Wins over any other doc on conflict, until amended. |
| What to build next, in what order (Steps 0–12, Phases A–F) + acceptance criteria | `docs/Metaplan.md` | Each numbered step = one plan-mode session. |
| *How* to use the stack well — data layer, typegen, music player, design tokens, schema, Portable Text, images, SEO, a11y (§1–§10) | `docs/best-practices.md` | Binding rules. |
| Token / agent-usage discipline | `docs/agent-mistakes.md` | |
| What pages look like and say (visual fidelity target) | `claude-design-template/` | Read-only. |

## Rules that live nowhere else

- **Plan mode:** read `docs/best-practices.md` *in full* before producing any plan. The plan must cite which §1–§10 sections apply and how. Any deviation must be called out with a reason — silent deviation is not allowed.
- **Each step leaves the repo working and deployable.** If a step feels too large mid-implementation, stop and split it.
- **`claude-design-template/` is read-only and visuals-only.** Reproduce its layout, typography, colors, and animations in the stack; never edit files inside it. Architecture and stack choices come from `docs/`, never the template — it never overrides best practices.

## Gotchas

- Content is **Danish** throughout. Template page filenames use `æ`, `ø`, `å` — watch filename encoding when importing.
- Sanity Studio is **embedded** in the Next.js app at `app/studio/[[...tool]]/page.tsx` — not a separate project. Site routes live under `app/(site)/` so Studio and site don't share chrome.
- The persistent "Cash Radio" player lives in `app/(site)/layout.tsx` so it survives client-side navigation. Per-page accent colors are CSS custom properties — never hardcode colors per page.
- Git is already initialized (`main` + `origin` remote configured). Do not re-run `git init`.

## Commands

`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm types` (Sanity schema extract + typegen; also runs automatically via `predev`/`prebuild`). See `package.json` scripts for the full list.
