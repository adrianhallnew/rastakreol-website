'use client'

import { useState } from 'react'
import { Button } from '../../../../components/ui/Button'
import { Badge } from '../../../../components/ui/Badge'
import { Skeleton } from '../../../../components/ui/Skeleton'
import { BottomSheet } from '../../../../components/ui/BottomSheet'
import { StripeMotif } from '../../../../components/ui/StripeMotif'
import { useToast } from '../../../../components/ui/toast-provider'
import { StickyAddToCart } from '../../../../components/layout/StickyAddToCart'
import type { StickyAddToCartVariant } from '../../../../components/layout/StickyAddToCart'

const variants = ['primary', 'secondary', 'ghost', 'danger'] as const
const sizes = ['sm', 'md', 'lg'] as const

const mockVariants: StickyAddToCartVariant[] = [
  { size: 'S', sku: 'DEMO-S', stock: 5 },
  { size: 'M', sku: 'DEMO-M', stock: 5 },
  { size: 'L', sku: 'DEMO-L', stock: 0 },
]

export default function StyleGuidePage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [showStickyCart, setShowStickyCart] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [addStatus, setAddStatus] = useState<'idle' | 'adding' | 'added'>('idle')
  const { toast } = useToast()

  const handleAddToCart = () => {
    setAddStatus('adding')
    setTimeout(() => setAddStatus('added'), 800)
    setTimeout(() => setAddStatus('idle'), 2000)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Style guide</h1>
      <p className="mt-2 text-brand-muted">
        Internal reference for `components/ui/*`. Not linked from any nav — dev only.
      </p>

      <StripeMotif />

      <section className="py-8">
        <h2 className="font-display text-xl font-semibold">StripeMotif</h2>
        <div className="mt-4 space-y-2">
          <StripeMotif height={4} />
          <StripeMotif height={2} />
        </div>
      </section>

      <section className="py-8">
        <h2 className="font-display text-xl font-semibold">Button</h2>
        <div className="mt-4 space-y-6">
          {variants.map((variant) => (
            <div key={variant}>
              <h3 className="text-sm font-medium uppercase tracking-[0.08em] text-brand-muted">
                {variant}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {sizes.map((size) => (
                  <Button key={size} variant={variant} size={size}>
                    {variant} {size}
                  </Button>
                ))}
                <Button variant={variant} disabled>
                  Disabled
                </Button>
                <Button variant={variant} loading>
                  Loading
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8">
        <h2 className="font-display text-xl font-semibold">Badge</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Badge variant="oos">Out of stock</Badge>
          <Badge variant="category">Tees</Badge>
          <Badge variant="low-stock">Only 2 left</Badge>
          <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-sm border border-brand-border">
            Cart
            <span className="absolute -right-1 -top-1">
              <Badge variant="count">3</Badge>
            </span>
          </span>
        </div>
      </section>

      <section className="py-8">
        <h2 className="font-display text-xl font-semibold">Skeleton</h2>
        <div className="mt-4 flex gap-4">
          <Skeleton className="aspect-[3/4] w-32 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3 rounded-sm" />
            <Skeleton className="h-4 w-2/3 rounded-sm" />
            <Skeleton className="h-4 w-1/2 rounded-sm" />
          </div>
        </div>
      </section>

      <section className="py-8">
        <h2 className="font-display text-xl font-semibold">BottomSheet</h2>
        <div className="mt-4">
          <Button onClick={() => setSheetOpen(true)}>Open sheet</Button>
        </div>
        <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} ariaLabel="Example sheet">
          <div className="px-4 pb-8">
            <h3 className="font-display text-lg font-semibold">Example sheet</h3>
            <p className="mt-2 text-brand-muted">
              Drag the handle down, press Escape, or tap outside to dismiss.
            </p>
            <Button className="mt-4 w-full" onClick={() => setSheetOpen(false)}>
              Close
            </Button>
          </div>
        </BottomSheet>
      </section>

      <section className="py-8">
        <h2 className="font-display text-xl font-semibold">Toast</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => toast({ type: 'success', message: 'Added to cart.' })}>
            Trigger success
          </Button>
          <Button variant="secondary" onClick={() => toast({ type: 'error', message: 'Could not add to cart.' })}>
            Trigger error
          </Button>
          <Button variant="secondary" onClick={() => toast({ type: 'info', message: 'Price updated since you added this.' })}>
            Trigger info
          </Button>
        </div>
      </section>

      <section className="py-8">
        <h2 className="font-display text-xl font-semibold">StickyAddToCart</h2>
        <div className="mt-4">
          <Button onClick={() => setShowStickyCart((v) => !v)}>
            {showStickyCart ? 'Hide' : 'Show'} sticky add-to-cart
          </Button>
        </div>
        {showStickyCart && (
          <StickyAddToCart
            variants={mockVariants}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            onAddToCart={handleAddToCart}
            status={addStatus}
          />
        )}
      </section>
    </div>
  )
}
