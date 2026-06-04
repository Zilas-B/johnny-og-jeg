// One-shot seed script for the Musikeren essay (`page` document, Step 7b Plan 1).
// Run with: pnpm sanity exec scripts/seed-musikeren.mjs --with-user-token
//
// Authors the five blocks (vinylHero · steppedList · cardGrid · pullQuote ·
// nextEssay) verbatim from claude-design-template/Musikeren.html. Non-draft _id
// → published directly; createOrReplace keeps re-runs idempotent.

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-05-01' })

// --- Portable Text helpers (mirrors scripts/seed-landscapes.mjs) -------------
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

// --- Block builders ----------------------------------------------------------
const vinylHero = {
  _type: 'vinylHero',
  _key: 'b-hero',
  eyebrow: 'Side A · 33⅓ RPM',
  romanNumeral: 'I.',
  heading: mdInline('hero-h', '*Musik*eren.'),
  lede: [
    mdBlock(
      'hero-lede',
      'Boom-chicka-boom. Den rytme begyndte i en defekt bas, blev til en lyd, og endte med at flytte fyrre års amerikansk musik. Cash stillede sig op med en akustisk guitar, en kontrabas og en trommeløs trio — og opfandt et sound der lød som en jernbane, der kom over præriet.',
    ),
  ],
  metaItems: [
    { _key: 'm1', _type: 'object', label: 'Hør med', value: 'nedenunder' },
    { _key: 'm2', _type: 'object', label: 'Læsetid', value: '~ 9 min.' },
    { _key: 'm3', _type: 'object', label: '5 spor i pladespilleren' },
  ],
  vinylTop: '— Sun Records —',
  vinylTitle: 'Musikeren',
  vinylBottom: 'Memphis · TN',
  tickerItems: [
    'BOOM-CHICKA-BOOM',
    'LUTHER PERKINS · GUITAR',
    'MARSHALL GRANT · BASS',
    'W. S. HOLLAND · DRUMS',
    'BOB JOHNSTON · PRODUCER',
    'RICK RUBIN · 1993',
    'SAM PHILLIPS · SUN',
  ],
}

