import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { queryProducts, queryCountBasis } from '../../../../lib/shop/products'
import { queryVisibleCategories } from '../../../../lib/shop/categories'
import { parseShopFilters } from '../../../../lib/shop/parse-filters'
import { ShopFilterBar } from '../../../../components/shop/ShopFilterBar'
import { ShopResults } from '../../../../components/shop/ShopResults'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { StripeMotif } from '../../../../components/ui/StripeMotif'
import { getWishlistedProductIds } from '../../../../lib/wishlist/actions'

type RawSearchParams = Record<string, string | string[] | undefined>
type Params = Promise<{ category: string }>

// cache(): generateMetadata and ShopCategoryPage both need this — without it, every
// category page load queried the same category twice.
const getCategory = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'categories',
    where: { and: [{ slug: { equals: slug } }, { visible: { equals: true } }] },
    overrideAccess: false,
    limit: 1,
  })
  return result.docs[0]
})

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category: slug } = await params
  const category = await getCategory(slug)
  if (!category) return {}

  return {
    title: category.meta?.title || category.name,
    description: category.meta?.description || `Shop ${category.name} — Rasta Kreol.`,
    alternates: { canonical: `/shop/${category.slug}` },
  }
}

export default async function ShopCategoryPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: Promise<RawSearchParams>
}) {
  const { category: slug } = await params
  const category = await getCategory(slug)
  if (!category) notFound()

  const categorySlug = category.slug ?? slug
  const rawParams = await searchParams
  const filters = parseShopFilters(rawParams, categorySlug)

  const [categories, countBasis, page, wishlistedProductIds] = await Promise.all([
    queryVisibleCategories(),
    queryCountBasis(),
    queryProducts(filters, 1, categorySlug),
    getWishlistedProductIds(),
  ])

  const categoryTotal = countBasis.filter((item) => item.categorySlug === categorySlug).length
  const catalogEmpty = categoryTotal === 0

  return (
    <div>
      <div className="px-4 pt-6">
        <h1 className="font-display text-2xl font-bold text-brand-ink">{category.name}</h1>
      </div>
      <ShopFilterBar categories={categories} countBasis={countBasis} currentFilters={filters} />
      <StripeMotif height={4} />
      <div className="px-4 py-4">
        {page.items.length === 0 ? (
          catalogEmpty ? (
            <EmptyState
              heading="Nothing here yet"
              body={`We're stocking ${category.name.toLowerCase()} — check back shortly.`}
            />
          ) : (
            <EmptyState
              heading="No tees match these filters"
              ctaLabel="Clear filters"
              ctaHref={`/shop/${categorySlug}`}
            />
          )
        ) : (
          <ShopResults
            key={JSON.stringify(filters)}
            initialItems={page.items}
            initialHasNextPage={page.hasNextPage}
            filters={filters}
            categorySlug={categorySlug}
            wishlistedProductIds={wishlistedProductIds}
          />
        )}
      </div>
    </div>
  )
}
