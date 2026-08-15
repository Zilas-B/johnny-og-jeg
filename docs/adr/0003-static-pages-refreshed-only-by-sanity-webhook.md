---
status: accepted
---

# Pages are static and refresh only when Sanity calls the webhook

The site rendered every request dynamically, which made an editor's publish appear instantly but paid for it on every single page view. For launch we needed pages that are fast by default and still let a non-technical editor publish an archive entry and watch it appear within seconds, without a developer redeploying. We decided to **prerender the site statically and refresh individual pages by tag, driven by a Sanity webhook and nothing else** — no time-based revalidation window behind it.

## Considered Options

- **Keep rendering dynamically.** Always fresh, no invalidation to get wrong. Rejected: every reader pays for a Sanity round trip on a site whose content changes a few times a week.
- **Static plus a time-based revalidation window.** The usual belt-and-braces: the webhook refreshes quickly, and a timer catches anything the webhook missed. Rejected because the timer hides webhook failures rather than fixing them — the page eventually corrects itself, so nobody ever learns the delivery is broken — and it re-renders pages on a schedule that has nothing to do with when the content actually changed.
- **Static, webhook-only, refreshed by tag.** Chosen. A publish busts exactly the tags for that document type and slug; everything else stays cached until it has a reason not to.

## Consequences

- **A failed webhook delivery means silent staleness.** There is no backstop. The mitigation is operational, not automatic: the Sanity delivery log is the place to look when a change does not appear, and the fixes are a redeploy or a manual revalidation. This was accepted knowingly over adding a timer.
- **The webhook points at the stable Vercel deployment URL, not the custom domain, and stays there.** It was wired before the domain existed and is deliberately decoupled from it — moving or losing the domain does not break content freshness. Do not "tidy" it onto the public domain.
- A newly published document whose path was not built at deploy time still renders on demand rather than 404ing, so the editor never has to wait for a deploy.
- Every data fetch must be tagged for this to work. An untagged fetch is a page that will never refresh, and the failure is invisible — it looks like a page that simply did not change.
- The site therefore requires all required singleton documents to be published before it will build at all: a missing one throws during prerender, which is a build failure rather than a runtime error on one page.
