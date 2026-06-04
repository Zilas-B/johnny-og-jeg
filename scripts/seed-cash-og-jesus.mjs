// One-shot seed script for the Cash og Jesus essay (`page` document, Step 7b Plan 2a).
// Run with: pnpm sanity exec scripts/seed-cash-og-jesus.mjs --with-user-token
//
// Authors the six blocks (hymnHero · scriptureStrip · stations · hymnal ·
// pullQuote · nextEssay) verbatim from claude-design-template/Cash og Jesus.html.
// Non-draft _id → published directly; createOrReplace keeps re-runs idempotent.

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-05-01' })

// --- Portable Text helpers (mirrors scripts/seed-musikeren.mjs) --------------
function span(key, text, marks = []) {
  return { _type: 'span', _key: key, text, marks }
}
function block(key, spans, style = 'normal', markDefs = []) {
  return { _type: 'block', _key: key, style, markDefs, children: spans }
}
// Parse *kursiv* / **fed** markup into spans.
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
// A single block (default normal) from a markup string.
function mdBlock(key, text, style = 'normal') {
  return block(key, mdSpans(key, text), style)
}
// A one-block inline PT array from a markup string.
function mdInline(key, text) {
  return [mdBlock(key, text)]
}
// A prose block built from segments, each { t, em?, href? } — adds link markDefs.
function richBlock(key, segments) {
  const markDefs = []
  const children = segments.map((seg, i) => {
    const marks = []
    if (seg.em) marks.push('em')
    if (seg.href) {
      const defKey = `${key}-l${i}`
      markDefs.push({ _type: 'link', _key: defKey, href: seg.href })
      marks.push(defKey)
    }
    return span(`${key}-${i}`, seg.t, marks)
  })
  return block(key, children, 'normal', markDefs)
}
// YouTube search href from a query string.
const yt = (q) => `https://www.youtube.com/results?search_query=${q}`

// --- Block builders ----------------------------------------------------------
const hymnHero = {
  _type: 'hymnHero',
  _key: 'b-hero',
  eyebrow: 'Side B  ·  Hymnal No. 14',
  romanNumeral: 'II.',
  heading: mdInline('hero-h', 'Cash *og* Jesus.'),
  lede: [
    mdBlock(
      'hero-lede',
      'Han faldt og rejste sig — og faldt igen. Cash sang for fanger, fordi han forstod den, der har brug for nåde. Fra moderens salmer i Dyess, Arkansas, til en sidste hvisken om en personlig Jesus: troen var aldrig en facade. Den var hans rygrad i sort.',
    ),
  ],
  metaItems: [
    { _key: 'm1', _type: 'object', label: 'Hør salmerne', value: 'nedenunder' },
    { _key: 'm2', _type: 'object', label: 'Læsetid', value: '~ 10 min.' },
    { _key: 'm3', _type: 'object', label: '7 spor i pladespilleren' },
  ],
  glassCaptionTop: '— Hymnal · No. 14 —',
  glassQuote: 'Were You There When They Crucified My Lord',
}

const scriptureStrip = {
  _type: 'scriptureStrip',
  _key: 'b-scripture',
  quote: 'For jeg skammer mig ikke ved evangeliet.',
  reference: 'Rom. 1:16',
}

