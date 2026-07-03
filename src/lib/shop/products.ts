import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'
import type { Product } from '../../payload-types'
import { matchesFilters } from './match-filters'
import type { ShopFilters } from './match-filters'

export type { ShopFilters }

export const PAGE_SIZE = 12

// A single-city merch catalog is small (dozens to low hundreds of SKUs, not
// thousands) — fetching the full category/price/status-matched set and doing
// size/inStock filtering + pagination in JS is simpler and safer than trusting
// Payload's Postgres adapter to combine two array-subfield conditions
// (variants.size + variants.stock) against the SAME variant row, which isn't
// documented and would silently produce wrong results if assumed. Revisit if
// the catalog ever grows to a scale where this stops being cheap.
const SAFETY_LIMIT = 500

function baseWhere(categorySlug: string | undefined, minPrice?: number, maxPrice?: number): Where {
  const and: Where[] = [{ status: { equals: 'published' } }]
  if (categorySlug) and.push({ 'category.slug': { equals: categorySlug } })
  if (minPrice != null) and.push({ price: { greater_than_equal: minPrice } })
  if (maxPrice != null) and.push({ price: { less_than_equal: maxPrice } })
  return { and }
}

export interface ProductsPage {
  items: Product[]
  totalDocs: number
  hasNextPage: boolean
}

export async function queryProducts(
  filters: ShopFilters,
  page: number,
  categorySlug?: string,
): Promise<ProductsPage> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'products',
    // category is already pushed down to Postgres here via categorySlug — deliberately
    // NOT passed again through matchesFilters below (see queryCountBasis, which needs
    // it client-side for live category switching before a page navigation happens).
    where: baseWhere(categorySlug, filters.minPrice, filters.maxPrice),
    overrideAccess: false,
    limit: SAFETY_LIMIT,
    sort: '-createdAt',
  })

  const { size, inStock, minPrice, maxPrice } = filters
  const filtered = result.docs.filter((p) =>
    matchesFilters({ price: p.price, variants: p.variants ?? [] }, { size, inStock, minPrice, maxPrice }),
  )
  const start = (page - 1) * PAGE_SIZE
  const items = filtered.slice(start, start + PAGE_SIZE)

  return { items, totalDocs: filtered.length, hasNextPage: start + PAGE_SIZE < filtered.length }
}

export interface CountBasisItem {
  categorySlug?: string
  price: number
  variants: { size: string; stock: number }[]
}

// Site-wide (not category-scoped, unlike queryProducts) and lean (no
// images/description) — used by FilterSheet to compute the live "Show N results"
// count synchronously in the browser as the user toggles draft filters, including
// switching category itself, with zero network requests per toggle. Its length
// (before matchesFilters) also distinguishes "catalog genuinely empty" from
// "filtered to zero" for empty-state copy.
export async function queryCountBasis(): Promise<CountBasisItem[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'products',
    where: { status: { equals: 'published' } },
    overrideAccess: false,
    limit: SAFETY_LIMIT,
    depth: 1,
    select: { price: true, variants: true, category: true },
  })

  return result.docs.map((p) => ({
    categorySlug: typeof p.category === 'object' ? (p.category?.slug ?? undefined) : undefined,
    price: p.price,
    variants: (p.variants ?? []).map((v) => ({ size: v.size, stock: v.stock })),
  }))
}
