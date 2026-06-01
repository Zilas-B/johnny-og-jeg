// One-shot seed script for the eight `landscape` documents.
// Run with: pnpm sanity exec scripts/seed-landscapes.mjs --with-user-token
//
// All eight get identity fields (so the siblings grid + future Kulturen chips
// resolve). Only Naturen is fully authored (hero + empty state + seo) from
// claude-design-template/Naturen.html — the other seven are filled in Step 6.

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-05-01' })

// --- Portable Text helpers ---------------------------------------------------
// span: [text, marks?]  ->  Sanity span
function span(key, text, marks = []) {
  return { _type: 'span', _key: key, text, marks }
}
// block: one normal block from an array of spans
function block(key, spans) {
  return { _type: 'block', _key: key, style: 'normal', markDefs: [], children: spans }
}
// inline: a one-block Portable Text array
function inline(key, spans) {
  return [block(key, spans)]
}

// --- The eight landscapes ----------------------------------------------------
// Identity for all; Naturen carries the full archive-stub content.
const IDENTITY = [
  { slug: 'naturen', order: 1, rn: 'I', toponym: 'Kontinentet', period: '1607 — nu', short: 'Naturen', emWord: 'Naturen', trail: '.' },
  { slug: 'vesten', order: 2, rn: 'II', toponym: 'Grænselandet', period: '1620 — nu', short: 'Vesten', emWord: 'Vesten', trail: '.' },
  { slug: 'den-forgyldte-republik', order: 3, rn: 'III', toponym: 'Kapitalen', period: '1870 — nu', short: 'Den forgyldte', pre: 'Den ', emWord: 'forgyldte', trail: ' republik.' },
  { slug: 'syd-og-nord', order: 4, rn: 'IV', toponym: 'Splittelsen', period: '1619 — nu', short: 'Syd & Nord', pre: 'Syd & ', emWord: 'Nord', trail: '.' },
  { slug: 'vaekkelsen', order: 5, rn: 'V', toponym: 'Troen', period: '1730 — nu', short: 'Vækkelsen', emWord: 'Vækkelsen', trail: '.' },
  { slug: 'mindretallene', order: 6, rn: 'VI', toponym: 'De andre', period: '1607 — nu', short: 'Mindretallene', emWord: 'Mindretallene', trail: '.' },
  { slug: 'smeltedigelen', order: 7, rn: 'VII', toponym: 'Vitaliteten', period: '1880 — nu', short: 'Smeltedigelen', emWord: 'Smeltedigelen', trail: '.' },
  { slug: 'droemmefabrikken', order: 8, rn: 'VIII', toponym: 'Spejlet', period: '1893 — nu', short: 'Drømmefabrik', emWord: 'Drømmefabrikken', trail: '.' },
]

// Hero title as inline PT: optional plain prefix, em word (red), plain trail.
function namePT(slug, { pre, emWord, trail }) {
  const spans = []
  if (pre) spans.push(span(`${slug}-np`, pre))
  spans.push(span(`${slug}-ne`, emWord, ['em']))
  if (trail) spans.push(span(`${slug}-nt`, trail))
  return inline(`${slug}-name`, spans)
}

function identityDoc(item) {
  return {
    _id: `landscape-${item.slug}`,
    _type: 'landscape',
    name: namePT(item.slug, item),
    shortName: item.short,
    slug: { _type: 'slug', current: item.slug },
    order: item.order,
    romanNumeral: item.rn,
    toponym: item.toponym,
    period: item.period,
    accentColor: 'barn',
  }
}

// Naturen — full archive-stub content (Naturen.html lines 362–527).
const naturen = {
  ...identityDoc(IDENTITY[0]),
  eyebrow: 'Arkiv · Naturen',
  motto: 'Kontinentet og vildmarken.',
  deck: inline('nat-deck', [
    span(
      'nat-deck-a',
      'Et kontinent fire gange Europas størrelse. Vildmarken som katedral, vildmarken som resurse, vildmarken som politik. Her samler jeg notater om amerikansk natursyn, nationalparker, Dust Bowl, klimaarbejde og det jord-som-karakter, der løber gennem amerikansk litteratur fra Thoreau til McCarthy.',
    ),
  ]),
  topicsLabel: 'Emner:',
  topics: ['natursyn', 'nationalparker', 'Thoreau', 'Muir', 'Dust Bowl', 'klima', 'landskab i litteratur'],
  crumbBackText: '← Kulturen',
  crumbBackHref: '/kulturen',
  emptyMeta: '0 indlæg · arkivet åbnes',
  emptyLabel: '— ingen indlæg endnu —',
  emptyHeading: inline('nat-eh', [
    span('nat-eh-a', 'Arkivet '),
    span('nat-eh-b', 'åbner', ['em']),
    span('nat-eh-c', ' her.'),
  ]),
  emptyBody: [
    block('nat-eb1', [
      span('nat-eb1-a', 'Det her er hjørnet, hvor blogposter, anmeldelser, fund og fodnoter om '),
      span('nat-eb1-b', 'Naturen', ['strong']),
      span('nat-eb1-c', ' vil samles. Det er bevidst tomt nu — siden er en notesbog, der vokser, og dette landskab venter sin første indførsel.'),
    ]),
    block('nat-eb2', [
      span('nat-eb2-a', 'Indtil da: introduktionen på '),
      span('nat-eb2-b', 'Kulturen', ['em']),
      span('nat-eb2-c', '-siden tegner landskabets omrids. Klik tilbage og læs Landskab I, eller gå videre til et af de andre syv arkiver herunder.'),
    ]),
  ],
  emptyActions: [
    { _key: 'nat-a1', _type: 'object', text: '← Til Landskab I på Kulturen', href: '/kulturen#naturen', style: 'primary' },
    { _key: 'nat-a2', _type: 'object', text: 'Bøger, spil & film', href: '/boger-spil-film', style: 'secondary' },
  ],
  seo: {
    title: 'Naturen — Kulturen · Johnny og jeg',
    description: 'Kontinentet og vildmarken: notater om amerikansk natursyn, nationalparker, Dust Bowl og landskabet i amerikansk litteratur.',
  },
}

const docs = [naturen, ...IDENTITY.slice(1).map(identityDoc)]

async function main() {
  const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction())
  await tx.commit()
  console.log(`Seeded ${docs.length} landscape documents:`, docs.map((d) => d._id).join(', '))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
