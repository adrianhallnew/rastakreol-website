'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { BottomSheet } from '../ui/BottomSheet'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'
import { matchesFilters } from '../../lib/shop/match-filters'
import type { ShopFilters } from '../../lib/shop/match-filters'
import type { CountBasisItem } from '../../lib/shop/products'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const

interface CategoryOption {
  slug: string
  name: string
}

interface FilterSheetProps {
  open: boolean
  onClose: () => void
  categories: CategoryOption[]
  countBasis: CountBasisItem[]
  currentFilters: ShopFilters
}

export function FilterSheet({ open, onClose, categories, countBasis, currentFilters }: FilterSheetProps) {
  const router = useRouter()
  const [draft, setDraft] = useState<ShopFilters>(currentFilters)

  const matchCount = useMemo(
    () => countBasis.filter((item) => matchesFilters(item, draft)).length,
    [countBasis, draft],
  )

  const handleClear = () => setDraft({})

  const handleSubmit = () => {
    const path = draft.category ? `/shop/${draft.category}` : '/shop'
    const params = new URLSearchParams()
    if (draft.size) params.set('size', draft.size)
    if (draft.inStock) params.set('inStock', 'true')
    if (draft.minPrice != null) params.set('minPrice', String(draft.minPrice))
    if (draft.maxPrice != null) params.set('maxPrice', String(draft.maxPrice))
    const qs = params.toString()
    router.push(qs ? `${path}?${qs}` : path)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} ariaLabel="Filter products">
      <div className="px-4 pb-8">
        <div className="flex items-center justify-between py-2">
          <h2 className="font-display text-lg font-semibold text-brand-ink">Filters</h2>
          <button
            type="button"
            onClick={handleClear}
            className="flex min-h-11 items-center px-2 text-sm font-medium text-brand-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
          >
            Clear
          </button>
        </div>

        <fieldset className="border-t border-brand-border py-3">
          <legend className="text-xs font-medium uppercase tracking-[0.08em] text-brand-muted">Category</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            <ChipButton
              selected={!draft.category}
              onClick={() => setDraft((d) => ({ ...d, category: undefined }))}
            >
              All
            </ChipButton>
            {categories.map((c) => (
              <ChipButton
                key={c.slug}
                selected={draft.category === c.slug}
                onClick={() => setDraft((d) => ({ ...d, category: c.slug }))}
              >
                {c.name}
              </ChipButton>
            ))}
          </div>
        </fieldset>

        <fieldset className="border-t border-brand-border py-3">
          <legend className="text-xs font-medium uppercase tracking-[0.08em] text-brand-muted">Size</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <ChipButton
                key={size}
                selected={draft.size === size}
                onClick={() => setDraft((d) => ({ ...d, size: d.size === size ? undefined : size }))}
              >
                {size}
              </ChipButton>
            ))}
          </div>
        </fieldset>

        <fieldset className="border-t border-brand-border py-3">
          <legend className="text-xs font-medium uppercase tracking-[0.08em] text-brand-muted">Price (SCR)</legend>
          <div className="mt-3 flex items-center gap-3">
            <label className="flex-1">
              <span className="mb-1 block text-sm text-brand-muted">Min</span>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={draft.minPrice ?? ''}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, minPrice: e.target.value ? Number(e.target.value) : undefined }))
                }
                className="h-11 w-full rounded-sm border border-brand-stone px-3 text-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
              />
            </label>
            <label className="flex-1">
              <span className="mb-1 block text-sm text-brand-muted">Max</span>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={draft.maxPrice ?? ''}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, maxPrice: e.target.value ? Number(e.target.value) : undefined }))
                }
                className="h-11 w-full rounded-sm border border-brand-stone px-3 text-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="border-t border-brand-border py-3">
          <legend className="text-xs font-medium uppercase tracking-[0.08em] text-brand-muted">Availability</legend>
          <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={draft.inStock ?? false}
              onChange={(e) => setDraft((d) => ({ ...d, inStock: e.target.checked || undefined }))}
              className="h-5 w-5 accent-brand-ink"
            />
            <span className="text-brand-ink">In stock only</span>
          </label>
        </fieldset>

        <Button className="mt-2 w-full" size="lg" onClick={handleSubmit}>
          Show {matchCount} {matchCount === 1 ? 'result' : 'results'}
        </Button>
      </div>
    </BottomSheet>
  )
}

function ChipButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'h-11 rounded-sm border px-3 text-sm',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink',
        selected ? 'border-brand-ink font-medium text-brand-ink' : 'border-brand-stone text-brand-ink',
      )}
    >
      {children}
    </button>
  )
}
