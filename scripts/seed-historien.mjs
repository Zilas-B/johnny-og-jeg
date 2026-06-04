// One-shot seed for the Historien page (`historienPage` singleton, Step 7c).
// Run with: pnpm sanity exec scripts/seed-historien.mjs --with-user-token
//
// Authors the hero + six era sections + outro verbatim from
// claude-design-template/Historien.html, uploading the seven era photos through
// the Sanity asset pipeline (best-practices §7). _id 'historienPage' (non-draft)
// → published directly; createOrReplace keeps re-runs idempotent (Sanity dedupes
// each asset by content hash).

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-05-01' })

// --- Portable Text helpers (mirror scripts/seed-cash-og-amerika.mjs) ----------
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
// Multi-paragraph prose array from a list of markup strings.
function mdProse(prefix, paragraphs) {
  return paragraphs.map((text, i) => mdBlock(`${prefix}-${i}`, text))
}

// --- Image upload -------------------------------------------------------------
async function uploadImage(filename) {
  const path = join(process.cwd(), 'claude-design-template', 'assets', filename)
  const asset = await client.assets.upload('image', readFileSync(path), { filename })
  console.log(`Uploaded ${filename}: ${asset._id}`)
  return asset._id
}
function imageObj(assetId, alt, shape) {
  const obj = { _type: 'image', asset: { _type: 'reference', _ref: assetId }, alt }
  if (shape) obj.shape = shape
  return obj
}

