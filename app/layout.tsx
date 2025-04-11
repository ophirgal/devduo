import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Coding Interview App',
  description: 'Peer-to-Peer Coding Interview App',
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
