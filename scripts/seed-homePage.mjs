// One-shot seed script for the homePage singleton.
// Run with: pnpm sanity exec scripts/seed-homePage.mjs --with-user-token
// Content lifted from claude-design-template/Johnny og jeg.html.

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-05-01' })

const doc = {
  _id: 'drafts.homePage',
  _type: 'homePage',
  hero: {
    title: 'Johnny og jeg',
    deck: [
      {
        _type: 'block',
        _key: 'herodeck1',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'herodeck1a',
            text:
              'Den første gang jeg hørte stemmen — den dybe, brækkede stemme fra et fængsel i Californien — vidste jeg ikke, at jeg lyttede til Amerika selv. Til en præst i sort, til en synder, til et land. Det her er fortællingen om en mand, en tro og en nation — og om hvorfor de stadig taler til os herovre.',
            marks: [],
          },
        ],
      },
    ],
    meta: ['Et essay af Mads', 'Læsetid ~ 12 min.', 'Sidst opdateret April 2026'],
  },
  signatureCard: {
    stamp: 'Sign. JR Cash 1955—2003',
    foreLabel: '— Forord —',
    quote: "Hello. I'm Johnny Cash.",
    body: [
      {
        _type: 'block',
        _key: 'sigbody1',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'sigbody1a',
            text:
              'Fire ord, der åbnede tusind koncerter. På denne side åbner de et arkiv: om manden i sort, om de salmer han voksede op med på en bomuldsmark i Arkansas, og om det land, han både elskede og rev fra hinanden i sine sange.',
            marks: [],
          },
        ],
      },
      {
        _type: 'block',
        _key: 'sigbody2',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'sigbody2a',
            text:
              'Jeg er ikke historiker. Jeg er en dansker, der har lyttet længe — og som tror, Cash kan vise os noget om Amerika, vi ikke ser i nyhederne.',
            marks: [],
          },
        ],
      },
    ],
    scripture: {
      text: 'For jeg skammer mig ikke ved evangeliet.',
      reference: 'Rom. 1:16',
    },
  },
  ticker: {
    items: [
      ['1955', 'SUN RECORDS, MEMPHIS'],
      ['1956', 'I WALK THE LINE'],
      ['1963', 'RING OF FIRE'],
      ['1968', 'FOLSOM PRISON'],
      ['1969', 'SAN QUENTIN'],
      ['1969', 'A BOY NAMED SUE'],
      ['1970', 'THE GOSPEL ROAD'],
      ['1971', 'MAN IN BLACK'],
      ['1972', 'A THING CALLED LOVE'],
      ['1974', 'RAGGED OLD FLAG'],
      ['1976', 'ONE PIECE AT A TIME'],
      ['1979', '(GHOST) RIDERS IN THE SKY'],
      ['1985', 'HIGHWAYMAN'],
      ['1987', 'THE NIGHT HANK WILLIAMS CAME TO TOWN'],
      ['1994', 'AMERICAN RECORDINGS'],
      ['2002', 'HURT'],
    ].map(([year, milestone], i) => ({
      _key: `tk${i + 1}`,
      _type: 'tickerItem',
      year,
      milestone,
    })),
  },
  vinyls: {
    kicker: '— Tre rubrikker · Side A · Side B · Side C —',
    heading: 'Manden i tre spor',
    deck:
      'Cash er ikke én ting. Han er sangskriveren, synderen og borgeren — tre stemmer, der griber ind i hinanden. Vælg en plade, læg nålen på.',
    items: [
      {
        _key: 'vinyl1',
        _type: 'vinylTile',
        cornerNumber: 'SIDE A · No. 01',
        cornerTag: '33⅓ RPM',
        vinylAccent: 'barn',
        sleeveText: 'Side A · Long Play',
        vinylTopLabel: '— Sun Records —',
        vinylTitle: 'Musikeren',
        vinylBottomLabel: 'Memphis · TN',
        heading: 'Musikeren',
        subhead: 'Boom-chicka-boom · 1955 — 2003',
        body: [
          {
            _type: 'block',
            _key: 'v1body',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'v1body_a',
                text:
                  'Han fandt en rytme på en bomuldsmark og bar den hele vejen til Folsom Prison. Cash var ikke bare country — han var den linje, hvor folkemusik, gospel, rockabilly og protest mødtes. Et plekter, en bas og en stemme som en jernbane.',
                marks: [],
              },
            ],
          },
        ],
        tracklist: [
          { _key: 'v1t1', _type: 'vinylTrack', track: 'A1', title: 'Folsom Prison Blues', duration: '2:42' },
          { _key: 'v1t2', _type: 'vinylTrack', track: 'A2', title: 'I Walk the Line', duration: '2:45' },
          { _key: 'v1t3', _type: 'vinylTrack', track: 'A3', title: 'Ring of Fire', duration: '2:37' },
          { _key: 'v1t4', _type: 'vinylTrack', track: 'A4', title: 'Hurt (2002)', duration: '3:38' },
        ],
        linkText: 'Læs om musikeren',
        linkHref: '/musikeren',
      },
      {
        _key: 'vinyl2',
        _type: 'vinylTile',
        cornerNumber: 'SIDE B · No. 02',
        cornerTag: 'HYMNAL',
        vinylAccent: 'denim',
        sleeveText: 'Side B · Gospel Road',
        vinylTopLabel: '— Gospel Road —',
        vinylTitle: 'Cash & Jesus',
        vinylBottomLabel: 'Israel · 1971',
        heading: 'Kristendommen',
        subhead: 'Cash og Jesus · Synd og nåde',
        body: [
          {
            _type: 'block',
            _key: 'v2body',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'v2body_a',
                text:
                  'Han faldt og rejste sig — og faldt igen. Cash sang for fanger, fordi han forstod den, der har brug for nåde. Fra moderens salmer i Dyess, Arkansas, til hans egen film om Jesus i 1973: troen var aldrig en facade. Den var hans rygrad i sort.',
                marks: [],
              },
            ],
          },
        ],
        tracklist: [
          { _key: 'v2t1', _type: 'vinylTrack', track: 'B1', title: 'Personal Jesus', duration: '3:21' },
          { _key: 'v2t2', _type: 'vinylTrack', track: 'B2', title: 'Why Me Lord', duration: '3:28' },
          { _key: 'v2t3', _type: 'vinylTrack', track: 'B3', title: 'The Old Rugged Cross', duration: '3:55' },
          { _key: 'v2t4', _type: 'vinylTrack', track: 'B4', title: 'Were You There', duration: '4:11' },
        ],
        linkText: 'Læs om troen',
        linkHref: '/cash-og-jesus',
      },
      {
        _key: 'vinyl3',
        _type: 'vinylTile',
        cornerNumber: 'SIDE C · No. 03',
        cornerTag: 'RAGGED OLD FLAG',
        vinylAccent: 'brass',
        sleeveText: 'Side C · The Ragged Flag',
        vinylTopLabel: '— The Republic —',
        vinylTitle: 'Amerika',
        vinylBottomLabel: 'Est. 1776',
        heading: 'Amerika',
        subhead: 'Cash og nationen · Bomuld, jernbane, prærie',
        body: [
          {
            _type: 'block',
            _key: 'v3body',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'v3body_a',
                text:
                  'Han syntes om landet nok til at synge om dets fanger, dets indianere og dets soldater — uden at gøre sig fin. Cash er Amerika på en god dag og en dårlig: republikken set fra en cellevindue, fra en kirkebænk, fra et togvindue mellem Arkansas og Californien.',
                marks: [],
              },
            ],
          },
        ],
        tracklist: [
          { _key: 'v3t1', _type: 'vinylTrack', track: 'C1', title: 'Ragged Old Flag', duration: '3:08' },
          { _key: 'v3t2', _type: 'vinylTrack', track: 'C2', title: 'The Ballad of Ira Hayes', duration: '4:08' },
          { _key: 'v3t3', _type: 'vinylTrack', track: 'C3', title: 'Man in Black', duration: '2:52' },
          { _key: 'v3t4', _type: 'vinylTrack', track: 'C4', title: 'Big River', duration: '2:31' },
        ],
        linkText: 'Læs om Amerika',
        linkHref: '/cash-og-amerika',
      },
    ],
  },
  historicalThread: {
    kicker: '— En tråd gennem republikken —',
    heading: [
      {
        _type: 'block',
        _key: 'ht1',
        style: 'normal',
        markDefs: [],
        children: [
          { _type: 'span', _key: 'ht1a', text: 'Et liv på ', marks: [] },
          { _type: 'span', _key: 'ht1b', text: 'tværs', marks: ['em'] },
        ],
      },
      {
        _type: 'block',
        _key: 'ht2',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: 'ht2a', text: 'af et århundrede.', marks: [] }],
      },
    ],
    intro: [
      {
        _type: 'block',
        _key: 'hti1',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'hti1a',
            text:
              'Cashs liv løber langs Amerikas egen rygrad: depressionen, Anden Verdenskrig, borgerrettighedstiden, Vietnam, Watergate, Reagan-årene og helt frem til 11. september. Han voksede op i en koloni Roosevelt byggede til fattige bomuldsbønder — han døde i et land, der var ved at finde sig selv igen.',
            marks: [],
          },
        ],
      },
    ],
    timeline: [
      {
        _key: 'tl1',
        _type: 'timelineEvent',
        year: '1932',
        place: 'Kingsland · Arkansas',
        heading: 'Født ind i depressionen',
        description: ptParagraph('tl1d',
          'Den fjerde af syv børn på en bomuldsmark. Familien flytter til en New Deal-koloni i Dyess — Roosevelts forsøg på at redde Sydens fattige. Cash vokser op med Wall Street-krakkets eftervirkninger og statens hjælpende hånd.'),
      },
      {
        _key: 'tl2',
        _type: 'timelineEvent',
        year: '1955',
        place: 'Sun Records · Memphis',
        heading: '“Cry! Cry! Cry!”',
        description: ptParagraph('tl2d',
          "Sam Phillips udgiver hans første single — samme år som Rosa Parks bliver siddende i bussen i Montgomery. To revolutioner starter i Syden samtidig: rock'n'roll og borgerrettighedsbevægelsen."),
      },
      {
        _key: 'tl3',
        _type: 'timelineEvent',
        year: '1964',
        place: 'Bitter Tears · USA',
        heading: 'Borgerrettigheder & Ira Hayes',
        description: [
          {
            _type: 'block',
            _key: 'tl3d',
            style: 'normal',
            markDefs: [],
            children: [
              { _type: 'span', _key: 'tl3da', text: 'Mens Civil Rights Act underskrives og Selma nærmer sig, udgiver Cash ', marks: [] },
              { _type: 'span', _key: 'tl3db', text: 'Bitter Tears', marks: ['em'] },
              { _type: 'span', _key: 'tl3dc', text: ' — et helt album om amerikanske indianere. Radioerne nægter at spille ham. Han betaler en helsides-annonce for at skælde dem ud.', marks: [] },
            ],
          },
        ],
      },
      {
        _key: 'tl4',
        _type: 'timelineEvent',
        year: '1968',
        place: 'Folsom State Prison · Californien',
        heading: 'Året Amerika revnede',
        description: ptParagraph('tl4d',
          'King og Bobby Kennedy myrdes. Tet-offensiven raser i Vietnam. Cash indspiller live i et fængsel og synger med fangerne. Han vælger ikke parti — han vælger den faldne.'),
      },
      {
        _key: 'tl5',
        _type: 'timelineEvent',
        year: '1970',
        place: 'Det Hvide Hus · Washington D.C.',
        heading: 'Hos Nixon, mod krigen',
        description: ptParagraph('tl5d',
          'Nixon inviterer Cash til at spille i Det Hvide Hus. Han nægter at synge højrekomponerede arbejderhits — vælger i stedet “What Is Truth” og “Man in Black”. Stilfærdig modstand mod Vietnam, fra selve podiet.'),
      },
      {
        _key: 'tl6',
        _type: 'timelineEvent',
        year: '1974',
        place: 'Watergate-året',
        heading: '“Ragged Old Flag”',
        description: ptParagraph('tl6d',
          'Mens Nixon træder tilbage i ydmygelse, udgiver Cash sin patriotiske ode til en flænset, men stolt nation. Ikke en hyldest til magten — en hyldest til republikken, der har overlevet sine ledere.'),
      },
      {
        _key: 'tl7',
        _type: 'timelineEvent',
        year: '1985',
        place: 'Reagans Amerika',
        heading: 'The Highwaymen',
        description: ptParagraph('tl7d',
          'Med Willie Nelson, Waylon Jennings og Kris Kristofferson danner Cash et outlaw-supergruppe. Country bliver Reagan-tidens lydspor — men Highwaymen synger om landstrygere, ikke triumf.'),
      },
      {
        _key: 'tl8',
        _type: 'timelineEvent',
        year: '2002',
        place: 'Hendersonville · Tennessee',
        heading: '“Hurt” — et farvel',
        description: ptParagraph('tl8d',
          'Et halvt år efter 11. september indspiller Cash sin sidste store sang. Videoen er et helt århundrede pakket ind i fire minutter. Han dør i 2003, fire måneder efter June. En epitaf over en mand og en epoke.'),
      },
    ],
  },
  hymn: {
    kicker: '— En salme for republikken —',
    quote: ptParagraph('hymn1',
      'Han bar sort for de fattige og forslåede, for fangen i hans celle og soldaten, der aldrig kom hjem. Cash var ikke et flag — han var, hvad flaget burde minde os om.'),
    attribution: 'Mads ✶ Forord til “Johnny og jeg” ✶ 2026',
  },
  contact: {
    kicker: '— Skriv til mig —',
    heading: 'Send et brev\nover Atlanten.',
    deck: ptParagraph('cd1',
      'Har du et spørgsmål, en rettelse, en lytteanbefaling — eller vil du blot dele en sang? Skriv til mig. Jeg svarer alle henvendelser personligt, som regel inden for en uges tid.'),
    bookingLabel: '— Foredrag & arrangementer —',
    bookingHeading: 'Bestil et foredrag om Cash, troen og Amerika',
    bookingBody:
      'Jeg holder foredrag for menigheder, biblioteker, højskoler og foreninger. Et arrangement varer typisk 60–90 minutter, med musik, billeder og samtale.',
    bookingLinkText: 'Til siden om foredrag',
    bookingLinkHref: '/foredrag',
  },
}

function ptParagraph(key, text) {
  return [
    {
      _type: 'block',
      _key: key,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `${key}a`, text, marks: [] }],
    },
  ]
}

async function main() {
  const result = await client.createOrReplace(doc)
  console.log('Created/replaced:', result._id)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
