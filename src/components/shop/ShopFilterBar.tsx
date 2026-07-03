'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { FilterSheet } from './FilterSheet'
import { cn } from '../../lib/cn'
import type { ShopFilters } from '../../lib/shop/match-filters'
import type { CountBasisItem } from '../../lib/shop/products'

interface CategoryOption {
  slug: string
  name: string
}

interface ShopFilterBarProps {
  categories: CategoryOption[]
  countBasis: CountBasisItem[]
  currentFilters: ShopFilters
}

export function ShopFilterBar({ categories, countBasis, currentFilters }: ShopFilterBarProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const chips: { key: string; label: string; next: ShopFilters }[] = []
  if (currentFilters.category) {
    const name = categories.find((c) => c.slug === currentFilters.category)?.name ?? currentFilters.category
    chips.push({ key: 'category', label: name, next: { ...currentFilters, category: undefined } })
  }
  if (currentFilters.size) {
    chips.push({ key: 'size', label: `Size: ${currentFilters.size}`, next: { ...currentFilters, size: undefined } })
  }
  if (currentFilters.inStock) {
    chips.push({ key: 'inStock', label: 'In stock', next: { ...currentFilters, inStock: undefined } })
  }
  if (currentFilters.minPrice != null || currentFilters.maxPrice != null) {
    chips.push({
      key: 'price',
      label: `SCR ${currentFilters.minPrice ?? 0}–${currentFilters.maxPrice ?? '∞'}`,
      next: { ...currentFilters, minPrice: undefined, maxPrice: undefined },
    })
  }

  const removeChip = (next: ShopFilters) => {
    const path = next.category ? `/shop/${next.category}` : '/shop'
    const params = new URLSearchParams()
    if (next.size) params.set('size', next.size)
    if (next.inStock) params.set('inStock', 'true')
    if (next.minPrice != null) params.set('minPrice', String(next.minPrice))
    if (next.maxPrice != null) params.set('maxPrice', String(next.maxPrice))
    const qs = params.toString()
    router.push(qs ? `${path}?${qs}` : path)
  }

  return (
    // <FilterSheet> (renders a position:fixed <dialog>) deliberately lives OUTSIDE this
    // div, as a sibling — backdrop-blur-sm below is a backdrop-filter, and a
    // backdrop-filter/filter/transform/perspective/contain on ANY ancestor creates a new
    // containing block for descendant position:fixed elements, silently turning "fixed"
    // into "fixed relative to that ancestor's box" instead of the true viewport. The
    // dialog was rendering pinned near this sticky bar's small box instead of the real
    // screen — only fixable by keeping no filtered/transformed ancestor between the
    // dialog and <body>.
    <>
      <div className="sticky top-14 z-30 bg-brand-cream/95 backdrop-blur-sm">
        <div className="flex h-12 items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              'flex h-9 items-center gap-1.5 rounded-sm border border-brand-border px-3 text-sm font-medium text-brand-ink',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink',
            )}
          >
            <SlidersHorizontal aria-hidden="true" size={16} />
            Filter{chips.length > 0 ? ` · ${chips.length}` : ''}
          </button>
        </div>
        {chips.length > 0 && (
          <div className="flex gap-2 overflow-x-auto px-4 pb-3">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => removeChip(chip.next)}
                className={cn(
                  'flex h-8 flex-none items-center gap-1 rounded-sm border border-brand-border px-2.5 text-sm text-brand-ink',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink',
                )}
              >
                {chip.label}
                <X aria-hidden="true" size={14} />
              </button>
            ))}
          </div>
        )}
      </div>
      <FilterSheet
        open={open}
        onClose={() => setOpen(false)}
        categories={categories}
        countBasis={countBasis}
        currentFilters={currentFilters}
      />
    </>
  )
}
