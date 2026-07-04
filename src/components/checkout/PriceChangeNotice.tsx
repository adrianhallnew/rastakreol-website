'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/Button'
import { formatPrice } from '../../lib/format-price'
import { acknowledgeCartPriceChanges } from '../../lib/cart/price-staleness'
import type { StaleCartItem } from '../../lib/cart/price-staleness'

// Spec 3.5: price changed since add to cart — customer must acknowledge before checkout
// can proceed. Blocks the 3-step flow entirely until this resolves.
export function PriceChangeNotice({ items }: { items: StaleCartItem[] }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAcknowledge = () => {
    startTransition(async () => {
      try {
        await acknowledgeCartPriceChanges()
        router.refresh()
      } catch {
        setError('Could not update prices. Please try again.')
      }
    })
  }

  return (
    <div className="px-4 py-8">
      <h1 className="font-display text-xl font-semibold text-brand-ink">Some prices have changed</h1>
      <p className="mt-2 text-brand-muted">Please review before continuing to checkout.</p>

      <ul className="mt-6 divide-y divide-brand-border">
        {items.map((item) => (
          <li key={item.variantSku} className="py-3">
            <p className="font-medium text-brand-ink">
              {item.productName} <span className="text-brand-muted">· Size {item.size}</span>
            </p>
            <p className="mt-1 text-sm">
              <span className="text-brand-muted line-through">{formatPrice(item.oldPrice)}</span>{' '}
              <span className="font-medium text-brand-ink">{formatPrice(item.newPrice)}</span>
            </p>
          </li>
        ))}
      </ul>

      {error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}

      <Button className="mt-6 w-full" size="lg" loading={isPending} onClick={handleAcknowledge}>
        Update prices and continue
      </Button>
    </div>
  )
}
