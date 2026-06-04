// One-shot seed for the Foredrag page (`foredragPage` singleton, Step 7d).
// Run with: pnpm sanity exec scripts/seed-foredrag.mjs --with-user-token
//
// Authors the hero + ticket, three programme posters, the practical grid,
// venues + testimonial, booking copy, and FAQ verbatim from
// claude-design-template/Foredrag.html. _id 'foredragPage' (non-draft) →
// published; createOrReplace keeps re-runs idempotent.

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-05-01' })

// --- Portable Text helpers (mirror the other seeds) --------------------------
function span(key, text, marks = []) {
  return { _type: 'span', _key: key, text, marks }
}
function block(key, spans, style = 'normal', markDefs = []) {
  return { _type: 'block', _key: key, style, markDefs, children: spans }
}
function mdSpans(prefix, text) {
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g
  const spans = []
  let last = 0
  let i = 0
  let m
  const push = (t, marks) => {
    if (t) spans.push(span(`${prefix}-${i++}`, t, marks))
  }
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index), [])
    if (m[1] != null) push(m[1], ['strong'])
    else push(m[2], ['em'])
    last = re.lastIndex
  }
  push(text.slice(last), [])
  if (spans.length === 0) spans.push(span(`${prefix}-0`, '', []))
  return spans
}
function mdBlock(key, text, style = 'normal') {
  return block(key, mdSpans(key, text), style)
}
function mdInline(key, text) {
  return [mdBlock(key, text)]
}
function mdProse(prefix, paragraphs) {
  return paragraphs.map((text, i) => mdBlock(`${prefix}-${i}`, text))
}
const keyed = (arr, prefix) => arr.map((o, i) => ({ _key: `${prefix}${i}`, _type: 'object', ...o }))

// --- Content -----------------------------------------------------------------
const hero = {
  eyebrow: 'Foredrag · Menighed · Højskole · Bibliotek',
  title: 'Foredrag',
  titleSmall: 'om Cash, troen og Amerika',
  deck: mdProse('hero-deck', [
    'Tre programmer om en mand, jeg har lyttet til hele mit voksne liv — og om det land, han både elskede og formanede. *Musik, billeder og samtale.* 60 til 90 minutter, alt efter hvor I har lyst at sidde med.',
  ]),
  metaCells: keyed(
    [
      { k: 'Varighed', v: '60 – 90 min.' },
      { k: 'Sprog', v: 'Dansk' },
      { k: 'Region', v: 'Hele landet' },
    ],
    'mc',
  ),
  ticket: {
    stampTop: 'Booking',
    stampBig: 'åben',
    stampBottom: '2026',
    headLhs: 'Adm. ét stk.\nForedrag · Side A–C',
    headNum: '№ 014',
    heading: 'Johnny & jeg\n— et aftenforedrag',
    lines: keyed(
      [
        { label: 'Sted', value: 'Hos jer' },
        { label: 'Varighed', value: '60–90 min.' },
        { label: 'Tilrettelæggelse', value: 'Mads, m. guitar' },
        { label: 'Tidligst ledig', value: 'Fra sept. ’26' },
      ],
      'tl',
    ),
    priceLabel: 'Honorar fra',
    price: '4.500',
    priceUnit: 'kr.',
    ctaText: 'Forespørg en dato →',
    ctaHref: '#book',
  },
}

const programsHead = {
  kicker: '— Tre programmer · Side A · Side B · Side C —',
  heading: mdInline('ph-h', 'Tre aftener, tre nåle på pladen.'),
  deck: mdProse('ph-d', [
    'Cash er ikke ét tema. Vælg det program, der passer til jeres aften — eller bed mig sammensætte noget på tværs. Hver aften kan stå alene, eller binde sammen til en kortere serie.',
  ]),
}

