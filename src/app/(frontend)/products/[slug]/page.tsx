import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Star } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Badge } from '../../../../components/ui/Badge'
import { StripeMotif } from '../../../../components/ui/StripeMotif'
import { PDPGallery } from '../../../../components/shop/PDPGallery'
import { PDPAddToCart } from '../../../../components/shop/PDPAddToCart'
import { PDPDescription } from '../../../../components/shop/PDPDescription'
import { formatPrice } from '../../../../lib/format-price'
import type { Media } from '../../../../payload-types'

type Params = Promise<{ slug: string }>

// cache(): generateMetadata and ProductPage both need this — without it, every PDP load
// queried the same product twice.
const getProduct = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'products',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    overrideAccess: false,
    limit: 1,
  })
  return result.docs[0]
})

async function getApprovedReviews(productId: number) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'reviews',
    where: { and: [{ product: { equals: productId } }, { approved: { equals: true } }] },
    overrideAccess: false,
    sort: '-createdAt',
    limit: 50,
  })
  return result.docs
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}

  const firstImage = product.images?.[0]?.image
  const ogImage = typeof firstImage === 'object' ? firstImage.sizes?.card?.url : undefined

  return {
    title: product.meta?.title || product.name,
    description: product.meta?.description || `${product.name} — Rasta Kreol.`,
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  }
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const reviews = await getApprovedReviews(product.id)
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
      : 0

  const images = (product.images ?? [])
    .map((entry) => entry.image)
    .filter((img): img is Media => typeof img === 'object')
    .map((img) => ({ url: img.sizes?.full?.url || img.url || '', alt: img.alt }))
    .filter((img) => img.url)

  const category = typeof product.category === 'object' ? product.category : undefined
  const variants = (product.variants ?? []).map((v) => ({
    size: v.size,
    sku: v.sku,
    stock: v.stock,
  }))
  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0)
  const onSale = product.on_sale && product.sale_price != null

  return (
    <div>
      <PDPGallery images={images} productName={product.name} />
      <StripeMotif height={2} />

      {/* pb-32: rough clearance for the fixed StickyAddToCart bar below, which doesn't
          have a shared CSS-variable height the way BottomNav's --bottom-nav-height does
          (single simple page, not worth a new dynamic system for one consumer). */}
      <div className="px-4 py-6 pb-32">
        {category && <Badge variant="category">{category.name}</Badge>}
        <h1 className="mt-1 font-display text-2xl font-bold text-brand-ink">{product.name}</h1>

        <div className="mt-2 flex items-center gap-3">
          {onSale ? (
            <>
              <span className="text-lg font-medium text-brand-ink">{formatPrice(product.sale_price!)}</span>
              <span className="text-brand-muted line-through">{formatPrice(product.price)}</span>
              <Badge variant="sale">Sale</Badge>
            </>
          ) : (
            <span className="text-lg font-medium text-brand-ink">{formatPrice(product.price)}</span>
          )}
        </div>

        {reviews.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-sm text-brand-muted">
            <div className="flex" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i <= Math.round(avgRating) ? 'currentColor' : 'none'}
                  className="text-brand-ink"
                />
              ))}
            </div>
            <span>
              {avgRating.toFixed(1)} · {reviews.length} review{reviews.length === 1 ? '' : 's'}
            </span>
          </div>
        )}

        {totalStock <= 0 && (
          <div className="mt-3">
            <Badge variant="oos">Out of stock</Badge>
          </div>
        )}
        {totalStock > 0 && totalStock <= 10 && (
          <div className="mt-3">
            <Badge variant="low-stock">Only {totalStock} left</Badge>
          </div>
        )}

        <StripeMotif height={2} />

        {product.description && (
          <div className="mt-6">
            <PDPDescription>
              <RichText data={product.description} />
            </PDPDescription>
          </div>
        )}

        <StripeMotif height={2} />

        {reviews.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display text-lg font-semibold text-brand-ink">Reviews</h2>
            <ul className="mt-3 space-y-4">
              {reviews.slice(0, 2).map((review) => (
                <li key={review.id} className="border-t border-brand-border pt-4">
                  <div className="flex items-center gap-1.5">
                    <div className="flex" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i <= Number(review.rating) ? 'currentColor' : 'none'}
                          className="text-brand-ink"
                        />
                      ))}
                    </div>
                    <span className="sr-only">{review.rating} out of 5 stars</span>
                  </div>
                  {review.title && <p className="mt-1 font-medium text-brand-ink">{review.title}</p>}
                  <p className="mt-1 text-sm text-brand-muted">{review.body}</p>
                </li>
              ))}
            </ul>
            {reviews.length > 2 && (
              <p className="mt-3 text-sm text-brand-muted">+{reviews.length - 2} more reviews</p>
            )}
          </section>
        )}
      </div>

      <PDPAddToCart productId={product.id} variants={variants} />
    </div>
  )
}
