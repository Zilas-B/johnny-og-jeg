// One-shot seed script for the `kulturenPage` singleton.
// Run with: pnpm sanity exec scripts/seed-kulturen.mjs --with-user-token
//
// Hero / intro / outro copy is lifted from claude-design-template/Kulturen.html.
// The chip grid, the eight `.land` sections and the outro archive list are all
// derived at render time from the eight `landscape` documents — see
// scripts/seed-landscapes.mjs for that content.

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-05-01' })

// --- Portable Text helpers ---------------------------------------------------
// Build spans from a string with *kursiv* and **fed** markup.
function mdSpans(prefix, text) {
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g
  const spans = []
  let last = 0
  let m
  let i = 0
  const push = (t, marks) => {
    if (t) spans.push({ _type: 'span', _key: `${prefix}-${i++}`, text: t, marks })
  }
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index), [])
    if (m[1] != null) push(m[1], ['strong'])
    else push(m[2], ['em'])
    last = re.lastIndex
  }
  push(text.slice(last), [])
  if (spans.length === 0) spans.push({ _type: 'span', _key: `${prefix}-0`, text: '', marks: [] })
  return spans
}
function mdBlock(key, style, text) {
  return { _type: 'block', _key: key, style, markDefs: [], children: mdSpans(key, text) }
}
// inline PT array (one block) for headings + one-line fields
function mdInline(key, text) {
  return [mdBlock(key, 'normal', text)]
}
// multi-paragraph PT array
function mdProse(prefix, paragraphs) {
  return paragraphs.map((t, j) => mdBlock(`${prefix}-${j}`, 'normal', t))
}

const doc = {
  _id: 'kulturenPage',
  _type: 'kulturenPage',
  hero: {
    eyebrow: 'USA · Kulturen · Et essay i otte landskaber',
    title: mdInline('khero-title', 'Republikken og dens *billeder*.'),
    subhead: 'Forskellige amerikanske kulturer, før og nu.',
    deck: mdProse('khero-deck', [
      'Amerika kan ikke fortælles som *ét* sted. Det er heller ikke én kultur — det er en samling af *landskaber*, der ligger oven på hinanden, taler i munden på hinanden og strides om hvilken af dem, der er den rigtige. Hvert landskab har sin egen tidsregning, sit eget gospel og sit eget sæt af helte.',
      'Det her er otte forsøg på at tegne dem op. Ikke som en facitliste, men som en lytters notesbog — én, der har siddet med USA i tre årtier og fortsat finder nye lag at vende.',
    ]),
  },
  chips: {
    label: mdInline('chips-label', '— Landskaberne · **klik for at hoppe ned** —'),
    count: mdInline('chips-count', 'otte felter, *én republik*'),
  },
  intro: {
    kicker: '— Hvorfor otte landskaber? —',
    heading: mdInline('intro-heading', 'Et land *fortalt* som overlappende rum.'),
    signature: '— en lytters notesbog —',
    body: mdProse('intro-body', [
      'Amerika er ikke ét sted. Det er **otte landskaber**, der ligger over hinanden som lag i en geologisk profil — kontinentet under fødderne, grænsemyten over det, industrien over det igen, religionen, splittelsen, mindretallene, smeltedigelen, og spejlet på toppen, hvor landet betragter sig selv og sender billedet videre til os.',
      'Hvor det forrige essay tegnede figurer — cowboyen, prædikanten, fangen — handler dette om de *kulturlandskaber*, figurerne lever indenfor. Det er en præcisere måde at læse landet på, fordi figurerne kun giver mening på deres rette baggrund. **Cowboyen og outlawen hører til Vesten**; **arbejderen og kapitalisten til Den forgyldte republik**; **prædikanten til Vækkelsen**. At blande dem giver det Amerika, vi importerer her — en kunst-tegning uden landkort under sig.',
      'De fleste af landskaberne er ældre, end de virker. Vækkelsen begynder i 1730’erne, ikke i 1980’erne. Den forgyldte republik begynder i 1870’erne, ikke under Reagan. Syd vs. Nord begynder i 1619, ikke i 1861. Det er en del af pointen: **landskaberne forsvinder ikke; de forskubbes.** Cowboyen i 2026 er en politisk position, ikke en kvæghyrder. Den forgyldte republik er kommet tilbage som tech-økonomi. Vækkelsen er kommet tilbage som politisk parti.',
      'Otte essays følger. Ingen af dem færdige, ingen af dem dækkende. *Læs dem som en notesbog* — en lytters forsøg på at give billedet af USA dybde, set herfra Aarhus, hvor vi kun har set landet gennem dets eget spejl.',
    ]),
  },
  outro: {
    kicker: '— Otte indgange —',
    heading: mdInline('outro-heading', 'Otte arkiver, *én læseliste*.'),
    body: mdProse('outro-body', [
      'Hvert landskab har sin egen side, hvor blogposter, anmeldelser og fund samles efterhånden som de skrives. Det her er ikke en encyklopædi — det er en notesbog, der vokser. Følg det landskab, der trækker mest, eller læs i den orden, du har lyst til.',
      'Cash dukker op flere steder, men er ikke spinen længere. Han er en god rejsefælle *gennem* landskaberne — ikke deres formål.',
    ]),
    actions: [
      { _key: 'oa1', _type: 'object', text: 'Se også Historien →', href: '/historien', style: 'primary' },
      { _key: 'oa2', _type: 'object', text: 'Til læselisten', href: '/boeger-spil-film', style: 'secondary' },
      { _key: 'oa3', _type: 'object', text: 'Tilbage til Cash', href: '/', style: 'secondary' },
    ],
    cardLead: '— De otte arkiver —',
    cardHeading: 'Spring direkte ind.',
  },
  seo: {
    title: 'Kulturen — Republikken og dens billeder · Johnny og jeg',
    description:
      'Otte kulturlandskaber over USA — naturen, vesten, kapitalen, splittelsen, troen, mindretallene, smeltedigelen og drømmefabrikken — set fra Aarhus.',
  },
}

async function main() {
  await client.createOrReplace(doc)
  console.log('Seeded kulturenPage singleton.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