const steppedList = {
  _type: 'steppedList',
  _key: 'b-eras',
  kicker: '— Fire epoker, én stemme —',
  heading: mdInline('eras-h', 'Karrieren i fire plader.'),
  deck: [
    mdBlock(
      'eras-deck',
      'Cash spillede ikke én genre — han gik gennem fire. Hver epoke har sit eget studie, sin egen producent og sin egen lydtekstur. Læg pladen på nedenunder, og læs videre.',
    ),
  ],
  items: [
    {
      _key: 'e1',
      _type: 'eraItem',
      years: '1955—58',
      label: 'Sun Records, Memphis',
      tag: [
        { _key: 'e1t1', _type: 'object', label: 'Producer ·', value: 'Sam Phillips' },
        { _key: 'e1t2', _type: 'object', label: 'Lyden ·', value: 'rockabilly · gospel · rå' },
      ],
      body: [
        richBlock('e1b1', [
          {
            t: 'Han gik ind hos Sam Phillips med en gospel-prøveoptagelse og fik at vide, at gospel var død. Et år senere stod han ved siden af Elvis, Jerry Lee Lewis og Carl Perkins som Sun’s fjerde stjerne. Phillips lærte ham at indspille hurtigt, billigt og småt — én mikrofon, ingen efterproduktion. Det er ',
          },
          { t: 'Sun-årene', href: 'https://en.wikipedia.org/wiki/Sun_Records' },
          {
            t: ' der opfinder boom-chicka-boom: Luther Perkins anslag på guitaren, en kontrabas, og et stykke papir stukket ind under bas-strengene for at få den til at klikke.',
          },
        ]),
        richBlock('e1b2', [
          { t: 'I Walk the Line', em: true },
          {
            t: ' blev skrevet som et løfte til hans første kone og spillet ind i én takt — den modulerer fem gange ned i fem vers. Det er en form, ingen i Nashville ville have vovet. Phillips holdt fanen højt.',
          },
        ]),
      ],
      cuts: [
        {
          _key: 'e1c1',
          _type: 'cutItem',
          cutLabel: 'Single · Sun 241',
          cutTitle: 'I Walk the Line',
          cutDuration: '1956 · 2:45',
          cutHref: 'https://www.youtube.com/results?search_query=Johnny+Cash+I+Walk+the+Line+1956',
        },
        {
          _key: 'e1c2',
          _type: 'cutItem',
          cutLabel: 'Single · Sun 232',
          cutTitle: 'Folsom Prison Blues',
          cutDuration: '1955 · 2:42',
          cutHref: 'https://www.youtube.com/results?search_query=Johnny+Cash+Folsom+Prison+Blues+1955',
        },
        {
          _key: 'e1c3',
          _type: 'cutItem',
          cutLabel: 'Debut single',
          cutTitle: 'Cry! Cry! Cry!',
          cutDuration: '1955 · 2:25',
          cutHref: 'https://www.youtube.com/results?search_query=Johnny+Cash+Cry+Cry+Cry',
        },
      ],
    },
    {
      _key: 'e2',
      _type: 'eraItem',
      years: '1958—68',
      label: 'Columbia & konceptet',
      tag: [
        { _key: 'e2t1', _type: 'object', label: 'Producere ·', value: 'Don Law · Bob Johnston' },
        { _key: 'e2t2', _type: 'object', label: 'Lyden ·', value: 'cinematisk · ambitiøs' },
      ],
      body: [
        richBlock('e2b1', [
          { t: 'Cash skiftede til Columbia og opdagede pladen som et hele. ' },
          { t: 'Ride This Train', em: true },
          { t: ' (1960) var en konceptplade om amerikansk arbejde, lyttetænkt som en rejse. ' },
          { t: 'Blood, Sweat and Tears', em: true },
          { t: ' (1963) handlede om manuelt arbejde. ' },
          { t: 'Bitter Tears', em: true },
          {
            t: ' (1964) handlede om de oprindelige amerikanere — og blev forbudt på country-radioen. Han betalte en helsides-annonce i ',
          },
          { t: 'Billboard', em: true },
          { t: ' for at råbe ad dem.' },
        ]),
        richBlock('e2b2', [
          {
            t: 'Bob Johnston, som også producerede Bob Dylan, blev hans makker. Det er Johnston, der lærer ham, at en plade kan bære en holdning. Det er også Johnston, der får ham ind i Folsom State Prison.',
          },
        ]),
      ],
      cuts: [
        {
          _key: 'e2c1',
          _type: 'cutItem',
          cutLabel: 'Single · Columbia',
          cutTitle: 'Ring of Fire',
          cutDuration: '1963 · 2:37',
          cutHref: 'https://www.youtube.com/results?search_query=Johnny+Cash+Ring+of+Fire+1963',
        },
        {
          _key: 'e2c2',
          _type: 'cutItem',
          cutLabel: 'Bitter Tears',
          cutTitle: 'Ballad of Ira Hayes',
          cutDuration: '1964 · 4:08',
          cutHref: 'https://www.youtube.com/results?search_query=Johnny+Cash+Ballad+of+Ira+Hayes',
        },
        {
          _key: 'e2c3',
          _type: 'cutItem',
          cutLabel: 'Concept · Columbia',
          cutTitle: 'Big River',
          cutDuration: '1958 · 2:31',
          cutHref: 'https://www.youtube.com/results?search_query=Johnny+Cash+Big+River',
        },
      ],
    },
    {
      _key: 'e3',
      _type: 'eraItem',
      years: '1968—86',
      label: 'Live & legenden',
      tag: [
        { _key: 'e3t1', _type: 'object', label: 'Producere ·', value: 'Bob Johnston · Larry Butler' },
        { _key: 'e3t2', _type: 'object', label: 'Lyden ·', value: 'fængsler · TV · Highwaymen' },
      ],
      body: [
        richBlock('e3b1', [
          { t: 'Den 13. januar 1968 stod han på en scene i ' },
          { t: 'Folsom State Prison', href: 'https://en.wikipedia.org/wiki/At_Folsom_Prison' },
          {
            t: '. Det resulterende live-album blev et fænomen — og en blueprint for det 70’erne kaldte “outlaw country”. Han fik sit eget tv-show på ABC fra 1969 til 1971, med Dylan, Mitchell og Marley som gæster. I 1985 dannede han, sammen med Willie Nelson, Waylon Jennings og Kris Kristofferson, ',
          },
          {
            t: 'The Highwaymen',
            href: 'https://en.wikipedia.org/wiki/The_Highwaymen_(country_supergroup)',
          },
          { t: ': en supergruppe af outlaws, der nægtede at gå i pension.' },
        ]),
      ],
      cuts: [
        {
          _key: 'e3c1',
          _type: 'cutItem',
          cutLabel: 'At San Quentin',
          cutTitle: 'A Boy Named Sue',
          cutDuration: '1969 · 3:46',
          cutHref: 'https://www.youtube.com/results?search_query=Johnny+Cash+A+Boy+Named+Sue+San+Quentin',
        },
        {
          _key: 'e3c2',
          _type: 'cutItem',
          cutLabel: 'Manifest · 1971',
          cutTitle: 'Man in Black',
          cutDuration: '1971 · 2:52',
          cutHref: 'https://www.youtube.com/results?search_query=Johnny+Cash+Man+in+Black+1971',
        },
        {
          _key: 'e3c3',
          _type: 'cutItem',
          cutLabel: 'Highwaymen',
          cutTitle: 'Highwayman',
          cutDuration: '1985 · 3:03',
          cutHref: 'https://www.youtube.com/results?search_query=Highwaymen+1985+Johnny+Cash',
        },
      ],
    },
    {
      _key: 'e4',
      _type: 'eraItem',
      years: '1994—03',
      label: 'American Recordings',
      tag: [
        { _key: 'e4t1', _type: 'object', label: 'Producer ·', value: 'Rick Rubin' },
        { _key: 'e4t2', _type: 'object', label: 'Lyden ·', value: 'guitar & stemme · død' },
      ],
      body: [
        richBlock('e4b1', [
          { t: 'Country-radioen havde glemt ham. Så ringede en ung rap- og rock-producer ved navn ' },
          { t: 'Rick Rubin', href: 'https://en.wikipedia.org/wiki/Rick_Rubin' },
          {
            t: ' og inviterede ham hjem i sin stue i Hollywood Hills. Cash sad ned med sin guitar, og Rubin optog ham. Det blev til seks albummer, fire i hans levetid og to posthumt. Den tredje, ',
          },
          { t: 'Solitary Man', em: true },
          { t: ', og den fjerde, ' },
          { t: 'The Man Comes Around', em: true },
          {
            t: ', indeholdt fortolkninger af Depeche Mode, U2, Soundgarden og Nine Inch Nails — og forvandlede dem alle til Cash-sange.',
          },
        ]),
        richBlock('e4b2', [
          { t: 'Hans version af ' },
          { t: 'Hurt', em: true },
          {
            t: ' blev hans afsked. Trent Reznor, der skrev den, sagde bagefter at sangen ikke længere tilhørte ham — den tilhørte Cash. Musikvideoen, lavet to måneder før hans død, er stadig det mest gennemtænkte farvel i amerikansk musikhistorie.',
          },
        ]),
      ],
      cuts: [
        {
          _key: 'e4c1',
          _type: 'cutItem',
          cutLabel: 'American IV',
          cutTitle: 'Hurt',
          cutDuration: '2002 · 3:38',
          cutHref: 'https://www.youtube.com/results?search_query=Johnny+Cash+Hurt+2002',
        },
        {
          _key: 'e4c2',
          _type: 'cutItem',
          cutLabel: 'American IV',
          cutTitle: 'The Man Comes Around',
          cutDuration: '2002 · 4:26',
          cutHref: 'https://www.youtube.com/results?search_query=Johnny+Cash+The+Man+Comes+Around',
        },
        {
          _key: 'e4c3',
          _type: 'cutItem',
          cutLabel: 'American IV',
          cutTitle: 'Personal Jesus',
          cutDuration: '2002 · 3:21',
          cutHref: 'https://www.youtube.com/results?search_query=Johnny+Cash+Personal+Jesus',
        },
      ],
    },
  ],
}

