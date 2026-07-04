import type { Metadata } from 'next'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { StripeMotif } from '../../../components/ui/StripeMotif'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config })
  const about = await payload.findGlobal({ slug: 'about-settings', overrideAccess: true })

  return {
    title: 'About',
    description: about.body || 'The story behind Rasta Kreol.',
  }
}

export default async function AboutPage() {
  const payload = await getPayload({ config })
  const about = await payload.findGlobal({ slug: 'about-settings', overrideAccess: true })

  const image = typeof about.image === 'object' ? about.image : undefined
  const imageUrl = image?.sizes?.full?.url || image?.url

  return (
    <div>
      {imageUrl && (
        <div className="relative aspect-[4/5] w-full">
          <Image src={imageUrl} alt={image?.alt ?? ''} fill unoptimized sizes="100vw" className="object-cover" />
        </div>
      )}
      <StripeMotif height={4} />
      <div className="px-4 py-10 text-center">
        <h1 className="font-display text-2xl font-bold text-brand-ink">{about.headline || 'Our story'}</h1>
        {about.body && <p className="mx-auto mt-4 max-w-md text-brand-ink">{about.body}</p>}
      </div>
      <StripeMotif height={4} />
    </div>
  )
}
