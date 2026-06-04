// One-shot seed script for the Cash og Amerika essay (`page` document, Step 7b Plan 2b).
// Run with: pnpm sanity exec scripts/seed-cash-og-amerika.mjs --with-user-token
//
// Authors the six blocks (flagHero · statsBar · themes · locationGrid ·
// pullQuote · nextEssay) verbatim from claude-design-template/Cash og Amerika.html.
// This is the project's first image upload: the flag background goes through the
// Sanity asset pipeline (best-practices §7). Non-draft _id → published directly;
// createOrReplace keeps re-runs idempotent (Sanity dedupes the asset by hash).

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-05-01' })

// --- Portable Text helpers (mirrors scripts/seed-cash-og-jesus.mjs) ----------
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
const wiki = (p) => `https://en.wikipedia.org/wiki/${p}`

// --- Block builders (flagHero assembled in main() after the image upload) -----
const statsBar = {
  _type: 'statsBar',
  _key: 'b-stats',
  cells: [
    { _key: 'sc1', _type: 'statCell', top: 'Født i', big: 'Arkansas · Delta' },
    { _key: 'sc2', _type: 'statCell', top: 'Sang for', big: 'Native Americans' },
    { _key: 'sc3', _type: 'statCell', top: 'Optog i', big: '2 fængsler · live' },
    { _key: 'sc4', _type: 'statCell', top: 'Spillede for', big: '4 præsidenter' },
    { _key: 'sc5', _type: 'statCell', top: 'Modstod', big: 'Vietnamkrigen' },
  ],
}

