import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentCustomer } from '../../../../lib/auth/get-current-customer'
import { getWishlist } from '../../../../lib/wishlist/actions'
import { ProductGrid } from '../../../../components/shop/ProductGrid'
import { EmptyState } from '../../../../components/ui/EmptyState'
import type { Product } from '../../../../payload-types'

export const metadata: Metadata = { title: 'Wishlist' }

export default async function WishlistPage() {
  const customer = await getCurrentCustomer()
  if (!customer) redirect('/account/login')

  const wishlist = await getWishlist(2) // depth 2: items[].product.images[].image resolved to Media

  const products: Product[] = (wishlist?.items ?? [])
    .filter((item): item is typeof item & { product: Product } => typeof item.product === 'object')
    .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
    .map((item) => item.product)

  return (
    <div className="px-4 py-6">
      <h1 className="font-display text-2xl font-bold text-brand-ink">Wishlist</h1>
      <div className="mt-4">
        {products.length === 0 ? (
          <EmptyState
            heading="Nothing saved yet"
            body="Tap the heart on any tee to save it here."
            ctaLabel="Browse tees"
            ctaHref="/shop"
          />
        ) : (
          <ProductGrid products={products} wishlistedProductIds={products.map((p) => p.id)} />
        )}
      </div>
    </div>
  )
}
