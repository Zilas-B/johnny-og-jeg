// One-shot seed for the Bøger/spil/film page (`bogerPage` singleton, Step 7d).
// Run with: pnpm sanity exec scripts/seed-boger.mjs --with-user-token
//
// Authors the hero + literary map, the filter bar, three book reviews, the empty
// Spil/Film categories, and the invitation verbatim from
// "claude-design-template/Bøger, spil, film.html". Uploads the map + three covers
// through the §7 asset pipeline. _id 'bogerPage' (non-draft) → published;
// createOrReplace + content-hash asset dedupe keep re-runs idempotent.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-05-01' })

// --- Portable Text helpers ---------------------------------------------------
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

// --- Image upload ------------------------------------------------------------
async function uploadImage(filename) {
  const path = join(process.cwd(), 'claude-design-template', 'assets', filename)
  const asset = await client.assets.upload('image', readFileSync(path), { filename })
  console.log(`Uploaded ${filename}: ${asset._id}`)
  return asset._id
}
const imageObj = (assetId, alt) => ({ _type: 'image', asset: { _type: 'reference', _ref: assetId }, alt })

// --- Book content (verbatim) -------------------------------------------------
const BOOKS = [
  {
    catTag: 'Bog · Historie',
    roman: 'Nº I',
    cover: 'cover-these-truths.png',
    coverAlt: 'These Truths · Jill Lepore — bogforside',
    buyHref: 'https://www.saxo.com/dk/these-truths_jill-lepore_paperback_9781324091998',
    rating: 5,
    readWhen: 'Foråret 2024',
    pages: '960',
    language: 'Engelsk',
    title: 'These Truths — historien om en republik, der ikke holdt op med at fejle sig selv frem.',
    author: 'Jill Lepore',
    year: '2018',
    metaRow: [
      { label: 'Periode', value: '1492 — 2016' },
      { label: 'Tema', value: 'Demokrati, race, presse' },
      { label: 'Forlag', value: 'Norton' },
    ],
    lead: 'Lepore gør det, jeg ikke troede var muligt: skriver USA’s historie i ét bind, og gør det med en historikers tålmodighed og en journalists klang.',
    body: [
      'Bogen tager sit afsæt i Jefferson — i de “sandheder”, han kaldte selvindlysende: at alle mennesker er skabt lige, at de har ukrænkelige rettigheder, og at folket er den eneste legitime kilde til magten. Lepore stiller ét spørgsmål gennem 900 sider: **holdt det stik?** Og hun svarer ikke på det med ja eller nej, men med fortællinger — om slaveriet, om Reconstruction, om kvinders kamp for stemmeretten, om den moderne nyhedskultur, der går fra avispapir til algoritme.',
      'Det er en bog, som bliver hængende. Da jeg læste den, var jeg dybt nede i Cash’ *Bitter Tears*, og pludselig hang det hele sammen: Lepore skriver om hvordan hver generation af amerikanere har måttet forsvare republikken mod sig selv. Cash sang det i 1964 — om Ira Hayes, om de fattige, om de glemte. **Begge insisterer på, at landets løfter er moralske krav, ikke pyntelige fraser.**',
      'Hvis du kun vil læse én amerikansk historiebog i dit liv, bør det være denne. Den er lang, men den læser sig let — Lepore er sjælden god til at lade et menneske bære et helt årti.',
    ],
    verdictLine: '“Et stykke håndværk, der gør Cash’s Amerika forståeligt — og gør det smukkere.”',
    recoLabel: 'Læs den',
    recoText: 'Klart anbefalet',
    tags: ['Demokrati', 'Slaveri & race', 'Presse', '1492–2016', 'Single-volume'],
  },
  {
    catTag: 'Bog · Kulturgeografi',
    roman: 'Nº II',
    cover: 'cover-american-nations.png',
    coverAlt: 'American Nations · Colin Woodard — bogforside',
    buyHref: 'https://www.saxo.com/dk/american-nations_colin-woodard_paperback_9780143122029',
    rating: 4,
    readWhen: 'Vinteren 2024–25',
    pages: '384',
    language: 'Engelsk',
    title: 'American Nations — der findes ikke ét Amerika; der findes mindst elleve.',
    author: 'Colin Woodard',
    year: '2011',
    metaRow: [
      { label: 'Periode', value: '1600-tallet — i dag' },
      { label: 'Tema', value: 'Regional kultur' },
      { label: 'Forlag', value: 'Penguin' },
    ],
    lead: 'Woodard tegner et kort, jeg ikke har kunnet ryste af mig siden: USA er ikke en smeltedigel, men elleve nationer — de yankees, de cavaliers, de calvinister, de scotch-irere, de hollændere — der dårligt nok kan blive enige om hvad et land er.',
    body: [
      'Tesen er enkel og lidt halsbrækkende: de europæiske kolonister bragte hver deres kultur med — Yankeedom’s puritanske borgersind, Tidewater’s aristokrati, Greater Appalachia’s grænse-vrede, Deep South’s plantagestat — og de kulturer er aldrig blevet opløst. De stemmer stadig forskelligt, beder forskelligt, slår deres børn forskelligt. **Den blå-røde polarisering, vi taler om i dag, er en gammel grænse, der bare har skiftet mærkat.**',
      'For en, der som mig prøver at forstå hvorfor Cash kan synge salmer i Folsom og samtidig sympatisere med Native American-bevægelsen, er Woodard guld værd. Cash er Greater Appalachia til marv og ben — bjergene, baptisterne, mistilliden til de fine. Og det forklarer mere end jeg vil indrømme.',
      'Hvor Lepore er litterat, er Woodard kartograf. Bogen mangler hendes elegance, men kompenserer med *en pointe pr. side*. Et meget brugbart kompas til at læse moderne amerikansk politik.',
    ],
    verdictLine:
      '“Et kort over Cashs land, før Cash blev født. Læs den, før du danner dig en mening om amerikansk politik.”',
    recoLabel: 'Læs den',
    recoText: 'Anbefalet',
    tags: ['Regional kultur', 'Polarisering', 'Kolonihistorie', '11 nationer', 'Geografi'],
  },
  {
    catTag: 'Bog · Tidlig republik',
    roman: 'Nº III',
    cover: 'cover-founding-brothers.png',
    coverAlt: 'Founding Brothers · Joseph J. Ellis — bogforside',
    buyHref: 'https://www.saxo.com/dk/founding-brothers_joseph-j-ellis_paperback_9780375705243',
    rating: 4,
    readWhen: 'Sommeren 2025',
    pages: '304',
    language: 'Engelsk',
    title: 'Founding Brothers — seks aftener, hvor en ny republik blev til.',
    author: 'Joseph J. Ellis',
    year: '2000',
    metaRow: [
      { label: 'Periode', value: '1790 — 1826' },
      { label: 'Tema', value: 'Personlige magtkampe' },
      { label: 'Pris', value: 'Pulitzer 2001' },
    ],
    lead: 'Ellis trækker seks scener ud af stiftelsens første år — en duel, en middag, et brevvenskab — og viser hvordan republikken blev forhandlet på plads, ikke ved store taler, men ved private aftaler mellem mænd, der dårligt nok kunne sidde til bords sammen.',
    body: [
      'Bogen er bygget op som et kammerspil: Hamilton mod Burr på Weehawken-klippen i 1804. Jefferson, Hamilton og Madison i en middag i 1790, der bytter Hamiltons gældsplan for hovedstadens placering ved Potomac. Washingtons farvel-tale, ikke som dokument, men som en mand, der lægger sin bane. Adams og Jefferson, der efter tyve års tavshed begynder at skrive sammen igen — og dør på nøjagtig samme dag, 4. juli 1826, halvtreds år efter de skrev Uafhængighedserklæringen.',
      'Det Cash ville have elsket ved bogen, er at den nægter at gøre stifterne til marmor. **De er små, irriterende, æressyge mænd**, der er bange for at dø uden at blive husket. At de fik en republik ud af det, virker næsten som et uheld. Det er mere ærligt end de fleste skolebogsversioner — og mere bevægende.',
      'Læs den efter Lepore. Hun giver dig de store linjer; Ellis giver dig hvordan det føltes i køkkenet.',
    ],
    verdictLine: '“Et fint, kort modspil til Lepore — historie i menneskestørrelse, ikke i bøgers.”',
    recoLabel: 'Læs den',
    recoText: 'Anbefalet',
    tags: ['Stiftelsen', 'Hamilton', 'Jefferson', 'Adams', 'Pulitzer'],
  },
]

