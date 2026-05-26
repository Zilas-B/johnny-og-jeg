import type { Metadata } from 'next'

import '../styles/globals.css'
import { fontVariables } from './fonts'

export const metadata: Metadata = {
  title: 'Johnny & jeg',
  description: 'Et levende portræt af Johnny Cash og Amerika.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="da" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
