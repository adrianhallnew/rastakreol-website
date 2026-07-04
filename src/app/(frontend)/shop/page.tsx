import type { Metadata } from 'next'
import { queryProducts, queryCountBasis } from '../../../lib/shop/products'
import { queryVisibleCategories } from '../../../lib/shop/categories'
import { parseShopFilters } from '../../../lib/shop/parse-filters'
import { ShopFilterBar } from '../../../components/shop/ShopFilterBar'
import { ShopResults } from '../../../components/shop/ShopResults'
import { EmptyState } from '../../../components/ui/EmptyState'
import { getWishlistedProductIds } from '../../../lib/wishlist/actions'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse the full Rasta Kreol collection — tees, snapbacks, dad caps, bags, and bracelets.',
  alternates: { canonical: '/shop' },
}

type RawSearchParams = Record<string, string | string[] | undefined>

export default async function ShopPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const rawParams = await searchParams
  const filters = parseShopFilters(rawParams)

  const [categories, countBasis, page, wishlistedProductIds] = await Promise.all([
    queryVisibleCategories(),
    queryCountBasis(),
    queryProducts(filters, 1),
    getWishlistedProductIds(),
  ])

  const catalogEmpty = countBasis.length === 0

  return (
    <div>
      <div className="px-4 pt-6">
        <h1 className="font-display text-2xl font-bold text-brand-ink">Shop</h1>
      </div>
      <ShopFilterBar categories={categories} countBasis={countBasis} currentFilters={filters} />
      <div className="px-4 py-4">
        {page.items.length === 0 ? (
          catalogEmpty ? (
            <EmptyState
              heading="New arrivals coming soon"
              body="We're stocking the shop — check back shortly."
            />
          ) : (
            <EmptyState
              heading="No tees match these filters"
              ctaLabel="Clear filters"
              ctaHref="/shop"
            />
          )
        ) : (
          <ShopResults
            key={JSON.stringify(filters)}
            initialItems={page.items}
            initialHasNextPage={page.hasNextPage}
            filters={filters}
            wishlistedProductIds={wishlistedProductIds}
          />
        )}
      </div>
    </div>
  )
}
