import path from 'node:path'

// Where the suite writes things other than Playwright's own per-test folders.
// Absolute, anchored on this file, so spec and globalSetup agree regardless of
// the working directory Playwright was launched from.
const OUTPUT_DIR = path.resolve(__dirname, '../../test-results')

/** Routes discovered by globalSetup, consumed by the spec at load time. */
export const ROUTES_FILE = path.join(OUTPUT_DIR, 'viewport-routes.json')

/** Stable, human-browsable screenshot location: `w<width>/<route>.png`. */
export const SCREENSHOTS_DIR = path.join(OUTPUT_DIR, 'screenshots')
