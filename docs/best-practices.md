# Best Practices — Johnny og Jeg

Stack-specific guidance for this project. Complements `TechStack.md` (what we use) and `Metaplan.md` (when we build it). Rules here are decisions, not suggestions — deviate only with reason recorded.

---

## 1. Data layer: pin `next-sanity@^13`, gate `<SanityLive>`, drive freshness with tags

**Context.** We are on Next.js 16.2.6. Combining Next 16 with `next-sanity` < v13 triggers a documented prefetch-cascade bug: every live cache invalidation causes Next to re-prefetch every visible link, producing an average **4×** and worst-case **7–10×** spike in Sanity API requests and Vercel ISR reads. Fixed in `next-sanity@13` (released 2026-05-21).

### Rules

1. **Pin `next-sanity@^13`** when first installed (Metaplan Step 2). Never accept implicit `latest`.
2. **Conditionally render `<SanityLive />`** in `app/(site)/layout.tsx` — only when Draft Mode is active. Public visitors must not load the live channel. Consequence we accept: a published change is not pushed to public readers in real time; they see it on their next request. This is correct for an editorial site.
3. **Drive freshness via tag-based revalidation**, not time-based polling:
   - Tag every server fetch with `{ next: { tags: [...] } }`. Suggested taxonomy: `landscape:<slug>`, `essay:<slug>`, `global:nav`, `global:footer`, plus the bare `_type` (e.g. `essay`) for broad invalidations.
   - Add `app/api/revalidate/route.ts`. It must verify the `SANITY_WEBHOOK_SECRET` signature, then call `revalidateTag()` for the affected `_type` and slug.
   - Configure the webhook in Sanity Manage to POST to that route on publish/unpublish.
4. **Disable Stega in the base client.** Opt it in only on the client instance used inside Draft Mode. Stega inserts invisible source-map characters into rendered text; if it bleeds into production HTML it pollutes copy-paste and search indexes.

### Sketch

```ts
// sanity/lib/live.ts
import { defineLive } from 'next-sanity'
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION! }),
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
})
```

```tsx
// app/(site)/layout.tsx
import { draftMode } from 'next/headers'
import { SanityLive } from '@/sanity/lib/live'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraft } = await draftMode()
  return (
    <>
      {children}
      {isDraft && <SanityLive />}
    </>
  )
}
```

```ts
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: Request) {
  const { isValidSignature, body } = await parseBody<{ _type: string; slug?: string }>(
    req,
    process.env.SANITY_WEBHOOK_SECRET,
  )
  if (!isValidSignature) return new Response('Invalid signature', { status: 401 })
  if (!body?._type) return new Response('Bad payload', { status: 400 })

  revalidateTag(body._type)
  if (body.slug) revalidateTag(`${body._type}:${body.slug}`)
  return Response.json({ revalidated: true })
}
```