const programs = [
  {
    side: 'Side A',
    roman: 'Nº I',
    theme: 'Musikeren',
    heading: 'Manden i sort & stemmen, der knækkede',
    sub: '— Et musikalsk portræt —',
    body: 'Fra Sun Records og rockabilly til “Hurt”. Jeg fortæller om sangskriveren, samarbejdet med June, om hans amfetamin-år og hans comeback med Rick Rubin. Med små lytteeksempler undervejs — og hvis salen tillader det: en sang eller to på guitaren.',
    arc: [
      'Bomuldsmarken & Memphis (1932–1956)',
      'Sun, salt og synd (1956–1966)',
      'Folsom, San Quentin & June (1968–1979)',
      'Comeback & “Hurt” (1994–2003)',
    ],
    duration: '75 min.',
    bestFor: 'Bibliotek · Forening',
  },
  {
    side: 'Side B',
    roman: 'Nº II',
    theme: 'Troen',
    heading: 'Cash & Jesus — en evangelists arbejde',
    sub: '— Et åndeligt portræt —',
    body: 'Cash læste Det Nye Testamente fra ende til anden — flere gange — og indspillede en fuld lydbogsversion af det. I “The Gospel Road” (1973) går han bogstaveligt i Jesu fodspor i Det Hellige Land. Et foredrag om en troende, der både faldt og blev rejst igen, og som aldrig holdt op med at synge salmer.',
    arc: [
      'Salmerne fra Dyess Colony',
      'Broderen Jacks død (1944)',
      'Vækkelse, fald og oprejsning',
      '“The Gospel Road” & American IV',
    ],
    duration: '90 min.',
    bestFor: 'Menighed · Højskole',
  },
  {
    side: 'Side C',
    roman: 'Nº III',
    theme: 'Amerika',
    heading: 'Cash & den ragged old flag',
    sub: '— Et politisk portræt —',
    body: 'Cashs liv løber langs USA’s rygrad: depressionen, borgerrettighederne, Vietnam, Watergate, Reagan-årene, 11. september. Han spillede for Nixon — og nægtede at synge det, Nixon gerne ville høre. Et foredrag om en patriot, der elskede sit land for højt til at lade det slippe billigt.',
    arc: [
      'New Deal-koloni i Arkansas',
      '“Bitter Tears” & Civil Rights',
      'Nixon, Vietnam & Watergate',
      'Highwaymen & det moderne USA',
    ],
    duration: '75 min.',
    bestFor: 'Højskole · Forening',
  },
].map((p, i) => ({
  _key: `prog${i}`,
  _type: 'program',
  ...p,
  heading: mdInline(`prog${i}-h`, p.heading),
}))

const practical = {
  kicker: '— Det praktiske —',
  heading: mdInline('pr-h', 'Hvad I kan *regne* med fra mig.'),
  intro:
    'Et foredrag, jeg har holdt mange gange før — men aldrig helt på samme måde. Jeg medbringer egen guitar og en lille forstærker; PA-anlæg er rart, men ikke nødvendigt i mindre saler. Honoraret er fast og dækker forberedelse, materialer og kørsel inden for landets grænser.',
  cells: keyed(
    [
      {
        k: '01',
        label: '— Honorar —',
        heading: 'Fra 4.500 kr.',
        body: 'Standardpris for menigheder, biblioteker og foreninger. Højskoler og virksomheder efter aftale. Inkluderer forberedelse, kørsel og materialer.',
      },
      {
        k: '02',
        label: '— Varighed —',
        heading: '60–90 min.',
        body: 'Selve foredraget. Hertil 15 min. til opstilling og 20 min. til samtale efter, hvis I ønsker det. Kan kortes ned til 45 min. ved arrangementer med flere indslag.',
      },
      {
        k: '03',
        label: '— Teknik —',
        heading: 'Holder sig let.',
        body: 'Jeg medbringer guitar, lille forstærker, projektor og slides. I sørger blot for et lærred (eller en hvid væg) og en stol til mig.',
      },
      {
        k: '04',
        label: '— Geografi —',
        heading: 'Hele landet.',
        body: 'Aarhus og omegn er hjemmebanen. København, Fyn, Vendsyssel, Bornholm — alt er muligt; transport-tillæg ud over Storebælt aftales særskilt.',
      },
    ],
    'pc',
  ),
}

const venuesHead = {
  kicker: '— Tidligere stop på turen —',
  heading: mdInline('vh-h', 'Steder, hvor pladen har kørt.'),
  deck: mdProse('vh-d', [
    'Et udvalg af menigheder, biblioteker og højskoler, der har inviteret indenfor — og som måske kan stå inde for, at det er en aften værd at sætte af.',
  ]),
}

const venues = keyed(
  [
    { yr: '2024', place: 'Aarhus Hovedbibliotek — Dokk1', city: 'Aarhus' },
    { yr: '2024', place: 'Vor Frue Kirke — sognesal', city: 'Aarhus' },
    { yr: '2024', place: 'Testrup Højskole — efterårsmøde', city: 'Mårslet' },
    { yr: '2025', place: 'Sankt Pauls Kirke', city: 'København K' },
    { yr: '2025', place: 'Silkeborg Bibliotek', city: 'Silkeborg' },
    { yr: '2025', place: 'Indre Mission — kredsforening', city: 'Holstebro' },
    { yr: '2025', place: 'Risskov Gymnasium — fællesarrangement', city: 'Risskov' },
    { yr: '2025', place: 'Diakonhøjskolen', city: 'Aarhus N' },
    { yr: '2026', place: 'Sct. Catharinæ Kirke', city: 'Hjørring' },
    { yr: '2026', place: 'Den Jydske Håndværkerskole', city: 'Hadsten' },
  ],
  'vn',
)

