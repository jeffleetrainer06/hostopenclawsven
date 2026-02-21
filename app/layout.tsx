import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Jeff's Command Center",
  description: 'Sales assistant powered by Sven',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  )
}