const themes = {
  _type: 'themes',
  _key: 'b-themes',
  kicker: '— Fem amerikanske tråde —',
  heading: mdInline('th-h', 'Republikken i fem sange.'),
  deck: [
    mdBlock(
      'th-deck',
      'Cash skrev ikke om *Amerika*. Han skrev om de mennesker, der ikke fik en sang skrevet om sig. Han elskede landet ved at synge om dem det havde svigtet. Det er den mest amerikanske form for patriotisme der findes.',
    ),
  ],
  items: [
    {
      _key: 't1',
      _type: 'themeItem',
      num: 'I',
      when: '— 1932—2003 —',
      title: 'Den arbejdende mand.',
      keys: ['bomuld', 'New Deal', 'jernbaner', 'Arkansas Delta'],
      body: [
        richBlock('t1b1', [
          { t: 'Han voksede op i ' },
          { t: 'Dyess', href: wiki('Dyess,_Arkansas') },
          {
            t: ', en koloni Roosevelt byggede til Sydens fattige. Familien havde fyrre acres, et hus, en gæld og en ko. Det er Sydens grundstof, og det blev hans grundstof: ',
          },
          { t: 'Five Feet High and Rising', em: true },
          { t: ' handler om en oversvømmelse, han faktisk overlevede som syv-årig. ' },
          { t: 'One Piece at a Time', em: true },
          { t: ' handler om en mand, der stjæler en hel Cadillac ud af samlebåndet i Detroit, ét stykke per dag.' },
        ]),
        mdBlock(
          't1b2',
          'Han skrev om jernbanen, fordi han lå ved siden af et togspor om natten. Han skrev om bomuld, fordi han havde plukket den. Han var en arbejder, der lærte at skrive sange — og som derfor aldrig brugte ordet “arbejder” uden at vide hvad det vejer.',
        ),
      ],
      song: {
        _type: 'object',
        label: '— spor C1 · 1976 —',
        title: 'One Piece at a Time',
        href: yt('Johnny+Cash+One+Piece+at+a+Time'),
      },
    },
    {
      _key: 't2',
      _type: 'themeItem',
      num: 'II',
      when: '— 1964 —',
      title: 'De første amerikanere.',
      keys: ['Bitter Tears', 'Ira Hayes', 'Trail of Tears'],
      body: [
        richBlock('t2b1', [
          { t: 'I 1964 udgav Cash ' },
          {
            t: 'Bitter Tears: Ballads of the American Indian',
            em: true,
            href: wiki('Bitter_Tears:_Ballads_of_the_American_Indian'),
          },
          { t: ' — et helt album om amerikanske indianere. Det handler om brudte traktater, om Trail of Tears, og om ' },
          { t: 'Ira Hayes', href: wiki('Ira_Hayes') },
          {
            t: ': en Pima-mand, der rejste flaget på Iwo Jima og siden drak sig ihjel hjemme i Arizona-ørkenen, fordi hans land glemte ham.',
          },
        ]),
        mdBlock(
          't2b2',
          'Country-radioerne nægtede at spille pladen. Han købte en helsides-annonce i *Billboard* og spurgte dem, om de var amerikanere eller bange. Hans svar var, at en patriot ikke kan tie om sit eget folks svigt.',
        ),
      ],
      song: {
        _type: 'object',
        label: '— spor C2 · 1964 —',
        title: 'The Ballad of Ira Hayes',
        href: yt('Johnny+Cash+Ballad+of+Ira+Hayes'),
      },
    },
    {
      _key: 't3',
      _type: 'themeItem',
      num: 'III',
      when: '— 1968—69 —',
      title: 'Manden bag tremmerne.',
      keys: ['Folsom', 'San Quentin', 'retfærdighed', 'nåde'],
      body: [
        richBlock('t3b1', [
          {
            t: 'Han sad aldrig længere end en enkelt nat i fængsel ad gangen. Men han forstod den, der var derinde. Den 13. januar 1968 stillede han sig op i Folsom State Prison og spillede for de mænd, ingen anden ville spille for. Et år senere gjorde han det samme i San Quentin. I publikum sad en ung ',
          },
          { t: 'Merle Haggard', href: wiki('Merle_Haggard') },
          { t: ', der senere skrev sig fri.' },
        ]),
        mdBlock(
          't3b2',
          'Cash er måske den amerikanske kunstner, der har talt mest helhjertet for fængselsreform — og som har stillet sig længst fra magten for at gøre det. Han mente, at en retfærdig republik måles på hvor godt den behandler dem, den har låst inde.',
        ),
      ],
      song: {
        _type: 'object',
        label: '— spor C3 · 1968 —',
        title: 'Folsom Prison Blues (live)',
        href: yt('Johnny+Cash+Folsom+Prison+Blues+live'),
      },
    },
    {
      _key: 't4',
      _type: 'themeItem',
      num: 'IV',
      when: '— 1970 —',
      title: 'I Det Hvide Hus, mod krigen.',
      keys: ['Nixon', 'Vietnam', '“What Is Truth”'],
      body: [
        mdBlock(
          't4b1',
          'Nixon inviterede ham til at synge i Det Hvide Hus 17. april 1970, og bad ham om at spille to højrekomponerede arbejderhits: *Welfare Cadillac* og *Okie from Muskogee*. Cash nægtede. I stedet sang han to af sine egne nye sange: *What Is Truth*, en mild men direkte støtte til de unge mod Vietnam, og *Man in Black*, som han skrev kort efter.',
        ),
        mdBlock(
          't4b2',
          'Han nægtede aldrig at give Nixon hånden. Men han nægtede at lade sig instruere. Det er det amerikanske ved ham: høflig modstand, fra selve podiet.',
        ),
      ],
      song: {
        _type: 'object',
        label: '— spor C4 · 1970 —',
        title: 'What Is Truth',
        href: yt('Johnny+Cash+What+Is+Truth+1970'),
      },
    },
    {
      _key: 't5',
      _type: 'themeItem',
      num: 'V',
      when: '— 1974 —',
      title: 'Det flænsede flag.',
      keys: ['Watergate', 'republikken', 'patriotisme'],
      body: [
        richBlock('t5b1', [
          { t: 'I 1974 — mens Watergate-høringerne kørte og Nixon var på vej ud af huset — udgav Cash et album med titlen ' },
          { t: 'Ragged Old Flag', em: true, href: wiki('Ragged_Old_Flag') },
          {
            t: '. Titelsangen er en lille monolog: en gammel mand fortæller en fremmed, at flaget over rådhuset er flænset, men at det stadig vajer. Hver flænge har en krig at fortælle. Hver plet er en mand der døde for noget.',
          },
        ]),
        mdBlock(
          't5b2',
          'Det er ikke en hyldest til magten — det er en hyldest til republikken, der har overlevet sine ledere. Det er den eneste form for amerikansk patriotisme, der overlever når den faktisk testes.',
        ),
      ],
      song: {
        _type: 'object',
        label: '— spor C5 · 1974 —',
        title: 'Ragged Old Flag',
        href: yt('Johnny+Cash+Ragged+Old+Flag'),
      },
    },
  ],
}

