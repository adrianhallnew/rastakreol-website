import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { StripeMotif } from '../../components/ui/StripeMotif'
import { ProductGrid } from '../../components/shop/ProductGrid'
import { buttonVariants } from '../../components/ui/button-variants'
import { getWishlistedProductIds } from '../../lib/wishlist/actions'
import type { Product } from '../../payload-types'

async function getHomepageData() {
  const payload = await getPayload({ config })
  const homepage = await payload.findGlobal({ slug: 'homepage-settings', overrideAccess: true })

  let featured: Product[] = []
  if (homepage.sections?.show_featured !== false && homepage.featured_products?.length) {
    const ids = homepage.featured_products
      .map((p) => (typeof p === 'object' ? p.id : p))
      .slice(0, 4)
    const result = await payload.find({
      collection: 'products',
      where: { and: [{ id: { in: ids } }, { status: { equals: 'published' } }] },
      overrideAccess: false,
      limit: 4,
    })
    featured = result.docs
  }

  const wishlistedProductIds = await getWishlistedProductIds()

  return { homepage, featured, wishlistedProductIds }
}

export default async function HomePage() {
  const { homepage, featured, wishlistedProductIds } = await getHomepageData()

  const heroImage = typeof homepage.hero?.image === 'object' ? homepage.hero.image : undefined
  const heroImageUrl = heroImage?.sizes?.full?.url || heroImage?.url

  return (
    <div>
      {heroImageUrl ? (
        // ~55% of avail (nav-cleared) viewport — leaves tagline+About-us visible on load
        // w/o scroll. svh covers safe-area/home-indicator, not Safari's own chrome height
        // when showing — extra margin below 65% covers that.
        <div
          className="relative flex items-end"
          style={{ minHeight: 'calc((100svh - var(--top-nav-height) - var(--bottom-nav-height)) * 0.55)' }}
        >
          <Image
            src={heroImageUrl}
            alt={heroImage?.alt ?? ''}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-2/5"
            style={{ background: 'linear-gradient(to top, rgba(27,31,25,0.6), transparent)' }}
            aria-hidden="true"
          />
          <div className="relative z-10 px-4 pb-12">
            {homepage.hero?.headline && (
              <h1 className="max-w-md font-display text-4xl font-bold leading-tight text-brand-cream">
                {homepage.hero.headline}
              </h1>
            )}
            <Link
              href={homepage.hero?.cta_link || '/shop'}
              className={buttonVariants({ variant: 'primary', size: 'lg', className: 'mt-6' })}
            >
              {homepage.hero?.cta_label || 'Shop tees'}
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start bg-brand-paper px-4 py-16">
          <h1 className="font-display text-3xl font-bold text-brand-ink">Rasta Kreol</h1>
          <p className="mt-2 text-brand-muted">Seychelles-rooted merch.</p>
          <Link href="/shop" className={buttonVariants({ variant: 'primary', size: 'lg', className: 'mt-6' })}>
            Shop tees
          </Link>
        </div>
      )}

      {featured.length > 0 && (
        <>
          <StripeMotif height={4} />
          <section className="px-4 py-8">
            <h2 className="font-display text-xl font-semibold text-brand-ink">New in</h2>
            <div className="mt-4">
              <ProductGrid products={featured} wishlistedProductIds={wishlistedProductIds} />
            </div>
          </section>
        </>
      )}

      {homepage.sections?.show_brand_story !== false && (
        <>
          <StripeMotif height={4} />
          <section className="px-4 py-10 text-center">
            <p className="mx-auto max-w-md text-brand-ink">
              Rasta Kreol carries the colours of home — blue, gold, red, green — stitched into
              everyday wear for Seychellois at home and abroad. One love, one heart, one destiny.
            </p>
            <Link
              href="/about"
              className={buttonVariants({ variant: 'ghost', size: 'md', className: 'mt-4' })}
            >
              About us
            </Link>
          </section>
        </>
      )}
    </div>
  )
}