// --- Era content (verbatim from Historien.html) -------------------------------
const ERAS = [
  {
    key: 'e1',
    romanNumeral: 'I',
    period: '1776 — 1830',
    navName: 'Den unge republik',
    timelineName: 'Den unge republik',
    heading: 'Den unge *republik*.',
    deck: 'Et land, der blev til på papir — og prøvede at leve sig op til det.',
    body: [
      'Da delegationerne forsamlede sig i Philadelphia i juli 1776, var der ingen, der vidste om eksperimentet ville holde et årti. Tretten kolonier, fire millioner mennesker, en ny verden, en gammel kong George — og en erklæring om at **alle mennesker er skabt lige**, skrevet af en mand, der ejede slaver.',
      'Forfatningen kom elleve år senere, i 1787 — et kompromis sammensyet af gæld, geografi og generationsmod. Washington trådte ind som første præsident i 1789, Jefferson købte Louisiana i 1803, Madison stred sig gennem 1812-krigen, og i 1820’erne begyndte de første spændinger om slaveriet at vise sig som revner i et stadig nyt gulv. Republikken var **skabt af det sublime, men holdt sammen af det praktiske**.',
    ],
    image: { file: 'era-1-we-the-people.png', alt: '“We the People” — Forfatningen mod stars and stripes', shape: 'wide' },
    creditLeft: 'Forfatningens fortale, 1787',
    creditRight: 'Public domain',
    cashnote: {
      label: '— Cash om denne tid —',
      heading: 'Et tomt sted i pladekataloget.',
      song: '**Cash skrev ikke om stiftelsen.** Hans Amerika begynder længere nede.',
      body: [
        'Han greb ikke tilbage til Founding Fathers. Cash var bjerg, ikke marmor — sangenes Amerika begynder med bomuldsmarken, ikke med blæk på pergament. Men idéen om at en republik må forsvare sit eget løfte mod sig selv — den findes overalt i hans senere sange.',
      ],
    },
    posts: [
      'Jefferson, slaveriet og den selvindlysende sandhed',
      'Louisianakøbet — da Amerika fordobledes på et papir',
    ],
  },
  {
    key: 'e2',
    romanNumeral: 'II',
    period: '1830 — 1870',
    navName: 'Kløften og krigen',
    timelineName: 'Kløften & krigen',
    heading: 'Kløften, og *krigen*.',
    deck: 'Et land, der ikke kunne tale sig ud af sin egen synd — og betalte for den med sin egen ungdoms blod.',
    body: [
      '1830’erne åbnede med Indian Removal Act, Jackson på podiet og bomuld som ny konges kappe over Syden. Abolitionister i Boston, opstande i Virginia, Underground Railroad gennem skovene. Hver kompromis — Missouri 1820, Compromise 1850, Kansas-Nebraska 1854 — flyttede bare den uundgåelige time længere ned ad vejen.',
      '**Borgerkrigen 1861-65 kostede 750.000 mænd**. Lincoln blev mere end en præsident — han blev en epoke. Gettysburg-talen tog republikkens løfte og gjorde det moralsk igen: *that this nation, under God, shall have a new birth of freedom*. Han nåede ikke at se Reconstruction. Den sluttede dårligt; vi lever stadig i dens efterklang.',
    ],
    image: { file: 'era-2-lincoln.png', alt: 'Abraham Lincoln, ca. 1864', shape: 'tall' },
    creditLeft: 'Abraham Lincoln, ca. 1864',
    creditRight: 'Library of Congress',
    cashnote: {
      label: '— Cash om denne tid —',
      heading: '“God Bless Robert E. Lee” & “John Henry” — fra to sider af en kløft.',
      song: '**“God Bless Robert E. Lee”** · 1983 · **“The Legend of John Henry’s Hammer”** · 1962',
      body: [
        'Cash holdt aldrig op med at synge om Syden, og han holdt aldrig op med at synge om dem, Syden tabte. John Henry-balladen er sangen om den frigjorte slave, der kæmpede mod maskinen og vandt — og døde. Robert E. Lee-sangen er ærligheden om hvor han kom fra. Det er ikke samme ærinde, men det er samme mand.',
      ],
    },
    posts: [
      'Gettysburg-talen, læst i Aarhus',
      'Hvorfor Reconstruction mislykkedes — og hvad vi arvede',
    ],
  },
  {
    key: 'e3',
    romanNumeral: 'III',
    period: '1870 — 1914',
    navName: 'Damp, stål og strejker',
    timelineName: 'Damp, stål, strejker',
    heading: 'Damp, stål *og strejker*.',
    deck: 'Den industrielle revolution kom som en jernbane — og kørte tværs over alt, hvad Amerika havde været.',
    body: [
      'På fire årtier omskabte jernbanen, telegrafen og fabrikken landet. Carnegie smedede stål, Rockefeller raffinerede olie, Vanderbilt byggede skinner — og dagen, hvor det første tog krydsede kontinentet (Promontory Summit, 1869), kortsluttede en hel epoke. Indianerkrigene endte ved Wounded Knee i 1890. Skellet mellem rige og fattige blev så voldsomt, at Mark Twain gav årtiet et navn: *The Gilded Age*.',
      'Det var også fagforeningernes første store opvågnen: **Haymarket 1886, Pullman 1894, Triangle Shirtwaist 1911**. Avisen ovenfor — Seattle, februar 1919 — er en efterskrift, men også arvtager. Det moderne Amerika begynder her, ikke i 1776.',
    ],
    image: { file: 'era-3-newspaper.png', alt: '“Strike Called — All Unions To Go Out” · Seattle Union Record, 1919', shape: 'wide' },
    creditLeft: 'Avisforside, Seattle Union Record · 1919',
    creditRight: 'Public domain',
    cashnote: {
      label: '— Cash om denne tid —',
      heading: '“The Legend of John Henry’s Hammer” & “The L & N Don’t Stop Here Anymore”.',
      song: '**John Henry** · 1962 · **The L & N Don’t Stop Here Anymore** · 1972',
      body: [
        'Hammer mod damp; arbejderen mod maskinen. Cash’s John Henry er den enkelte mand mod hele den industrielle alder — og han vinder, og taber. “The L&N” er den anden ende af samme jernbane: byen, hvor toget ikke længere standser. To sange, halvtreds år imellem, men samme tematik: den lille mand klemt mellem skinner og kvartalsregnskab.',
      ],
    },
    posts: [
      'Wounded Knee 1890 — og hvad Cash gjorde 75 år senere',
      'Mark Twain & The Gilded Age — en ironisk diagnose',
    ],
  },
  {
    key: 'e4',
    romanNumeral: 'IV',
    period: '1914 — 1945',
    navName: 'Verdenskrig & depression',
    timelineName: 'Krig & depression',
    heading: 'Verdenskrig & *depression*.',
    deck: 'Et halvt århundrede på tredive år. To verdenskrige med en støvbølge imellem.',
    body: [
      'USA gik ind i den første krig i 1917 — sent, men afgørende. Wilson håbede at gøre verden “safe for democracy” og kom hjem til en kongres, der ikke ville ratificere fredspagten. **1920’ernes Jazz Age** sluttede med **Wall Street-krakket i oktober 1929**. Dust Bowl tørrede Sydens og Midtvestens marker ud; Dorothea Langes *Migrant Mother* blev epokens ansigt. Roosevelt kom i 1933 med New Deal, og i Dyess, Arkansas, blev en lille bomuldsbonde ved navn Ray Cash tildelt en 40-acres koloni — og fik en søn, der hed J.R.',
      'Anden Verdenskrig ramte den 7. december 1941. Fire års amerikansk industri på krigsfod producerede flere fly, skibe og jeeps end resten af verden tilsammen. Joe Rosenthals foto fra Iwo Jima i februar 1945 blev republikkens nye selvbillede — fem marinesoldater og en sygehjælper, der rejser et flag på et bjerg, som lige har kostet 7.000 amerikanske liv.',
    ],
    image: { file: 'era-4-migrant-mother.png', alt: 'Migrant Mother · Dorothea Lange, 1936' },
    imageCollage: { file: 'era-4-iwo-jima.png', alt: 'Raising the Flag on Iwo Jima · Joe Rosenthal, 1945' },
    creditLeft: 'Lange · 1936',
    creditRight: 'Rosenthal · 1945',
    cashnote: {
      label: '— Cash om denne tid —',
      heading: '“Five Feet High and Rising” & “The Ballad of Ira Hayes”.',
      song: '**Five Feet High and Rising** · 1959 · **The Ballad of Ira Hayes** · 1964',
      body: [
        'Cash sang om Dyess-oversvømmelsen i 1937 — sin egen barndoms vand. Og han sang om Ira Hayes, Pima-indianeren, der hjalp med at rejse flaget på Iwo Jima og kom hjem til et land, der ikke kunne huske ham. To sange fra denne periode, set indefra. *“Whiskey-drinkin’ Indian, Marine that went to war,”* synger Cash. Det er ikke patriotisme. Det er regnskab.',
      ],
    },
    posts: [
      'Dyess Colony og New Deal — hvor Cash kom fra',
      'Iwo Jima og Ira Hayes — flaget der løftede sig to gange',
    ],
  },
  {
    key: 'e5',
    romanNumeral: 'V',
    period: '1945 — 1989',
    navName: 'Det amerikanske århundrede',
    timelineName: 'Det amerikanske århundrede',
    heading: 'Det amerikanske *århundrede*.',
    deck: 'Den længste fest og den hårdeste kamp om sjælen — alt på samme gade.',
    body: [
      'Krigen sluttede. Bilen kom. Forstadsstrukturen voksede. Levittown blev tegnet, jernbanen blev erstattet af motorvejen, og Eisenhower-årenes *Pax Americana* så fra afstand ud som en sejr. Tæt på var det noget andet: **McCarthy-tribunalerne, Korea, Vietnam**, mordet på Kennedy i 1963, Selma og Civil Rights Act i 1964, Watergate i 1974, hvor en præsident trådte tilbage før han blev fjernet.',
      'Reagan kom i 1981 og fortalte et land, der havde mistet selvtilliden, at *“morning in America”* var lige om hjørnet. Han skar i skatten, byggede missilarsenaler, talte med Gorbatjov, og hans tid blev senere både kanoniseret og kritiseret. Den endte symbolsk i november 1989, da Berlin-muren faldt — og USA var det eneste, der stod tilbage.',
    ],
    image: { file: 'era-5-reagan.png', alt: 'Ronald Reagan, officielt portræt, 1981', shape: 'tall' },
    creditLeft: 'Ronald Reagan, præsidentielt portræt · 1981',
    creditRight: 'White House Photo',
    cashnote: {
      label: '— Cash om denne tid —',
      heading: '“Man in Black” & “Ragged Old Flag”.',
      song: '**Man in Black** · 1971 · **Ragged Old Flag** · 1974 · **Highwayman** · 1985',
      body: [
        'Cash blev manden i sort “for the poor and the beaten down” i 1971 — midt under Vietnam. Tre år senere, året Nixon trådte tilbage, udgav han “Ragged Old Flag” — ikke som propaganda, men som lap-på-lap-poesi om en republik, der har overlevet sin egen ydmygelse. Og i 1985 dannede han *Highwaymen* med Willie, Waylon og Kristofferson: outlaw-country som modtræk til Reagans glansbillede.',
      ],
    },
    posts: [
      'Cash i Det Hvide Hus, 1970 — sangen Nixon ikke fik',
      'Watergate, Reagan og republikkens selvbillede',
    ],
  },
  {
    key: 'e6',
    romanNumeral: 'VI',
    period: '1989 — nutid',
    navName: 'Republikken i dag',
    timelineName: 'Republikken i dag',
    heading: 'Republikken *i dag*.',
    deck: 'Den eneste supermagt — og den dybeste tvivl. Vi lever stadig inde i denne akt.',
    body: [
      'Den korte 1990’er-eufori — Clintons år, internettet, balancerede budgetter — endte i røg den 11. september 2001. **Krigene i Afghanistan og Irak**. Finanskrisen i 2008. Den første sorte præsident, valgt på et løfte om “hope”, fulgt af et land, der valgte næsten det modsatte i 2016. Pandemi. Storming af Kongressen den 6. januar 2021. Og videre.',
      'Det er en epoke uden tydeligt navn endnu. Det er måske *det sene Amerika*, eller måske bare det Amerika, hvor splittelsen blev synlig nok til at man ikke længere kunne lade som om den ikke var der. Hvad det vil ende i, ved ingen — men det er værd at huske at republikken er ældre end de fleste, og dens vante manøvre er at fejle sig selv frem.',
    ],
    image: { file: 'era-6-stars-and-stripes.png', alt: 'Stars and Stripes — bølgende flag, samtid', shape: 'wide' },
    creditLeft: 'Stars & Stripes',
    creditRight: 'samtid',
    cashnote: {
      label: '— Cash om denne tid —',
      heading: '“Hurt” & “The Man Comes Around”.',
      song: '**The Man Comes Around** · 2002 · **Hurt** (Nine Inch Nails-cover) · 2002',
      body: [
        'Cash’s sidste album udkom i et land der lige havde mistet sin uskyld igen. *“There’s a man going around, taking names...”* — Johannes Åbenbaring sat til guitar, en uge før Irak-krigen. Og *“Hurt”*: et helt liv pakket ind i fire minutter, og hans egen krop som republikkens spejlbillede. Han døde i 2003. Vi lever stadig i hans efterskrift.',
      ],
    },
    posts: [
      '11. september og Cash’s “The Man Comes Around”',
      'Hvad “Hurt” fortæller om det sene Amerika',
    ],
  },
]

