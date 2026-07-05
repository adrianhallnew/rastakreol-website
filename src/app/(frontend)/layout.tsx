import React, { cache } from 'react'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ToastProvider } from '../../components/ui/toast-provider'
import { TopNav } from '../../components/layout/TopNav'
import { BottomNav } from '../../components/layout/BottomNav'
import { MainBottomInset } from '../../components/layout/MainBottomInset'
import { AnnouncementBanner } from '../../components/layout/AnnouncementBanner'
import { CartCountProvider } from '../../components/cart/CartCountProvider'
import { getCartItemCount } from '../../lib/cart/actions'
import './styles.css'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-playfair-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

// cache(): generateMetadata and RootLayout both call this for the same request —
// without it, every page load queried site-settings twice.
const getSiteSettings = cache(async () => {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
})

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
  const [cartCount, siteSettings] = await Promise.all([getCartItemCount(), getSiteSettings()])

  const logo = typeof siteSettings.logo === 'object' ? siteSettings.logo : undefined
  const logoUrl = logo?.url ?? undefined

  return (
    <html lang="en" className={`${playfairDisplay.variable} ${dmSans.variable}`}>
      <body className="bg-brand-cream text-brand-ink antialiased">
        <CartCountProvider initialCount={cartCount}>
          <ToastProvider>
            {siteSettings.announcement?.enabled && siteSettings.announcement.text && (
              <AnnouncementBanner text={siteSettings.announcement.text} link={siteSettings.announcement.link} />
            )}
            <TopNav logoUrl={logoUrl} />
            <MainBottomInset>{children}</MainBottomInset>
            <BottomNav />
          </ToastProvider>
        </CartCountProvider>
      </body>
    </html>
  )
}
