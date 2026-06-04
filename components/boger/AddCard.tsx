'use client'

import { Fragment, useState } from 'react'

import styles from './Boger.module.css'

// The "send en anbefaling" card — a visual-shell input (no backend; TechStack
// forms-are-out-of-scope). Clears the field and confirms on click, mirroring the
// template's inline handler.
type Props = {
  label: string
  heading: string
  body: string
  placeholder: string
  small: string
}

export function AddCard({ label, heading, body, placeholder, small }: Props) {
  const [value, setValue] = useState('')
  const [sent, setSent] = useState(false)
  const headingLines = heading.split('\n')

  return (
    <div className={styles.addCard}>
      <div className={styles.label}>{label}</div>
      <h4>
        {headingLines.map((line, i) => (
          <Fragment key={i}>
            {i > 0 ? <br /> : null}
            {line}
          </Fragment>
        ))}
      </h4>
      <p>{body}</p>
      <div className={styles.addField}>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setSent(false)
          }}
        />
        <button
          type="button"
          onClick={() => {
            setValue('')
            setSent(true)
          }}
        >
          {sent ? 'Tak ✓' : 'Send'}
        </button>
      </div>
      <div className={styles.addSmall}>{small}</div>
    </div>
  )
}
