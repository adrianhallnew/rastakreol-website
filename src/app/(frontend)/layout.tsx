import React from 'react'
import { ToastProvider } from '../../components/ui/toast-provider'
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
        <ToastProvider>
          <main>{children}</main>
        </ToastProvider>
      </body>
    </html>
  )
}
