# Tailwind is removed; CSS Modules and tokens.css are the whole styling system

`docs/TechStack.md` said Tailwind handled "layout, spacing, color tokens, common
utilities" and CSS Modules handled "the bespoke editorial pieces". An audit taken before
starting the responsive work found the split had never happened. Tailwind classes appear
five times in the entire application: `min-h-full` and `h-full antialiased` in the root
layout, and `bg-accent`, `text-paper` and `text-accent` on the styleguide page, where
they exist to demonstrate that the tokens resolve. The `@theme` block declares fourteen
`--color-*` custom properties that are referenced **zero** times in any stylesheet —
every module reads the raw `--paper` / `--ink` / `--accent` variables from `tokens.css`
instead. All layout, in all 33 CSS Modules and 6,333 lines, is hand-written CSS. There
are no responsive Tailwind prefixes anywhere.

We decided to **remove Tailwind entirely** rather than keep it. CSS Modules plus the
global `tokens.css` become the complete styling system, and the responsive work that
prompted this audit is written as `@media` queries inside modules — which is what the
six pre-existing responsive rules already do.

This decision is recorded because the codebase looks, from `package.json`, like a
Tailwind project. A future reader finding no Tailwind in it deserves to know that was
deliberate and not an incomplete migration.

## Considered Options

- **Amend `docs/TechStack.md` to match reality and keep Tailwind for Preflight only.**
  Zero refactor, zero risk, and it makes the doc honest — this was the recommended
  option. Rejected by PO in favour of removal: keeping a pinned major-version dependency
  and a build step to supply a CSS reset is a standing cost and a standing invitation for
  someone to "start using it properly" later.
- **Adopt Tailwind properly for the responsive layer**, writing new work as `md:` / `lg:`
  prefixes and migrating layout out of modules over time. This is what the doc claimed
  and is the option the doc would have justified. Rejected as the worst outcome
  available: it would make the codebase genuinely inconsistent — two competing layout
  systems for the length of a long migration — and the six existing media queries would
  contradict the new convention inside the very files being changed.

## Consequences

- **Preflight must be replaced by a hand-written reset**, and this is the real risk of
  the change, concentrated in two places. Twenty-one form controls across the booking
  form, the contact section, the book-adding card, the category filter and the nav rely
  on Preflight's `font: inherit` and `appearance` normalisation; without a replacement
  they revert to the browser's system font in the middle of a design built on Playfair,
  Crimson and Plex Mono. And 117 rendered block elements — headings, paragraphs, lists,
  blockquotes, figures — rely on Preflight zeroing their margins; modules set their own
  in most but not all cases.
- The focus-outline rule in `tokens.css` already exists *because* Preflight stripped the
  browser default. It survives removal unchanged, and is evidence of the general shape of
  this risk: the reset is load-bearing in ways that are invisible until it is gone.
- **Removal ships as its own commit, before the responsive work**, and is verified by the
  site rendering identically before and after. Bundled into the mobile work, a regression
  in form typography would present as "the mobile change broke the booking form".
- `docs/TechStack.md` is amended in the same commit. It is the source of truth and must
  not describe a dependency that has been deleted.
- Adding any utility-class framework back is now a decision that supersedes this ADR,
  not a convenience someone reaches for.
