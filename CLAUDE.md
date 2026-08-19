# CLAUDE.md

Danish editorial website about Johnny Cash — Next.js App Router + Sanity v3, one repo, one Vercel deploy. Built **step-by-step through repeated plan-mode sessions**, one GitHub issue at a time. Do not propose building the whole site at once.

## Where information lives

| For…                                                                                                               | Look in                                  | Authority                                                                |
|--------------------------------------------------------------------------------------------------------------------|------------------------------------------|--------------------------------------------------------------------------|
| Stack, folder layout, env vars, out-of-scope                                                                       | `docs/TechStack.md`                      | **Source of truth.** Wins over any other doc on conflict, until amended. |
| What to build next, and what each ticket must satisfy                                                              | GitHub issues on `Zilas-B/johnny-og-jeg` | **The backlog.** Managed with `gh` — see `docs/agents/issue-tracker.md`. |
| The canonical name for every domain concept — the vocabulary the editor, the developer and the issue tracker share | `CONTEXT.md`                             | **Glossary only.** Use these terms in code, issues and Studio labels.    |
| *Why* a past decision was made, and what was rejected                                                              | `docs/adr/`                              | Binding until superseded by a later ADR.                                 |

> The original visual-fidelity reference (`claude-design-template/` — 18 static HTML pages) was **removed** once all pages were built. It lives in git history if you need to consult the original design; code/copy lifted from it is noted in per-file "Ported from…" comments.

## Rules that live nowhere else

- **Plan mode:** the invariants below are binding. A plan may deviate, but must say so and why — silent deviation is not allowed.
- **Each step leaves the repo working and deployable.** If a step feels too large mid-implementation, stop and split it.
- **The design template has been removed** (all pages are built). Historically it was a read-only, visuals-only reference: layout, typography, colors, copy, and animations were reproduced in the stack from it, while architecture and stack choices always came from `docs/` and never the template. Consult git history if you need the original design.

## Gotchas

- Content is **Danish** throughout — watch `æ`, `ø`, `å` filename/string encoding.
- Sanity Studio is **embedded** in the Next.js app at `app/studio/[[...tool]]/page.tsx` — not a separate project. Site routes live under `app/(site)/` so Studio and site don't share chrome.
- Per-page accent colors are CSS custom properties — never hardcode colors per page.
- Git is already initialized (`main` + `origin` remote configured). Do not re-run `git init`.
- **Solo developer — work directly on `main`.** Do not create feature branches or open PRs; commit straight to `main` (still only when asked). This overrides the default "branch first when on the default branch" behavior.

## Invariants

Conventions the code already demonstrates are not listed here — read the neighbouring file. These are the ones imitation can't teach: prohibitions (nothing to copy), and rules whose violation fails silently.

- **Queries:** every GROQ query is `defineQuery(...)` assigned to a named `const`, under `sanity/queries/`. Typegen discovers only that form — a plain template string quietly gets no types and raises no error. `sanity/types.ts` is generated but committed, so content-shape changes show up in diffs.
- **Env vars:** `process.env` is read only in `sanity/env.ts`, asserted at module load so a missing variable fails the boot by name. Never read it anywhere else.
- **Images:** no raw `<img>` in `app/` or `components/`. Everything goes through the Sanity image wrapper, which takes width and height from asset metadata — without them the page reflows when the image loads.
- **Rich text:** no `dangerouslySetInnerHTML` for content. A new text feature is a schema definition *and* a serializer in the shared Portable Text component map, added in the same commit — one without the other is a dead editor button or dead code.
- **Accents:** the per-page accent is a closed list of named presets the editor selects, never a free colour picker. Adding a preset is a code change, deliberately.
- **Enum fields consumed as lookup keys** must be listed in `LOOKUP_KEY_FIELDS` in `sanity/lib/live.ts`. Draft Mode encodes invisible stega characters into every string it thinks is editable; an encoded value stops matching its `Record` key and falls through to the default. Silent, and preview-only — the published site looks fine.
- **`app/(site)/layout.tsx` stays a Server Component.** No `'use client'` on it — that collapses every page beneath it into a client tree.
- **Schema:** anything the frontend renders unconditionally is `Rule.required()`, image `alt` included. Enumerations use `options.list`, never free text — a typo in content is forever.
- **`next-sanity` is pinned to `^13`.** Next 16 with anything older triggers a prefetch cascade that multiplies Sanity API requests several-fold.

## Commands

`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm types` (Sanity schema extract + typegen; also runs automatically via `predev`/`prebuild`). See `package.json` scripts for the full list.

## Agent skills

### Issue tracker

Issues live as GitHub issues on `Zilas-B/johnny-og-jeg`, managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, each label string equal to its name. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
