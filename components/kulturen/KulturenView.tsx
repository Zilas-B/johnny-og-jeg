import type { KULTUREN_QUERY_RESULT } from '@/sanity/types'

import { KulturenChips } from './KulturenChips'
import { KulturenHero } from './KulturenHero'
import { KulturenIntro } from './KulturenIntro'
import { KulturenOutro } from './KulturenOutro'
import { KulturenSubnav } from './KulturenSubnav'
import { LandSection } from './LandSection'

type Data = NonNullable<KULTUREN_QUERY_RESULT>

export function KulturenView({ data }: { data: Data }) {
  const landscapes = data.landscapes ?? []
  // Only landscapes with an authored essay render as full `.land` sections; the
  // chip grid + outro card always list all eight.
  const sections = landscapes.filter((l) => l.kulturenEssay && l.kulturenEssay.length > 0)
  const subnavItems = sections.map((l) => ({
    slug: l.slug ?? '',
    romanNumeral: l.romanNumeral,
    shortName: l.shortName,
  }))

  return (
    <div>
      {subnavItems.length > 0 ? <KulturenSubnav items={subnavItems} /> : null}
      {data.hero ? <KulturenHero hero={data.hero} /> : null}
      {data.chips ? <KulturenChips chips={data.chips} landscapes={landscapes} /> : null}
      {data.intro ? <KulturenIntro intro={data.intro} /> : null}
      {sections.map((l, i) => (
        <LandSection key={l.slug} data={l} isLast={i === sections.length - 1} />
      ))}
      {data.outro ? <KulturenOutro outro={data.outro} landscapes={landscapes} /> : null}
    </div>
  )
}
