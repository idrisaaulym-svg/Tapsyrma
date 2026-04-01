import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Сәйкестендіру тесті',
  description: 'Студенттерге арналған сәйкестендіру тесті',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="kk">
      <body>{children}</body>
    </html>
  )
}