const stations = {
  _type: 'stations',
  _key: 'b-stations',
  kicker: '— Stationer på en faldet vej —',
  heading: mdInline('st-h', 'Seks stationer i én tro.'),
  deck: [
    mdBlock(
      'st-deck',
      'Cashs tro var ikke en linje — den var en sløjfe. Han faldt, fandt nåden, faldt igen, og fandt den igen. Her er seks stop på vejen — fra moderens salmebog til hans sidste indspilning.',
    ),
  ],
  items: [
    {
      _key: 's1',
      _type: 'stationItem',
      roman: 'I',
      years: '— 1935 —',
      location: 'Dyess · AR',
      heading: 'Salmerne fra bomuldsmarken.',
      where: 'Dyess Baptist Church · Mississippi River Delta',
      body: [
        mdBlock(
          's1b',
          'Moderen Carrie sang ved arbejdet. Faderen Ray sang ikke. Familien sad sammen om en træ-radio og hørte gospel fra *WLAC* og *WMPS*. Sønnen J. R. lærte først at synge fra sin mor, og dernæst fra en salmebog. Han kunne hele *The Old Rugged Cross* i en alder, hvor andre børn lærte at læse.',
        ),
      ],
      quote: {
        _type: 'object',
        text: 'Hun sagde, jeg havde en gave fra Gud. Jeg vidste ikke, hvad det var. Jeg vidste bare, det var noget, jeg ikke selv havde lavet.',
        attribution: '— Cash om sin mor, 1997',
      },
    },
    {
      _key: 's2',
      _type: 'stationItem',
      roman: 'II',
      years: '— 1944 —',
      location: 'Dyess · AR',
      heading: 'Jack — englene i savsmøllen.',
      where: 'Dyess sawmill · 21. maj 1944',
      body: [
        mdBlock(
          's2b',
          'Hans storebror Jack, der ville være præst, faldt over en cirkelsav og døde en uge senere. På sit dødsleje sagde han, at han hørte engle synge og så døren stå åben. Cash troede ham. Hele hans senere liv blev en samtale med den åbne dør: når han faldt, var det Jack der trak. Når han sang en salme i en koncertsal, var det Jack der lyttede.',
        ),
      ],
      quote: {
        _type: 'object',
        text: 'Jeg har ham med mig hele tiden. Jeg taler med ham. Jeg synger for ham. Han er aldrig blevet væk for mig.',
        attribution: '— Cash, “Cash: The Autobiography”, 1997',
      },
    },
    {
      _key: 's3',
      _type: 'stationItem',
      roman: 'III',
      years: '— 1967 —',
      location: 'Nickajack · TN',
      heading: 'Hulen ved Nickajack.',
      where: 'Nickajack Cave · Marion County · Tennessee',
      body: [
        richBlock('s3b', [
          { t: 'Efter ti år med amfetamin og barbiturater kørte han ud til ' },
          { t: 'Nickajack Cave', href: 'https://en.wikipedia.org/wiki/Nickajack_Cave' },
          {
            t: ' for at dø. Han ville gå indtil hans lommelygte gik ud, og så blive der. Han fortalte siden, at han i mørket mødte Gud — eller mødte sit eget mod til at leve. Han kravlede ud og fandt sin mor, der var kommet rejsende fra Californien. Hun vidste, hvor han var, sagde hun. Hun havde set det i en drøm.',
          },
        ]),
      ],
      quote: {
        _type: 'object',
        text: 'Jeg gik så langt ind i hulen, jeg kunne. Og så vendte jeg om. Det var det enkleste valg, jeg nogensinde har truffet.',
        attribution: '— Cash, MTV-interview 1999',
      },
    },
    {
      _key: 's4',
      _type: 'stationItem',
      roman: 'IV',
      years: '— 1973 —',
      location: 'Galilæa',
      heading: 'The Gospel Road.',
      where: 'Israel · Optaget i Galilæa · 1971—72',
      body: [
        richBlock('s4b', [
          { t: 'Cash og June kørte til Israel for at filme hans egen Jesus-film, ' },
          { t: 'The Gospel Road', em: true, href: 'https://en.wikipedia.org/wiki/The_Gospel_Road' },
          {
            t: '. Han skrev manuskriptet sammen med June og fortæller selv hele historien. Han er ikke en præst der ser sentimentalt på Jesus — han er en mand, der ser en redningsmand. Filmen blev en flop i biograferne, men en hit i amerikanske menigheder og kirkesale. Han mistede penge på den. Han fortrød det aldrig.',
          },
        ]),
      ],
    },
    {
      _key: 's5',
      _type: 'stationItem',
      roman: 'V',
      years: '— 1971—00 —',
      location: 'USA · turné',
      heading: 'Manden i sort, som prædikant.',
      where: 'Billy Graham Crusades · 1971 — 1992',
      body: [
        richBlock('s5b', [
          { t: 'Hans bedste ven blev ' },
          { t: 'Billy Graham', href: 'https://en.wikipedia.org/wiki/Billy_Graham' },
          {
            t: '. I tyve år sang Cash ved Grahams kæmpe-vækkelser — for nogle gange mere end 100 000 mennesker ad gangen. Han fik også titel som ordineret diakon i en sydstats-baptistmenighed. Da han blev spurgt om sin teologi, svarede han enkelt: “Jeg er kristen. Jeg er ikke meget mere klog end det.”',
          },
        ]),
      ],
    },
    {
      _key: 's6',
      _type: 'stationItem',
      roman: 'VI',
      years: '— 2002 —',
      location: 'Hendersonville · TN',
      heading: 'Personal Jesus — den sidste version.',
      where: 'Cash Cabin Studio · Tennessee',
      body: [
        mdBlock(
          's6b',
          'På American IV indspillede han Depeche Modes *Personal Jesus*. Han var i 70’erne, han kunne knap stå op, han var ved at miste hørelsen. Men han sang den som om den altid havde været hans. Det er det sidste ord i bogen om Cash og Jesus: en mand, der har båret sin Frelser så længe, at han ikke længere kan skelne sangen fra sit eget åndedræt.',
        ),
      ],
      quote: {
        _type: 'object',
        text: 'Reach out and touch faith.',
        attribution: '— Personal Jesus · American IV · 2002',
      },
    },
  ],
}