const testimonial = {
  quote:
    'Mads kom til vores menighedsaften med guitar i hånden og en bog under armen, og talte om Cash, som var han en gammel ven. Vi sad fastnaglet i halvanden time. Min kone — der ikke ellers er Cash-fan — købte en plade i pausen.',
  attribName: 'Pastor Thorkild N.',
  attribPlace: 'Sct. Pauls Kirke, KBH',
  attribWhen: 'Foråret 2025',
  alsoLabel: '— Også booket af —',
  alsoOrgs: ['Ældre Sagen', 'FDF', 'KFUM', 'LOF', 'AOF'],
}

const booking = {
  kicker: '— Bestil et foredrag —',
  heading: 'Find en aften.\nSkriv et brev.',
  body: mdProse('bk-b', [
    'Send mig nogle linjer om jeres arrangement: hvilket program der har fanget jer, hvor mange gæster I venter, hvad I forestiller jer af aften. Jeg svarer alle henvendelser personligt, som regel inden for en uges tid — og oftest med flere mulige datoer i lommen.',
    'Er I i tvivl, om det er noget for jer? Skriv alligevel. En kort samtale plejer at gøre det klart i begge retninger.',
  ]),
  scripture: '“Forkynd Ordet, vær rede i tide og i utide.”',
  scriptureRef: '2. Tim. 4:2',
  formTitle: 'Booking-anmodning',
  formStamp: 'No. 014 / MMXXVI',
  formPostmark: 'Aarhus, DK',
  formSuccess: '✓ Tak for din anmodning. Jeg vender tilbage med ledige datoer hurtigst muligt.',
}

const faqHead = {
  kicker: '— Forespørgsler & spørgsmål —',
  heading: mdInline('fh-h', 'Det jeg ofte bliver spurgt om.'),
}

const faq = keyed(
  [
    {
      q: 'Skal vi have et lydanlæg?',
      a: 'Ikke nødvendigt under 80 gæster. Jeg medbringer en lille batteridrevet forstærker til guitar og mikrofon. Til større saler er PA-anlæg rart, men ikke et krav.',
    },
    {
      q: 'Holder du foredraget på engelsk?',
      a: 'Det er primært et dansk foredrag, men sangtekster og citater læses på originalsproget med dansk forklaring. Hele foredraget kan også afholdes på engelsk efter aftale.',
    },
    {
      q: 'Kan I sammensætte et eget program?',
      a: 'Ja, gerne. Skriv om jeres ønske — særligt hvis I ønsker at fokusere på et bestemt album, en bestemt periode, eller et bestemt teologisk tema (f.eks. salmesangstradition, syndsforladelse, eller arbejderens rolle).',
    },
    {
      q: 'Synger du selv undervejs?',
      a: 'Som regel én eller to sange — “Folsom Prison Blues”, “Man in Black” eller “The Old Rugged Cross”, alt efter aftenens karakter. Det er ikke en koncert; sangen er der for at understrege en pointe.',
    },
    {
      q: 'Hvor langt fra Aarhus kører du?',
      a: 'Hele Jylland og Fyn uden særskilt rejsetillæg. Sjælland, øer og Bornholm med transporttillæg, der aftales særskilt — typisk 800–1.500 kr. afhængigt af afstand.',
    },
    {
      q: 'Er der bogsalg eller andet ved arrangementet?',
      a: 'Hvis I ønsker det, medbringer jeg en lille bogbutik med Cash-litteratur og udvalgte plader. Salget er kommissionsfrit; jeg står selv for det praktiske.',
    },
  ],
  'fq',
)

async function main() {
  const doc = {
    _id: 'foredragPage',
    _type: 'foredragPage',
    hero,
    programsHead,
    programs,
    practical,
    venuesHead,
    venues,
    testimonial,
    booking,
    faqHead,
    faq,
    seo: {
      title: 'Foredrag — Johnny og jeg',
      description:
        'Tre foredrag om Johnny Cash, troen og Amerika — musik, billeder og samtale. 60–90 minutter, hele landet. Book en aften til menighed, højskole, bibliotek eller forening.',
    },
  }

  await client.createOrReplace(doc)
  console.log(`Seeded foredragPage: ${doc._id} (/foredrag)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
