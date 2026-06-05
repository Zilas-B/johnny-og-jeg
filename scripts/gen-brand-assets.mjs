// Generates the two binary brand assets for Step 9 (SEO & metadata):
//   - app/favicon.ico   — branded 32x32 ICO fallback (modern browsers use app/icon.svg)
//   - public/og-default.jpg — 1200x630 default Open Graph share image
//
// app/icon.svg is the source of truth for the mark; the .ico is rendered from it
// so the two never drift. The OG default is a cover-crop of a template photo.
// Re-run with: node scripts/gen-brand-assets.mjs
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// sharp is a transitive dep (via next) and not hoisted to top-level
// node_modules under pnpm — import it from its resolved .pnpm location.
const { default: sharp } = await import(
  pathToFileURL(path.join(root, 'node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js')).href
)

/** Wrap a PNG buffer in a single-image ICO container (PNG-in-ICO, Vista+). */
function pngToIco(png, size) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // image type = icon
  header.writeUInt16LE(1, 4) // image count
  const entry = Buffer.alloc(16)
  entry.writeUInt8(size >= 256 ? 0 : size, 0) // width (0 = 256)
  entry.writeUInt8(size >= 256 ? 0 : size, 1) // height
  entry.writeUInt8(0, 2) // colour-palette count
  entry.writeUInt8(0, 3) // reserved
  entry.writeUInt16LE(1, 4) // colour planes
  entry.writeUInt16LE(32, 6) // bits per pixel
  entry.writeUInt32LE(png.length, 8) // image byte size
  entry.writeUInt32LE(22, 12) // offset (6 + 16)
  return Buffer.concat([header, entry, png])
}

async function buildFavicon() {
  const svg = await readFile(path.join(root, 'app/icon.svg'))
  const png = await sharp(svg, { density: 256 }).resize(32, 32).png().toBuffer()
  await writeFile(path.join(root, 'app/favicon.ico'), pngToIco(png, 32))
  console.log('✓ app/favicon.ico (32x32, branded)')
}

async function buildOgDefault() {
  const src = path.join(root, 'claude-design-template/images/cash-stars-and-stripes.jpeg')
  await sharp(src)
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, progressive: true })
    .toFile(path.join(root, 'public/og-default.jpg'))
  console.log('✓ public/og-default.jpg (1200x630)')
}

await buildFavicon()
await buildOgDefault()
