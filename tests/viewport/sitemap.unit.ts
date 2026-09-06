import { expect, test } from '@playwright/test'

import { pathsFromSitemap } from './sitemap'

const xml = (locs: string[]) =>
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locs.map((loc) => `<url><loc>${loc}</loc><lastmod>2026-01-01</lastmod></url>`).join('\n')}
</urlset>`

test('maps every <loc> to its path, whatever origin the sitemap was built for', () => {
  const paths = pathsFromSitemap(
    xml([
      'https://johnnyogjeg.dk',
      'https://johnnyogjeg.dk/historien',
      'http://localhost:3000/naturen',
    ]),
  )
  expect(paths).toEqual(['/', '/historien', '/naturen'])
})

test('deduplicates and puts the front page first', () => {
  const paths = pathsFromSitemap(
    xml(['https://x.dk/b', 'https://x.dk/a', 'https://x.dk/', 'https://x.dk/a']),
  )
  expect(paths).toEqual(['/', '/a', '/b'])
})

test('an empty sitemap yields no routes rather than throwing', () => {
  expect(pathsFromSitemap(xml([]))).toEqual([])
})