function buildEra(era, imageId, collageId) {
  return {
    _type: 'historienEra',
    _key: era.key,
    romanNumeral: era.romanNumeral,
    period: era.period,
    navName: era.navName,
    timelineName: era.timelineName,
    heading: mdInline(`${era.key}-h`, era.heading),
    deck: era.deck,
    body: mdProse(`${era.key}-b`, era.body),
    image: imageObj(imageId, era.image.alt, era.image.shape),
    ...(collageId ? { imageCollage: imageObj(collageId, era.imageCollage.alt) } : {}),
    creditLeft: era.creditLeft,
    creditRight: era.creditRight,
    cashnote: {
      label: era.cashnote.label,
      heading: era.cashnote.heading,
      song: mdInline(`${era.key}-song`, era.cashnote.song),
      body: mdProse(`${era.key}-cn`, era.cashnote.body),
    },
    posts: era.posts.map((title, i) => ({
      _key: `${era.key}-p${i}`,
      _type: 'object',
      kind: '— Indlæg · Kommer —',
      title,
      date: 'Skitse · 2026',
      href: '#',
      empty: true,
    })),
  }
}

const hero = {
  eyebrow: 'USA · Historien · Anno 1776 — nutid',
  title: 'Historien',
  titleSub: 'en republik i seks akter',
  deck: mdProse('hero-deck', [
    'Amerika er ikke et land — det er en *strid* om, hvad et land kan være. Her er et forsøg på at fortælle den strid i seks epoker: fra de uafhængige koloniers oprør, gennem borgerkrigens åbne sår, ind i den industrielle hvirvelvind, ud over Atlanten og hjem igen, ned i Den Kolde Krigs skygge, og frem til vores egen tid.',
    'Hver epoke har sit eget billede — og sin egen Cash-sang, hvis han skrev en. Stridens lyd, fra det syngende sydstats-bælte.',
  ]),
  sideLabel: '— Bladre i —',
  sideHeading: 'Seks epoker.',
}

