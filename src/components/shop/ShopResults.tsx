'use client'

import { useState, useTransition } from 'react'
import { ProductGrid } from './ProductGrid'
import { Button } from '../ui/Button'
import { loadMoreProducts } from './actions'
import type { ShopFilters } from '../../lib/shop/match-filters'
import type { Product } from '../../payload-types'

interface ShopResultsProps {
  initialItems: Product[]
  initialHasNextPage: boolean
  filters: ShopFilters
  categorySlug?: string
  wishlistedProductIds?: number[]
}

// Parent page must render this with `key={searchParamsString}` so a new committed
// filter remounts it fresh — otherwise this component's local "loaded pages" state
// would persist across filter changes instead of resetting to page 1.
export function ShopResults({
  initialItems,
  initialHasNextPage,
  filters,
  categorySlug,
  wishlistedProductIds,
}: ShopResultsProps) {
  const [items, setItems] = useState(initialItems)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [page, setPage] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [announcement, setAnnouncement] = useState('')

  const handleLoadMore = () => {
    startTransition(async () => {
      const next = await loadMoreProducts(filters, page + 1, categorySlug)
      setItems((prev) => [...prev, ...next.items])
      setHasNextPage(next.hasNextPage)
      setPage((p) => p + 1)
      setAnnouncement(`${next.items.length} more product${next.items.length === 1 ? '' : 's'} loaded.`)
    })
  }

  return (
    <div>
      <ProductGrid products={items} wishlistedProductIds={wishlistedProductIds} />
      {hasNextPage && (
        <div className="mt-8 flex justify-center">
          <Button variant="secondary" size="lg" loading={isPending} onClick={handleLoadMore}>
            Load more
          </Button>
        </div>
      )}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  )
}
