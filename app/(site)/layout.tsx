import { Masthead } from '@/components/chrome/Masthead'
import { Nav } from '@/components/chrome/Nav'
import { Footer } from '@/components/chrome/Footer'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Masthead />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  )
}
