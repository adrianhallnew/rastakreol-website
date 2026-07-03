'use client'

import { StripeMotif } from '../ui/StripeMotif'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

export interface StickyAddToCartVariant {
  size: string
  sku: string
  stock: number
}

interface StickyAddToCartProps {
  variants: StickyAddToCartVariant[]
  selectedSize: string | null
  onSelectSize: (size: string) => void
  onAddToCart: () => void
  status: 'idle' | 'adding' | 'added'
}

export function StickyAddToCart({
  variants,
  selectedSize,
  onSelectSize,
  onAddToCart,
  status,
}: StickyAddToCartProps) {
  const allOutOfStock = variants.every((v) => v.stock <= 0)
  const selectedVariant = variants.find((v) => v.size === selectedSize)

  const label = allOutOfStock
    ? 'Out of stock'
    : status === 'added'
      ? 'In your cart'
      : !selectedVariant
        ? 'Select a size'
        : 'Add to cart'

  const disabled = allOutOfStock || status === 'added' || !selectedVariant

  return (
    <div className="fixed inset-x-0 z-30" style={{ bottom: 'var(--bottom-nav-height)' }}>
      <StripeMotif height={4} />
      <div className="flex items-center gap-3 bg-brand-paper px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-sheet">
        <div className="flex gap-2">
          {variants.map((variant) => {
            const isOos = variant.stock <= 0
            const isSelected = variant.size === selectedSize
            return (
              <button
                key={variant.sku}
                type="button"
                disabled={isOos}
                aria-pressed={isSelected}
                onClick={() => onSelectSize(variant.size)}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-sm border text-sm',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink',
                  isOos
                    ? 'border-brand-border text-brand-muted opacity-40 line-through'
                    : isSelected
                      ? 'border-brand-ink font-medium text-brand-ink'
                      : 'border-brand-border text-brand-ink',
                )}
              >
                {variant.size}
              </button>
            )
          })}
        </div>
        <Button
          className="flex-1"
          size="md"
          disabled={disabled}
          loading={status === 'adding'}
          onClick={onAddToCart}
        >
          {label}
        </Button>
      </div>
    </div>
  )
}