const hymnal = {
  _type: 'hymnal',
  _key: 'b-hymnal',
  kicker: '— Hymnal No. 14 · Cash & Jesus —',
  heading: mdInline('hy-h', 'Pladespillerens salmebog.'),
  deck: [
    mdBlock(
      'hy-deck',
      'Salmerne nedenunder spiller i pladespilleren i bunden af siden. Klik på en titel for at lægge den på næste plads i nålen — eller spring ud til YouTube, Spotify eller Wikipedia hvor som helst.',
    ),
  ],
  columns: [
    {
      _key: 'c1',
      _type: 'hymnalColumn',
      header: 'Side B · Salmerne',
      subhead: 'Cashs egne salmer, fra Sun til American',
      rows: [
        { _key: 'c1r1', _type: 'hymnRow', number: 'B1', title: 'The Old Rugged Cross', sub: 'My Mother’s Hymn Book · 2004', duration: '3:55', href: yt('Johnny+Cash+The+Old+Rugged+Cross') },
        { _key: 'c1r2', _type: 'hymnRow', number: 'B2', title: 'Were You There', sub: 'Hymns · 1959', duration: '4:11', href: yt('Johnny+Cash+Were+You+There') },
        { _key: 'c1r3', _type: 'hymnRow', number: 'B3', title: 'Why Me Lord', sub: 'A Believer Sings the Truth · 1979', duration: '3:28', href: yt('Johnny+Cash+Why+Me+Lord') },
        { _key: 'c1r4', _type: 'hymnRow', number: 'B4', title: 'Daddy Sang Bass', sub: 'The Holy Land · 1969', duration: '2:21', href: yt('Johnny+Cash+Daddy+Sang+Bass') },
      ],
    },
    {
      _key: 'c2',
      _type: 'hymnalColumn',
      header: 'Side B · Bekendelserne',
      subhead: 'Sangene hvor han bekender sit eget',
      rows: [
        { _key: 'c2r1', _type: 'hymnRow', number: 'B5', title: 'Personal Jesus', sub: 'American IV · 2002', duration: '3:21', href: yt('Johnny+Cash+Personal+Jesus') },
        { _key: 'c2r2', _type: 'hymnRow', number: 'B6', title: 'The Man Comes Around', sub: 'American IV · 2002', duration: '4:26', href: yt('Johnny+Cash+The+Man+Comes+Around') },
        { _key: 'c2r3', _type: 'hymnRow', number: 'B7', title: 'Redemption', sub: 'American Recordings · 1994', duration: '3:03', href: yt('Johnny+Cash+Redemption') },
        { _key: 'c2r4', _type: 'hymnRow', number: 'B8', title: 'God’s Gonna Cut You Down', sub: 'American V · 2006 (posthumt)', duration: '2:38', href: yt("Johnny+Cash+God's+Gonna+Cut+You+Down") },
      ],
    },
  ],
}

const pullQuote = {
  _type: 'pullQuote',
  _key: 'b-gospel',
  kicker: '— Et farvel i to linjer —',
  quote: [
    mdBlock('gp1', 'Jeg er ikke nominelt kristen — jeg er kristen.'),
    mdBlock('gp2', 'Men jeg er også synder. Den ene fakta annullerer ikke den anden.'),
  ],
  attribution: ['Cash', 'til Rolling Stone', '2000'],
  background: 'accentDeep',
  borderTone: 'brass',
}

const nextEssay = {
  _type: 'nextEssay',
  _key: 'b-next',
  kicker: '— Vend pladen —',
  heading: mdInline('next-h', 'Lyt videre.'),
  cards: [
    {
      _key: 'n1',
      _type: 'nextCard',
      roman: 'I',
      tag: 'Side A · lyden',
      cardHeading: 'Musikeren',
      cta: 'Hør studiet',
      href: '/musikeren',
      colorScheme: 'barn',
    },
    {
      _key: 'n2',
      _type: 'nextCard',
      roman: 'III',
      tag: 'Side C · nationen',
      cardHeading: 'Cash og Amerika',
      cta: 'Hør republikken',
      href: '/cash-og-amerika',
      colorScheme: 'brass',
    },
  ],
}

const doc = {
  _id: 'page-cash-og-jesus',
  _type: 'page',
  title: 'Cash og Jesus',
  slug: { _type: 'slug', current: 'cash-og-jesus' },
  accentColor: 'denim',
  blocks: [hymnHero, scriptureStrip, stations, hymnal, pullQuote, nextEssay],
  seo: {
    title: 'Cash og Jesus — Johnny Cash',
    description:
      'En faldet mands tro: fra moderens salmer i Dyess, Arkansas, til en sidste hvisken om en personlig Jesus. Seks stationer, en salmebog og troen som rygrad i sort.',
  },
}

async function main() {
  await client.createOrReplace(doc)
  console.log(`Seeded page document: ${doc._id} (/${doc.slug.current})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