const outro = {
  kicker: '— Hvor man kan læse videre —',
  heading: mdInline('outro-h', 'Seks epoker. *Én* samtale, der ikke slutter.'),
  body: mdProse('outro-b', [
    'Denne side er ikke historieskrivning. Den er en lytters notesbog — en, der prøver at høre Amerika gennem Cash, og Cash gennem Amerika. Hvis noget her får dig til at læse videre eller skrive til mig, har den gjort sit job.',
    'For dem, der vil dybere ned i de seks epoker, har jeg samlet en læseliste — tre bøger jeg har læst og kan stå inde for, og en længere hylde med titler på vej.',
  ]),
  actions: [
    { _key: 'a1', _type: 'object', text: 'Til læselisten →', href: '/boeger-spil-film', style: 'primary' },
    { _key: 'a2', _type: 'object', text: 'Hør foredraget', href: '/foredrag', style: 'secondary' },
  ],
  cardHeading: 'Hvor Cash møder historien.',
  cardItems: [
    { text: '**Five Feet High and Rising** — depressionens vand', year: '1959' },
    { text: '**The Ballad of Ira Hayes** — Iwo Jima og hjemkomsten', year: '1964' },
    { text: '**Folsom Prison Blues** — Vietnam-årets fængsel', year: '1968' },
    { text: '**Man in Black** — sort for de glemte', year: '1971' },
    { text: '**Ragged Old Flag** — Watergate-årets epitaf', year: '1974' },
    { text: '**Highwayman** — Reagan-årenes outlaw', year: '1985' },
    { text: '**The Man Comes Around** — Åbenbaringen', year: '2002' },
  ].map((item, i) => ({
    _key: `ci${i}`,
    _type: 'object',
    text: mdInline(`ci${i}`, item.text),
    year: item.year,
  })),
}

async function main() {
  const eras = []
  for (const era of ERAS) {
    const imageId = await uploadImage(era.image.file)
    const collageId = era.imageCollage ? await uploadImage(era.imageCollage.file) : null
    eras.push(buildEra(era, imageId, collageId))
  }

  const doc = {
    _id: 'historienPage',
    _type: 'historienPage',
    hero,
    eras,
    outro,
    seo: {
      title: 'Historien — USA · Johnny og jeg',
      description:
        'Amerika er ikke et land — det er en strid om, hvad et land kan være. Seks epoker af en republik, hver med sit billede og sin Cash-sang, fra 1776 til i dag.',
    },
  }

  await client.createOrReplace(doc)
  console.log(`Seeded historienPage: ${doc._id} (/historien)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
