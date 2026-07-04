import React from 'react'
import { ToastProvider } from '../../components/ui/toast-provider'
import { TopNav } from '../../components/layout/TopNav'
import { BottomNav } from '../../components/layout/BottomNav'
import { MainBottomInset } from '../../components/layout/MainBottomInset'
import { getCurrentCustomer } from '../../lib/auth/get-current-customer'
import { getCartItemCount } from '../../lib/cart/actions'
import './styles.css'

export const metadata = {
  title: {
    default: 'Rasta Kreol',
    template: '%s | Rasta Kreol',
  },
  description: 'Seychelles-rooted merch. Tees, snapbacks, dad caps, bags, and bracelets.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const customer = await getCurrentCustomer()
  const accountHref = customer ? '/account' : '/account/login'
  const cartCount = await getCartItemCount()

  return (
    <html lang="en">
      <body className="bg-brand-cream text-brand-ink antialiased">
        <ToastProvider>
          <TopNav accountHref={accountHref} cartCount={cartCount} />
          <MainBottomInset>{children}</MainBottomInset>
          <BottomNav accountHref={accountHref} cartCount={cartCount} />
        </ToastProvider>
      </body>
    </html>
  )
}