const spil = {
  title: 'Spil',
  count: mdInline('spil-c', '— **00** brikker på bordet endnu —'),
  glyph: '♟',
  heading: 'Spilhylden er endnu blank.',
  body: 'Brætspilshylden står klar — historie spillet ud i kort, terninger og territorier. Jeg samler i øjeblikket noter til de første anmeldelser. Forventede ankomster nedenfor.',
  pending: 'Kommer i sommeren 2026',
  previewLabel: '— Forventede titler · ikke i prioriteret rækkefølge —',
  preview: [
    { yr: '2026', text: '**1775 · Rebellion** — Academy Games’ borgerkrigssimulation. Står næste på bordet.' },
    { yr: '2026', text: '**Freedom · The Underground Railroad** — kooperativt spil om abolition.' },
    { yr: '2026', text: '**Twilight Struggle** — den kolde krig som kortdrevet duel.' },
    { yr: '2026', text: '**Wir sind das Volk!** — egentlig om Tyskland, men i dialog med amerikansk efterkrigstid.' },
  ],
}

const film = {
  title: 'Film',
  count: mdInline('film-c', '— **00** ruller i projektoren endnu —'),
  glyph: '▶',
  heading: 'Filmkassen står tom — for nu.',
  body: 'Filmsektionen er på vej. Jeg er i gang med at gense en stak film, jeg ikke vil anmelde af pligten af én genvisning — bedre at se ordentligt og skrive om det, der bliver hængende.',
  pending: 'Kommer i efteråret 2026',
  previewLabel: '— Optagne på rullen · i tilfældig rækkefølge —',
  preview: [
    { yr: '2005', text: '**Walk the Line** — selve indgangen for mange. Skal anmeldes som det, den er — og som det, den ikke er.' },
    { yr: '1973', text: '**The Gospel Road** — Cash’s egen film fra Det Hellige Land.' },
    { yr: '1962', text: '**The Man Who Shot Liberty Valance** — myte og republik i én scene.' },
    { yr: '1989', text: '**Glory** — borgerkrigen, set fra det 54. Massachusetts.' },
    { yr: '2007', text: '**No Country for Old Men** — det moderne Amerikas grænseland.' },
  ],
}

