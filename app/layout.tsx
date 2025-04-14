import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DevDuo',
  description: 'DevDuo is a peer-to-peer coding interview platform.',
  icons: '/favicon.svg',
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
