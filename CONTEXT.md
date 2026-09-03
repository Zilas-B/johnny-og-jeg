# Johnny og jeg

A Danish editorial website about Johnny Cash, authored by an editor in Sanity Studio and rendered by Next.js.

The site's published content is Danish. This glossary — like all code and Studio-facing strings — is English, so that the editor and the developer name the same thing the same way.

## Language

### Page structure

**Block**:
One composable section of a page, chosen and ordered by the editor.
_Avoid_: blok, module, section, component

**Hero Block**:
The top Block of a page. A kind of Block, not one particular instance — several pages have one, so name the page when it matters ("the Hero Block on Cash og Amerika").
_Avoid_: Hub Hero, Flag Hero, hero banner, header

**Hero Foreword**:
The signed quote card inside the front page's Hero Block.
_Avoid_: forordskortet, foreword card, signature card

**Vinyl Tile**:
One of the three record-shaped cards on the front page, each presenting one side of the project.
_Avoid_: Vinyl-felt, spor, rubrik, felt, side, tile, card

**Milestone Carousel**:
The horizontally scrolling strip pairing a year with one turning point in Cash's career. A Milestone is often a Song, but just as often an album, a concert or a label — which is why this is not a Song Carousel.
_Avoid_: Song Carousel, Setlist Ticker, ticker, marquee

**Teaser Overview**:
A front-page Block that summarises one section page and sends the reader on to it — it teases another part of the site rather than holding the content itself. Each one is its own Block, so the editor adds one per section page; two of them cover Historien and Kulturen.
_Avoid_: USA section, America Overview, Section Overview, Hub Overview, teaser card

**Teaser Point**:
One of the four items inside a Teaser Overview, naming one part of the section page it teases. Written on the front page by the Editor — a Teaser Point is not a reference to an Era or a Landscape, even when it names one, so its wording is free to differ from the page it points at.
_Avoid_: teaser item, bullet, timeline event, era, landscape

### Navigation

**Nav Drawer**:
The full-screen overlay that replaces the navigation bar's tab row on narrow screens, listing the whole navigation tree at once. Developer vocabulary — the Editor arranges the nav tree in Studio and never operates the Drawer as a separate thing.
_Avoid_: hamburger menu, burger, mobile nav, off-canvas, mobilmenu

### Music

**Song**:
A Johnny Cash recording named on the site. A Vinyl Tile lists Songs by title alone — here a Song has no position on a record and no running time.
_Avoid_: track, number, nummer, tune

### People

**Editor**:
The person who writes and arranges the site's content in Sanity Studio. Distinct from the developer, who changes the code.
_Avoid_: author, content manager, user

### Content submission

**Contact Submission**:
A message sent to the site's owners through the contact form. Its subject is a field on the submission, not a separate kind of thing — a speaking enquiry is a Contact Submission whose subject is *foredrag*.
_Avoid_: enquiry, Speaking Enquiry, contact request, lead

### Publishing

**Draft Mode**:
The state in which a page renders unpublished content instead of published content. Developer vocabulary — it names a state of the site, not something the editor operates.
_Avoid_: preview mode, draft state

**Preview**:
The Studio tool that shows the site beside the document being edited.
_Avoid_: Presentation, forhåndsvisning, live preview