function buildEmpty(data, prefix) {
  return {
    title: data.title,
    count: data.count,
    glyph: data.glyph,
    heading: data.heading,
    body: data.body,
    pending: data.pending,
    previewLabel: data.previewLabel,
    preview: data.preview.map((p, i) => ({
      _key: `${prefix}${i}`,
      _type: 'object',
      yr: p.yr,
      text: mdInline(`${prefix}t${i}`, p.text),
    })),
  }
}

const invite = {
  kicker: '— Læs det jeg har læst —',
  heading: mdInline('inv-h', 'En læseliste er kun værd, hvis *nogen* bruger den.'),
  body: mdProse('inv-b', [
    'Det her er ikke en boganmelder-blog. Det er hyldemeteret hjemme i stuen, åbnet for en gang skyld. Hvis noget her får dig til at låne, købe eller låne ud — så har den gjort sit job.',
    'Har du selv en bog, et spil eller en film, jeg burde læse, spille eller se? Skriv til mig. Jeg går efter dem, der peger tilbage på Cash, troen og republikken — men jeg er åben for vildveje.',
  ]),
  actions: keyed(
    [
      { text: 'Send en anbefaling →', href: '/#kontakt', style: 'primary' },
      { text: 'Hør mig fortælle om dem', href: '/foredrag', style: 'secondary' },
    ],
    'ia',
  ),
  addCard: {
    label: '— Send en anbefaling —',
    heading: 'Hvad mangler\npå hylden?',
    body: 'Skriv en titel og en linje om, hvorfor jeg skal læse, spille eller se den. Jeg samler dem og svarer personligt.',
    placeholder: 'Titel · forfatter · instruktør …',
    small: '— Eller skriv et helt brev fra kontaktsiden —',
  },
}

async function main() {
  const mapId = await uploadImage('literary-usa-map.png')

  const books = []
  for (let i = 0; i < BOOKS.length; i++) {
    const b = BOOKS[i]
    const coverId = await uploadImage(b.cover)
    books.push({
      _key: `book${i}`,
      _type: 'book',
      catTag: b.catTag,
      roman: b.roman,
      coverImage: imageObj(coverId, b.coverAlt),
      buyHref: b.buyHref,
      rating: b.rating,
      readWhen: b.readWhen,
      pages: b.pages,
      language: b.language,
      title: b.title,
      author: b.author,
      year: b.year,
      metaRow: keyed(b.metaRow, `book${i}-m`),
      lead: b.lead,
      body: mdProse(`book${i}-b`, b.body),
      verdictLine: b.verdictLine,
      recoLabel: b.recoLabel,
      recoText: b.recoText,
      tags: b.tags,
    })
  }

  const doc = {
    _id: 'bogerPage',
    _type: 'bogerPage',
    hero: {
      eyebrow: 'Læseliste · Spilreol · Filmkasse',
      titleLead: 'Bøger, spil',
      titleTrail: 'film',
      deck: mdProse('hero-deck', [
        'En personlig *hyldemeter* for det Amerika, der formede Cash. Bogkartotek for det, jeg har læst og kan stå inde for; spil, der har lært mig noget om historien; og film, der gjorde det levende. *Læs det, jeg har læst — så har vi noget at tale om.*',
      ]),
      litmap: {
        image: imageObj(
          mapId,
          'USA tegnet af titler og forfatternavne — Twain, Steinbeck, Lee, Alcott, Hemingway m.fl.',
        ),
        capTag: 'Kortet',
        caption: mdInline(
          'cap',
          'Et land tegnet af sine forfattere — *Twain, Steinbeck, Lee, Alcott, Hemingway*. De ord, der lærte mig hvad Cash sang om.',
        ),
      },
    },
    filters: {
      lhs: mdInline('flhs', '— Kategori · **vælg en hylde** —'),
      alleCount: '06',
      bogerCount: '03',
      spilCount: '00',
      filmCount: '00',
      rhs: 'A–Z ✶ nyeste først',
    },
    booksTitle: 'Bøger',
    booksCount: mdInline('bc', '— **03** ud af 14 lagt på siden —'),
    books,
    spil: buildEmpty(spil, 'sp'),
    film: buildEmpty(film, 'fl'),
    invite,
    seo: {
      title: 'Bøger, spil, film — Johnny og jeg',
      description:
        'En personlig læseliste for det Amerika, der formede Cash: anmeldte historiebøger, og kommende hylder for spil og film. Læs det, jeg har læst — så har vi noget at tale om.',
    },
  }

  await client.createOrReplace(doc)
  console.log(`Seeded bogerPage: ${doc._id} (/boeger-spil-film)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
