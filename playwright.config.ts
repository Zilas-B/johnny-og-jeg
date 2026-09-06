import { defineConfig, devices } from '@playwright/test'

// Viewport smoke tests — see docs/TechStack.md (Testing) and issue #25.
//
// One Chromium project per width. Each project runs the same spec, which
// discovers routes from the site's own sitemap (globalSetup) and asserts the
// document never scrolls horizontally. Screenshots are artefacts for a human
// to look at; nothing is pixel-diffed.
//
// Locally the suite runs against `pnpm dev` (or an already-running dev server
// on :3000). In CI the app is already built, so it runs against `pnpm start`.
//
// Deviation, stated: CLAUDE.md confines `process.env` to `sanity/env.ts`. That
// rule guards the app's boot (fail by name on a missing variable); this file is
// test-runner config that never ships, and `CI` is the runner's own switch.

export const BASE_URL = 'http://localhost:3000'

const WIDTHS = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
]

export default defineConfig({
  testDir: 'tests/viewport',
  outputDir: 'test-results',
  globalSetup: './tests/viewport/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 90_000,
  use: {
    baseURL: BASE_URL,
    // The dev server compiles a route on first hit; give it room.
    navigationTimeout: 60_000,
    trace: 'off',
    video: 'off',
  },
  projects: [
    {
      name: 'unit',
      testMatch: /.*\.unit\.ts/,
    },
    ...WIDTHS.map((viewport) => ({
      name: `w${viewport.width}`,
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport,
        deviceScaleFactor: 1,
      },
    })),
  ],
  webServer: {
    command: process.env.CI ? 'pnpm start' : 'pnpm dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    // `predev` runs Sanity typegen before Next boots.
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
