import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stopover Frontend',
  description: 'Frontend for stopover flight website'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