const cardGrid = {
  _type: 'cardGrid',
  _key: 'b-anatomy',
  kicker: '— Anatomien af et sound —',
  heading: mdInline('ana-h', 'Hvordan boom-chicka-boom blev til.'),
  deck: [
    mdBlock(
      'ana-deck',
      'Fire elementer, en sang. Det er ikke kompliceret — det er bare aldrig gjort før. Læg næste spor i pladespilleren og hør efter:',
    ),
  ],
  cards: [
    {
      _key: 'a1',
      _type: 'gridCard',
      roman: 'I',
      tag: '— guitaren —',
      cardHeading: 'Luther Perkins’ enkelthed',
      cardBody: [
        mdBlock(
          'a1b',
          'Han kunne ikke spille hurtigt. Det var pointen. Tre toner, en pause, tre toner. Det blev kaldt “the boom”.',
        ),
      ],
    },
    {
      _key: 'a2',
      _type: 'gridCard',
      roman: 'II',
      tag: '— bassen —',
      cardHeading: 'Marshall Grants papir',
      cardBody: [
        mdBlock(
          'a2b',
          'Han stak et papir under bas-strengene for at få et “klik” — den manglende lilletromme. Det blev kaldt “the chicka”.',
        ),
      ],
    },
    {
      _key: 'a3',
      _type: 'gridCard',
      roman: 'III',
      tag: '— stemmen —',
      cardHeading: 'Cashs baryton',
      cardBody: [
        mdBlock(
          'a3b',
          'En halv oktav lavere end alle andre. Han lavede aldrig pyntede toner. Han talte sangene mere end han sang dem.',
        ),
      ],
    },
    {
      _key: 'a4',
      _type: 'gridCard',
      roman: 'IV',
      tag: '— togene —',
      cardHeading: 'Jernbanens rytme',
      cardBody: [
        mdBlock(
          'a4b',
          'Han voksede op femten meter fra et togspor. Det er ikke en metafor — det er kilometeret per minut, han bygger sangene på.',
        ),
      ],
    },
  ],
}

const pullQuote = {
  _type: 'pullQuote',
  _key: 'b-lyric',
  kicker: '— Et hørestykke —',
  quote: [
    mdBlock('q1', 'I hear that *train a-comin’* — it’s rollin’ round the bend.'),
    mdBlock('q2', 'And I ain’t seen the sunshine since I don’t know when.'),
  ],
  attribution: ['Folsom Prison Blues', '1955', 'skrevet i Tyskland, sunget i Californien'],
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
      roman: 'II',
      tag: 'Side B · troen',
      cardHeading: 'Cash og Jesus',
      cta: 'Hør salmerne',
      href: '/cash-og-jesus',
      colorScheme: 'denim',
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
  _id: 'page-musikeren',
  _type: 'page',
  title: 'Musikeren',
  slug: { _type: 'slug', current: 'musikeren' },
  accentColor: 'barn',
  blocks: [vinylHero, steppedList, cardGrid, pullQuote, nextEssay],
  seo: {
    title: 'Musikeren — Johnny Cash',
    description:
      'Boom-chicka-boom: hvordan Johnny Cash opfandt et sound og flyttede fyrre års amerikansk musik — fra Sun Records til American Recordings.',
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