### References
- [Next.js 16 and SanityLive: avoiding request overages](https://www.sanity.io/docs/help/nextjs-16-sanitylive-status)
- [Caching and revalidation in Next.js (Sanity)](https://www.sanity.io/docs/nextjs/caching-and-revalidation-in-nextjs)
- [Visual Editing with Next.js App Router](https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router)
- [Next.js — How Revalidation Works](https://nextjs.org/docs/app/guides/how-revalidation-works)

---

## 2. Content typing: `defineQuery` + `sanity typegen` is the only source of truth for content shape

**Context.** Common Sanity tutorials show GROQ as a plain string plus a hand-written `interface Essay { … }`. That's two sources of truth for the same shape; drift is inevitable. With `defineQuery` and `overloadClientMethods`, `client.fetch()` returns the correct type without any hand-written interface.

### Rules

1. **Always use `defineQuery` from `next-sanity`** — never raw template strings. Queries must be assigned to a named `const` so typegen can statically discover them.
   ```ts
   import { defineQuery } from 'next-sanity'
   export const LANDSCAPE_QUERY = defineQuery(`
     *[_type == "landscape" && slug.current == $slug][0]{
       title, accentColor, intro,
       "essays": essays[]->{ title, slug }
     }
   `)
   ```
2. **Enable `overloadClientMethods: true`** in `sanity.cli.ts`. `client.fetch(LANDSCAPE_QUERY, { slug })` will then return the correct type without an explicit type import.
3. **Two scripts, in order, behind one entry point:**
   ```jsonc
   // package.json
   "scripts": {
     "types": "sanity schema extract && sanity typegen generate",
     "predev": "pnpm types",
     "prebuild": "pnpm types"
   }
   ```
   `predev` + `prebuild` guarantee types are never stale at runtime.
4. **Co-locate queries with the component that consumes them.** Each route folder gets a `queries.ts` sibling. Queries shared across pages (nav, footer, SEO defaults) live in `sanity/queries/global.ts`.
5. **Commit `sanity/types.ts`.** It is generated, but committing it (a) makes content-shape changes visible in PR diffs and (b) means CI typechecks without needing Sanity credentials.
6. **`apiVersion` is a single pinned date** referenced everywhere via `process.env.NEXT_PUBLIC_SANITY_API_VERSION`. Bumping it requires a fresh `pnpm types` run in the same commit.

### References
- [Sanity TypeGen | Sanity Docs](https://www.sanity.io/docs/apis-and-sdks/sanity-typegen)
- [Generating types for GROQ query results | Sanity Learn](https://www.sanity.io/learn/course/typescripted-content/generating-type-for-groq-query-results)
- [End-to-end type safety for Sanity GROQ queries — Tristan Chin](https://www.chintristan.io/blog/end-to-end-type-safety-for-sanity-groq-queries)

---

## 3. Persistent music player without poisoning the tree with `'use client'`

**Context.** The Cash Radio must survive client-side navigation, which means it lives in `app/(site)/layout.tsx`. Putting `'use client'` at the top of the layout collapses every page underneath into a client tree and forfeits the App Router benefits.

### Rules

1. **`app/(site)/layout.tsx` stays a Server Component.** No `'use client'` directive on it, ever.
2. **`MusicPlayer.tsx` is the only client leaf** the chrome imports. The Server Component layout renders `<MusicPlayer />` as a sibling of `{children}`; React preserves its state across App Router navigations automatically because its position in the tree is stable. No parallel routes, no provider.
3. **Player state lives inside `MusicPlayer`.** No global store. Page → player communication uses custom DOM events (`window.dispatchEvent(new CustomEvent('cashradio:play', { detail: { trackId } }))`); the player listens. This preserves `TechStack.md`'s "no state management library" decision.
4. **`'use client'` only when a component itself uses `useState`/`useEffect`/event handlers/refs/browser APIs.** Wrapping a server-renderable component in `'use client'` is a code smell.
5. **Never call `client.fetch()` from a `'use client'` file** — it ships the token and query strings into the browser bundle. Fetch in a Server Component parent, pass serializable props down.
6. **Port `assets/cash-radio.js` as a React rewrite**, not a DOM-manipulation transplant. The original is vanilla JS; literal translation produces an unmaintainable hybrid.

### References
- [Composition Patterns — Server & Client Components | Next.js](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

---

## 4. Design tokens + per-page accents + a `/styleguide` route

Three pieces of one visual-identity system.

### Rules

1. **Global tokens in `styles/tokens.css`** under Tailwind v4's `@theme` directive (typography scale, neutrals, spacing, motion, paper grain). Tokens generate utilities *and* are exposed as CSS variables CSS Modules can read. Single source.
2. **Per-page accent color is content, not a token.** Each `landscape` document in Sanity has an `accentColor` field. The route writes it once as `--accent` on the wrapper; `@theme { --color-accent: var(--accent); }` makes `bg-accent`/`text-accent`/`border-accent` work everywhere downstream. No per-page CSS files; editors change accents without code.
   ```tsx
   <main style={{ '--accent': landscape.accentColor } as React.CSSProperties}>
     <h1 className="text-accent">{landscape.title}</h1>
   </main>
   ```
3. **`/styleguide` route** at `app/(site)/styleguide/page.tsx`. Renders the full type scale, neutral + paper palette, all 8 landscape accents **queried live from Sanity** (so it can't drift), and every editorial primitive (drop cap, vinyl spin, era chip, landscape card, footnote). Doubles as a visual smoke test — no Storybook needed.

### References
- [Theme variables — Tailwind CSS](https://tailwindcss.com/docs/theme)

---

## 5. Schemas are designed for the editor, not just for the data shape

You are the editor as well as the developer. A schema file has two readers: TypeScript and you-tomorrow-writing-an-essay. An uncomfortable Studio quietly slows the project to a halt.

### Rules

1. **Always `defineType` / `defineField` / `defineArrayMember`** from `sanity` — never plain object literals. They enable strict typing in schemas and surface mistakes at edit time.
2. **Every document and object gets a `preview`** with `title`, `subtitle`, and `media`. Default previews ("Untitled" rows) make lists unusable past ~10 documents.
3. **Every document type gets an `icon`** from `@sanity/icons`. The Studio sidebar becomes scannable instead of identical squares.
4. **Group fields with `fieldsets` or `groups`** once a document exceeds ~6 fields.
5. **`validation: (Rule) => Rule.required()`** on anything the frontend renders unconditionally. Soft optionality at the schema level → null-checks scattered across `.tsx` files.
6. **Use `options.list` for enumerations** (era, category, etc.), never free-text strings. Typos in content are forever.
7. **References get `options.filter`** so the editor only sees valid targets.

### References
- [Schema rule — Sanity](https://www.sanity.io/docs/studio/schema-types)

---

## 6. One Portable Text component map, defined once, imported everywhere

Portable Text is Sanity's structured rich-text format: content is stored as typed JSON blocks (not HTML), and `@portabletext/react` walks it through a component map you define. The default renderer produces flat HTML that throws away everything editorial — drop caps, footnotes, captioned images, styled internal links.

### Rules

1. **One file: `components/editorial/PortableText.tsx`** exports a `<PortableText value={...} />` wrapper passing a shared `components` object to `@portabletext/react`. Every essay, intro, footnote, and pull-quote renders through this wrapper.
2. **The component map covers, at minimum:** drop-cap on the first paragraph of an essay, footnotes (mark → back-linked list at the bottom), internal links (`reference` mark → typed `next/link`), external links (`target="_blank" rel="noreferrer"`), captioned images, pull-quotes, and a "song" inline block that fires the MusicPlayer event from §3.
3. **Custom marks and blocks live in the schema first.** A serializer without a schema definition is dead code; a schema mark without a serializer renders as nothing. Add both in the same commit.
4. **Images inside Portable Text go through the same `next/image` + Sanity pipeline** as standalone images. Never `<img src={asset.url}>` from a serializer.
5. **No `dangerouslySetInnerHTML`, ever.** If you reach for it, the right fix is a new schema block type and a serializer.

### References
- [Portable Text rule — Sanity](https://www.sanity.io/docs/portable-text)

---

## 7. Sanity image pipeline + `next/image`, with dimensions from asset metadata

Images are the highest-bandwidth thing on an editorial site and the biggest CLS risk. Sanity already knows the exact dimensions of every uploaded asset — the frontend never has to guess.

### Rules

1. **Every image query selects asset metadata explicitly:**
   ```groq
   "image": image{
     asset->{ _id, metadata { dimensions, lqip, palette } },
     alt, caption
   }
   ```
   `dimensions` → `width`/`height`/`aspectRatio`. `lqip` → base64 blur placeholder. `palette` → dominant colors for hero backgrounds.
2. **One wrapper: `components/editorial/SanityImage.tsx`** — wraps `next/image`, takes the Sanity image object as a prop, builds `src` via `urlFor(image).width(...).auto('format').url()`, reads `width`/`height` from `asset.metadata.dimensions`. Doubles as the adapter layer if the CMS ever changes.
3. **Always pass `lqip` as `placeholder="blur" blurDataURL={lqip}`.** Free, eliminates the white flash on slow connections.
4. **`alt` is required in the schema** (§5 rule 5). The wrapper trusts it exists.
5. **`sizes` is mandatory** for any image that isn't full-width. Without it `next/image` ships the largest variant to every device.
6. **No raw `<img>` tags anywhere in `components/` or `app/`.** Lint-able invariant — audits are one grep.

### References
- [Image Metadata | Sanity Docs](https://www.sanity.io/docs/apis-and-sdks/image-metadata)
- [Next.js Image Component — Metadata — Dimensions | Sanity](https://www.sanity.io/answers/next-js-image-component-metadata-dimensions)

---

## 8. SEO is content, not code: `generateMetadata` reads from Sanity

Title, description, OG image are *content the editor controls*, not strings hardcoded in `page.tsx`. Editorial sites live or die on share previews and search snippets.

### Rules

1. **Every public document type has an `seo` object** in its schema: `title` (overrides H1 if set), `description`, `ogImage`. Fallbacks: H1 + first paragraph + hero image.
2. **Every `page.tsx` exports an async `generateMetadata`** that GROQ-queries the SEO fields and returns Next.js `Metadata`. Never hardcode `<title>` or `<meta>` in JSX.
3. **`app/sitemap.ts`** queries Sanity for all public slugs. The webhook from §1 invalidates it.
4. **`app/robots.ts`** allows `/`, disallows `/studio` and `/api`.
5. **JSON-LD per essay** — `Article` structured data emitted via a small `JsonLd` component from the same Sanity fields used on-page. No duplicate data.
6. **OG image: pick one source.** Either editor-chosen `seo.ogImage` *or* auto-generated `opengraph-image.tsx`. Shipping both triggers Next's precedence rules and causes silent surprises.

### References
- [SEO rule — Sanity](https://www.sanity.io/docs/seo)
- [Metadata Files: opengraph-image | Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)

---

## 9. Validate env vars once at module load — never read `process.env` ad hoc

A whole class of "works locally, white-screens in production" bugs comes from `process.env.X` being `undefined` at runtime because a Vercel var wasn't set. Next.js ships the broken build happily.

### Rules

1. **One file: `sanity/env.ts`** (and/or `lib/env.ts`). Imports `zod`, parses `process.env` against a schema, exports a typed `env` object.
2. **Parsing happens at module load** — top-level `const env = envSchema.parse(process.env)`. A missing/malformed var fails build or dev-server boot with a readable error naming the variable.
3. **Never `process.env.X` anywhere else.** Always `import { env } from '@/sanity/env'`.
4. **Split server-only vs. public** in the schema. The `NEXT_PUBLIC_*` subset is safe everywhere; secrets live under a `server` namespace with a runtime guard that errors if accessed during browser bundling.
5. **`.env.example` is committed and complete.** Every variable in the schema has a row with placeholder and a one-line comment. `cp .env.example .env.local` is all a new clone needs.

### References
- [Environment Variables | Next.js](https://nextjs.org/docs/app/guides/environment-variables)

---

## 10. Accessibility baseline for a Danish editorial site

Most a11y on a content site is "use semantic HTML," which the App Router + Portable Text largely enforce. These six rules cover what isn't automatic.

### Rules

1. **`<html lang="da">`** in the root layout. Affects screen-reader pronunciation, browser hyphenation, search-engine language detection, and Google's translate prompt. Biggest a11y win per character typed.
2. **Skip-link as the first focusable element** in `app/(site)/layout.tsx`:
   ```tsx
   <a href="#main" className="sr-only focus:not-sr-only ...">Spring til indhold</a>
   ```
   Then `<main id="main">` wraps `{children}`. Keyboard users get past the sticky nav in one tab.
3. **Visible `:focus-visible` styles in `tokens.css`** — outline in the accent color (hooks straight into §4). Tailwind's reset removes browser defaults; if you don't replace them, keyboard users see nothing on tab.
4. **Heading hierarchy is content's responsibility.** One `<h1>` per page; `<h2>` for sections; no skipping levels. Portable Text serializers (§6) enforce this — don't expose an `<h1>` block style in the schema.
5. **Image `alt` is required** (§5 + §7). Decorative images get `alt=""` explicitly via a schema toggle, not by leaving the field blank.
6. **Music player has accessible controls.** `<button aria-label="Afspil">`, current track in an `aria-live="polite"` region. The vinyl spin animation respects `prefers-reduced-motion`.

### References
- [WCAG 2.2 — Language of Page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html)
- [MDN — `:focus-visible`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)
