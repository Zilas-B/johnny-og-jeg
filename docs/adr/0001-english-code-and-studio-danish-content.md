---
status: accepted
---

# Code and Studio-facing strings are English; content stays Danish

The site is Danish and was built Danish throughout, including every Sanity Studio field title, description and desk label. That put the editor and the developer on opposite sides of a language boundary: a field the editor reported by its Danish label could not be grepped for, and the Danish `title` had drifted from the English `name` often enough that the label on screen was no guide to the identifier in code. We decided that **everything facing a developer or an editor is English — code identifiers, file names, Studio field labels, help text and desk navigation — while the content values that readers see stay Danish.** The two audiences are different: readers get a Danish site, the people building it share one vocabulary.

## Considered Options

- **Keep the Studio in Danish, English only in code.** The status quo. Rejected because it preserves exactly the translation step that costs time on every issue — and because the editor is the person filing most of those issues.
- **Translate everything, including content.** Never seriously on the table; the site's entire purpose is Danish editorial writing.
- **English field titles, Danish help text.** Considered as a compromise if the editor pushed back on losing Danish guidance. Not adopted, but it remains the fallback if the retrofit turns out to hurt authoring.

## Consequences

- Retrofitting the existing Studio is roughly 500 editor-facing strings across 45 files. It is tracked as three issues on the GitHub backlog and is deliberately mechanical: labels only, never a field `name` or a block `type`, because renaming those orphans published content.
- Schema type names now disagree with the glossary in places — the front page's top block is `hubHero` in code and **Hero Block** in `CONTEXT.md`; `setlistTicker` is the **Song Carousel**. This is accepted on purpose. Reconciling them is a content migration, not a translation, and needs its own decision.
- The editor's working instructions change language. They read those descriptions while writing, so if the English versions prove worse to work from, the fallback above is the amendment — not a wholesale revert.
- New schema work is written in English from the start; this is not a one-off sweep but a standing convention.
