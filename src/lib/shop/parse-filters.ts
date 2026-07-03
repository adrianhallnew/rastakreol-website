import type { ShopFilters } from './match-filters'

type RawSearchParams = Record<string, string | string[] | undefined>

export function parseShopFilters(searchParams: RawSearchParams, categoryFromRoute?: string): ShopFilters {
  const get = (key: string) => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }

  const minPrice = get('minPrice')
  const maxPrice = get('maxPrice')

  return {
    category: categoryFromRoute ?? get('category') ?? undefined,
    size: get('size') || undefined,
    inStock: get('inStock') === 'true' || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  }
}
