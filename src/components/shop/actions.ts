'use server'

import { queryProducts } from '../../lib/shop/products'
import type { ShopFilters } from '../../lib/shop/match-filters'

export async function loadMoreProducts(filters: ShopFilters, page: number, categorySlug?: string) {
  return queryProducts(filters, page, categorySlug)
}
