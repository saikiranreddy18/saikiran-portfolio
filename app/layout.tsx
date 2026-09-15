import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sai Kiran | Portfolio',
  description: 'Interactive portfolio - Exploring ideas and building the future',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
