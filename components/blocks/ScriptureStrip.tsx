import type { PAGE_QUERY_RESULT } from '@/sanity/types'

import styles from './ScriptureStrip.module.css'

type Block = Extract<NonNullable<NonNullable<PAGE_QUERY_RESULT>['blocks']>[number], { _type: 'scriptureStrip' }>

// `.scripture-strip` from Cash og Jesus.html: a thin accent band with an italic
// scripture line and a monospace reference. Decorative divider (aria-hidden in
// the template), reproduced as-is.
export function ScriptureStrip({ data }: { data: Block }) {
  return (
    <div className={styles.strip} aria-hidden="true">
      {`“${data.quote}”`}
      <span className={styles.ref}>{data.reference}</span>
    </div>
  )
}
