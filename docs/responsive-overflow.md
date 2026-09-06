# Residual horizontal overflow after #28

**A frozen artefact, not a live index.** This is one `pnpm test:viewport` run,
taken immediately after the responsive foundation landed (#28), kept because
#29–#39 all need the same list and nobody should have to re-derive it. Each row
names the modules that still stick out past the right edge, ordered as the
reporter orders them (furthest out first).

The GitHub issues remain the backlog authority (`CLAUDE.md`, "Where information
lives"); the mapping table at the bottom is triage, not scope. Once any of those
tickets lands this file is stale — re-run the suite, don't trust it.

**Suite result: 35 failed / 32 passed.** Baseline before #28 was 48 / 19.

16 routes × 4 widths = 64 overflow tests, plus the 3 sitemap-parser unit tests,
is the 67 total.

| Width  | Result                                                                  |
|--------|-------------------------------------------------------------------------|
| 1280px | All 16 routes pass.                                                     |
| 768px  | 13 of 16 pass — only `/foredrag`, `/kulturen`, `/droemmefabrikken` fail. |
| 375px  | All 16 fail.                                                            |
| 320px  | All 16 fail.                                                            |

360px — the stated minimum width — is not one of the four widths the suite runs.
375px is the nearest and is the one to read as the phone case.

## The one cause that is on nearly every route

`Nav.cta` and `Nav.item` — the primary nav is a single non-wrapping row of
poster-cased links, so it overflows every route at 375px and below regardless of
what the page beneath it does. **#29 (Nav Drawer) is on all 32 of the 375px and
320px failures** and should be built first; nothing else can be judged done at
those widths until it lands.

`Footer.grid` and `Masthead.mastSideRight` (#30) are the second shared cause, on
every route at 320px.

## Per route

Offenders below exclude the shared Nav / Masthead / Footer causes above.

| Route                     | 768px                     | 375px                                                              | Extra at 320px                        |
|---------------------------|---------------------------|--------------------------------------------------------------------|---------------------------------------|
| `/`                       | —                         | `ContactSection.grid`, `ContactSection.form`                        | `VinylTile.tile`                      |
| `/boeger-spil-film`       | —                         | `Boger.entryText`, `Boger.addCard`, `Boger.rhs`, `Boger.filters`    | —                                     |
| `/cash-og-amerika`        | —                         | `StatsBar.cell`, `LocationGrid.card`, `NextEssay.card`              | `Themes.theme`                        |
| `/cash-og-jesus`          | —                         | `NextEssay.card`, `Hymnal.col`                                      | `Stations.station`                    |
| `/den-forgyldte-republik` | —                         | `LandscapeHero.grid`, `LandscapeSiblings.cell`                      | —                                     |
| `/droemmefabrikken`       | `LandscapeHero.grid`      | `LandscapeHero.grid`, `LandscapeSiblings.cell`                      | `LandscapePosts.meta`                 |
| `/foredrag`               | `Foredrag.poster`, `.bform` | `Foredrag.poster`, `.bform`, `.venuesGrid`                        | `Foredrag.venuesList`                 |
| `/historien`              | —                         | `Historien.card`, `.eraText`, `.eraPhoto`                           | —                                     |
| `/kulturen`               | `Kulturen.chip`           | `Kulturen.chip`, `Kulturen.landTitles`, `Kulturen.side`             | —                                     |
| `/mindretallene`          | —                         | `LandscapeHero.grid`, `LandscapeSiblings.cell`                      | —                                     |
| `/musikeren`              | —                         | `SteppedList.era`, `CardGrid.card`, `NextEssay.card`                | —                                     |
| `/naturen`                | —                         | `LandscapeHero.grid`, `LandscapeSiblings.cell`                      | —                                     |
| `/smeltedigelen`          | —                         | `LandscapeHero.grid`, `LandscapeSiblings.cell`                      | —                                     |
| `/syd-og-nord`            | —                         | `LandscapeSiblings.cell`, `LandscapeHero.grid`                      | —                                     |
| `/vaekkelsen`             | —                         | `LandscapeHero.grid`, `LandscapeSiblings.cell`                      | —                                     |
| `/vesten`                 | —                         | `LandscapeHero.grid`, `LandscapeSiblings.cell`                      | —                                     |

## Mapping to the follow-up tickets

| Ticket | Picks up                                                                  |
|--------|---------------------------------------------------------------------------|
| #29    | `Nav.cta`, `Nav.item` — every route, 375px and 320px.                     |
| #30    | `Masthead.mastSideRight`, `Footer.grid` — every route.                    |
| #31    | `ContactSection.grid` / `.form`, `VinylTile.tile`.                        |
| #32    | Milestone Carousel (clipped today, so it does not appear above).          |
| #33    | `Historien.card`, `.eraText`, `.eraPhoto`.                                |
| #34    | `Kulturen.chip`, `.landTitles`, `.side` — the only 768px failure besides #37/#38. |
| #35    | `LandscapeHero.grid` — six landscape routes, and the 768px failure on `/droemmefabrikken`. |
| #36    | `StatsBar.cell`, `LocationGrid.card`, `NextEssay.card`, `Themes.theme`, `Stations.station`, `SteppedList.era`, `CardGrid.card`, `Hymnal.col`. |
| #37    | `LandscapeSiblings.cell`, `LandscapePosts.meta`.                          |
| #38    | `Foredrag.poster`, `.bform`, `.venuesGrid`, `.venuesList`.                |
| #39    | `Boger.entryText`, `.addCard`, `.rhs`, `.filters`.                        |
