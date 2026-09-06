import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import type { FullConfig } from '@playwright/test'

import { ROUTES_FILE } from './paths'
import { pathsFromSitemap } from './sitemap'

// Runs once, after Playwright has started (or reused) the web server and
// before any spec file is loaded. Spec files can only declare tests
// synchronously, so the async sitemap fetch happens here and the result is
// handed over as a JSON file in the output dir.
//
// Note: the `unit` project needs none of this, but globalSetup is global, so
// `--project=unit` still boots the web server and fetches the sitemap.

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL
  if (!baseURL) throw new Error('playwright.config.ts must set use.baseURL')

  const res = await fetch(`${baseURL}/sitemap.xml`)
  if (!res.ok) {
    throw new Error(`GET ${baseURL}/sitemap.xml answered ${res.status} — cannot discover routes`)
  }
  const routes = pathsFromSitemap(await res.text())
  if (routes.length === 0) {
    throw new Error(`${baseURL}/sitemap.xml lists no URLs — nothing to test`)
  }

  mkdirSync(path.dirname(ROUTES_FILE), { recursive: true })
  writeFileSync(ROUTES_FILE, JSON.stringify(routes, null, 2))
  console.log(`viewport: ${routes.length} route(s) from sitemap: ${routes.join(' ')}`)
}
