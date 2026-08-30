# Content-shape changes ship behind defensive reads, tested on a staging dataset

A Sanity schema change and the content migration it requires are one change, but they
execute minutes apart: Vercel deploys the code, then someone runs the migration against
the dataset. Whichever order we pick, the site spends that window reading content in a
shape the code does not expect. We decided that any change to the shape of existing
content ships in three moves — first a deploy whose read path accepts **both** the old
and the new shape, then the migration, then a follow-up commit that deletes the
old-shape branch — and that the migration is rehearsed against a `staging` dataset
before it touches `production`.

## Considered Options

- **Migrate first, then deploy.** The old code reads the new shape and renders empty
  values — a soft failure rather than a crash. Cheap, and tempting for a site with one
  editor. Rejected because the size of the window depends on how fast someone notices
  the deploy finished, and the failure is silent: blank rows look like missing content,
  not like a broken deploy.
- **Deploy first, then migrate.** Rejected outright — the new code reading the old shape
  is a hard failure, and for the case that prompted this (an array of objects becoming an
  array of strings) it throws in React rather than degrading.
- **No staging dataset; rely on `sanity migrations run`'s dry-run default plus a
  `sanity dataset export` backup.** Rejected. The dry run proves the patches are
  well-formed, not that the migrated content renders — only a dataset the site can
  actually be pointed at proves that.

## Consequences

- Every content-shape change is **at least two issues**: the one that migrates, and the
  one that removes the defensive read. The second is easy to forget and leaves dead
  branches in the render path, so it is filed at the same time as the first, not after.
- Migrations must be **idempotent**, since they will be run against staging and then
  production. Prefer a migration whose second run is a no-op by construction over one
  that needs an idempotence key.
- The project now carries a second dataset. `production` remains the only dataset the
  deployed site reads; `staging` exists to be broken.
