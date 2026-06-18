import React from 'react'
import './styles.css'

export const metadata = {
  title: {
    default: 'Rasta Kreol',
    template: '%s | Rasta Kreol',
  },
  description: 'Seychelles-rooted merch. Tees, snapbacks, dad caps, bags, and bracelets.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-brand-cream text-brand-ink antialiased">
        <main>{children}</main>
      </body>
    </html>
  )
}
