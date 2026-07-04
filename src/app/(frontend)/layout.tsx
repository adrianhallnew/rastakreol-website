import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ToastProvider } from '../../components/ui/toast-provider'
import { TopNav } from '../../components/layout/TopNav'
import { BottomNav } from '../../components/layout/BottomNav'
import { MainBottomInset } from '../../components/layout/MainBottomInset'
import { AnnouncementBanner } from '../../components/layout/AnnouncementBanner'
import { getCurrentCustomer } from '../../lib/auth/get-current-customer'
import { getCartItemCount } from '../../lib/cart/actions'
import './styles.css'

async function getSiteSettings() {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
}

export async function generateMetadata() {
  const siteSettings = await getSiteSettings()
  const favicon = typeof siteSettings.favicon === 'object' ? siteSettings.favicon : undefined
  const faviconUrl = favicon?.url

  return {
    title: {
      default: siteSettings.store_name || 'Rasta Kreol',
      template: `%s | ${siteSettings.store_name || 'Rasta Kreol'}`,
    },
    description: 'Seychelles-rooted merch. Tees, snapbacks, dad caps, bags, and bracelets.',
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [customer, cartCount, siteSettings] = await Promise.all([
    getCurrentCustomer(),
    getCartItemCount(),
    getSiteSettings(),
  ])
  const accountHref = customer ? '/account' : '/account/login'

  const logo = typeof siteSettings.logo === 'object' ? siteSettings.logo : undefined
  const logoUrl = logo?.url ?? undefined

  return (
    <html lang="en">
      <body className="bg-brand-cream text-brand-ink antialiased">
        <ToastProvider>
          {siteSettings.announcement?.enabled && siteSettings.announcement.text && (
            <AnnouncementBanner text={siteSettings.announcement.text} link={siteSettings.announcement.link} />
          )}
          <TopNav accountHref={accountHref} cartCount={cartCount} logoUrl={logoUrl} />
          <MainBottomInset>{children}</MainBottomInset>
          <BottomNav accountHref={accountHref} cartCount={cartCount} />
        </ToastProvider>
      </body>
    </html>
  )
}
