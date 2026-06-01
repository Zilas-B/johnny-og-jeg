import type { HOME_PAGE_QUERY_RESULT } from '@/sanity/types'

import { PortableText } from '@/components/editorial/PortableText'

import styles from './Hymn.module.css'

type Data = NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>['hymn']>

export function Hymn({ data }: { data: Data }) {
  return (
    <section className={styles.hymn}>
      <div className="wrap">
        <div className={styles.kicker}>{data.kicker}</div>
        <blockquote className={styles.quote}>
          <PortableText value={data.quote} />
        </blockquote>
        {data.attribution ? <div className={styles.attrib}>{data.attribution}</div> : null}
      </div>
    </section>
  )
}