const locationGrid = {
  _type: 'locationGrid',
  _key: 'b-map',
  kicker: '— Et atlas i sange —',
  heading: mdInline('lg-h', 'Hans Amerika, sted for sted.'),
  deck: [
    mdBlock(
      'lg-deck',
      'Cashs sange flytter sig fra Mississippi-deltaet til de californiske fængsler, fra hjemvendte Iwo Jima-soldater til den jernbane der løb forbi hans bagdør. Et lille atlas af de steder, hvor han skrev sin nation.',
    ),
  ],
  cards: [
    {
      _key: 'lc1',
      _type: 'locationCard',
      placeTag: 'Mississippi River · AR',
      name: 'Dyess Colony',
      coords: '35.5870° N · 90.2090° W',
      body: 'Roosevelts New Deal-koloni, hvor Cash voksede op. Bomuld, oversvømmelser, og en mor der sang.',
    },
    {
      _key: 'lc2',
      _type: 'locationCard',
      placeTag: 'Sacramento County · CA',
      name: 'Folsom State Prison',
      coords: '38.6850° N · 121.1641° W',
      body: 'Den 13. januar 1968 stod han på en scene her og indspillede en plade der ændrede karrieren.',
    },
    {
      _key: 'lc3',
      _type: 'locationCard',
      placeTag: 'Pinal County · AZ',
      name: 'Ira Hayes’ grav',
      coords: '33.4322° N · 111.3000° W',
      body: 'Pima-soldaten der rejste flaget på Iwo Jima. Han er begravet på Arlington — Cash sang hans navn levende.',
    },
    {
      _key: 'lc4',
      _type: 'locationCard',
      placeTag: 'Washington D.C.',
      name: 'Det Hvide Hus, East Room',
      coords: '38.8977° N · 77.0365° W',
      body: '17. april 1970. Han sang “What Is Truth” for Nixon — en stilfærdig protest, holdt på podiet selv.',
    },
  ],
}

// `.ragged` band — reuses the shared pullQuote (ink bg, brass borders), §7 N/A.
const pullQuote = {
  _type: 'pullQuote',
  _key: 'b-ragged',
  kicker: '— Det flænsede flag, talt højt —',
  quote: [
    mdBlock('rg1', 'Hun har overlevet meget. Hun har været flænset. Hun har været brændt.'),
    mdBlock('rg2', 'Men hun vajer stadig — over en republik der ikke er færdig med at lave sig selv.'),
  ],
  attribution: ['Parafrase af “Ragged Old Flag”', '1974', 'J. R. Cash'],
  background: 'ink',
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
      roman: 'II',
      tag: 'Side B · troen',
      cardHeading: 'Cash og Jesus',
      cta: 'Hør salmerne',
      href: '/cash-og-jesus',
      colorScheme: 'denim',
    },
  ],
}

async function main() {
  // First image upload in the project (§7). Sanity dedupes by content hash, so
  // re-runs reuse the same asset rather than piling up duplicates.
  const imagePath = join(process.cwd(), 'claude-design-template', 'images', 'cash-stars-and-stripes.jpeg')
  const asset = await client.assets.upload('image', readFileSync(imagePath), {
    filename: 'cash-stars-and-stripes.jpeg',
  })
  console.log(`Uploaded flag image asset: ${asset._id}`)

  const flagHero = {
    _type: 'flagHero',
    _key: 'b-hero',
    eyebrow: 'Side C · The Ragged Old Flag',
    romanNumeral: 'III.',
    headingLead: 'Cash',
    headingAmp: 'og',
    headingGold: 'Amerika.',
    lede: [
      mdBlock(
        'hero-lede',
        'Han syntes om landet nok til at synge om dets fanger, dets indianere, dets soldater og dets toge — uden at gøre sig fin. Cash er Amerika på en god dag og en dårlig: republikken set fra en cellevindue, en kirkebænk og et togvindue mellem Arkansas og Californien.',
      ),
    ],
    metaItems: [
      { _key: 'm1', _type: 'metaItem', label: 'Hør republikken', value: 'nedenunder' },
      { _key: 'm2', _type: 'metaItem', label: 'Læsetid', value: '~ 11 min.' },
      { _key: 'm3', _type: 'metaItem', label: '7 spor i pladespilleren' },
    ],
    backgroundImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
      alt: 'Falmet amerikansk flag',
    },
    telegram: {
      _type: 'object',
      headLeft: 'Western Union',
      headTitle: 'RAGGED OLD FLAG',
      headYear: '1974',
      lines: [
        'TIL DEM DER MENER LANDET ER FÆRDIGT',
        'FLAGET ER FLÆNSET MEN DET ER STADIG VORES',
        'JEG SKAMMER MIG IKKE OVER DET',
        'EN DAG VIL VI LAPPE DET OG HÆNGE DET OP IGEN',
      ],
      sig: '— J. R. Cash',
      postmarkTop: 'US',
      postmarkMid: 'Mail',
      postmarkBottom: '1974',
    },
  }

  const doc = {
    _id: 'page-cash-og-amerika',
    _type: 'page',
    title: 'Cash og Amerika',
    slug: { _type: 'slug', current: 'cash-og-amerika' },
    accentColor: 'brass',
    blocks: [flagHero, statsBar, themes, locationGrid, pullQuote, nextEssay],
    seo: {
      title: 'Cash og Amerika — Johnny Cash',
      description:
        'Cash er Amerika på en god dag og en dårlig: republikken set fra en cellevindue, en kirkebænk og et togvindue. Fem sange, et atlas af steder, og et flænset flag der stadig vajer.',
    },
  }

  await client.createOrReplace(doc)
  console.log(`Seeded page document: ${doc._id} (/${doc.slug.current})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
