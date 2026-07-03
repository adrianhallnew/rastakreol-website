// Pure, no server imports — used both server-side (real query results) and
// client-side (FilterSheet's live result count while dragging/toggling, before
// the filter is committed to the URL) so the preview count always matches
// exactly what submitting would actually return.

export interface ShopFilters {
  category?: string
  size?: string
  inStock?: boolean
  minPrice?: number
  maxPrice?: number
}

export interface FilterableProduct {
  categorySlug?: string
  price: number
  variants: { size: string; stock: number }[]
}

export function matchesFilters(product: FilterableProduct, filters: ShopFilters): boolean {
  if (filters.category && product.categorySlug !== filters.category) return false
  if (filters.minPrice != null && product.price < filters.minPrice) return false
  if (filters.maxPrice != null && product.price > filters.maxPrice) return false
  if (!filters.size && !filters.inStock) return true

  // size + inStock must match the SAME variant row, not just "some variant is
  // this size" and independently "some variant has stock" — .some() with both
  // conditions in one predicate guarantees that.
  return product.variants.some(
    (v) => (!filters.size || v.size === filters.size) && (!filters.inStock || v.stock > 0),
  )
}
