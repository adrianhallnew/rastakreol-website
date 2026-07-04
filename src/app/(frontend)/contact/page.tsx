import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Rasta Kreol.',
}

export default async function ContactPage() {
  const payload = await getPayload({ config })
  const siteSettings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })

  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-brand-ink">Contact us</h1>

      {(siteSettings.contact_email || siteSettings.phone || siteSettings.instagram_url || siteSettings.facebook_url) && (
        <div className="mt-4 space-y-1 text-sm text-brand-muted">
          {siteSettings.contact_email && <p>Email: {siteSettings.contact_email}</p>}
          {siteSettings.phone && <p>Phone: {siteSettings.phone}</p>}
          {siteSettings.instagram_url && <p>Instagram: {siteSettings.instagram_url}</p>}
          {siteSettings.facebook_url && <p>Facebook: {siteSettings.facebook_url}</p>}
        </div>
      )}

      <ContactForm />
    </div>
  )
}
