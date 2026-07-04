'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CartLineItem } from './CartLineItem'
import { CartSummary } from './CartSummary'
import { EmptyState } from '../ui/EmptyState'
import { StripeMotif } from '../ui/StripeMotif'
import { useToast } from '../ui/toast-provider'
import { updateCartItemQuantityAction, removeCartItemAction } from '../../lib/cart/actions'
import type { CartLineItemData } from './CartLineItem'

interface CartContentsProps {
  initialItems: CartLineItemData[]
}

// Owns the live cart state so removing the last item shows the empty state immediately,
// without a full page reload — the parent Server Component only knows the state at the
// time of the initial request, not after client-side interaction.
export function CartContents({ initialItems }: CartContentsProps) {
  const [items, setItems] = useState(initialItems)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const subtotal = items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0)

  const handleQuantityChange = (variantSku: string, quantity: number) => {
    const previous = items
    setItems((prev) => prev.map((item) => (item.variantSku === variantSku ? { ...item, quantity } : item)))
    startTransition(async () => {
      const result = await updateCartItemQuantityAction(variantSku, quantity)
      if (!result.success) {
        setItems(previous)
        toast({ type: 'error', message: result.error })
        return
      }
      router.refresh() // nav cart badge is server-rendered in layout.tsx
    })
  }

  const handleRemove = (variantSku: string) => {
    const previous = items
    setItems((prev) => prev.filter((item) => item.variantSku !== variantSku))
    startTransition(async () => {
      const result = await removeCartItemAction(variantSku)
      if (!result.success) {
        setItems(previous)
        toast({ type: 'error', message: result.error })
        return
      }
      router.refresh()
    })
  }

  if (items.length === 0) {
    return (
      <>
        <StripeMotif height={4} />
        <EmptyState
          heading="Your cart is empty"
          body="Browse the collection and add what you love."
          ctaLabel="Shop now"
          ctaHref="/shop"
        />
      </>
    )
  }

  return (
    <div>
      <div className="divide-y divide-brand-border px-4">
        {items.map((item) => (
          <CartLineItem
            key={item.variantSku}
            item={item}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
            disabled={isPending}
          />
        ))}
      </div>
      <StripeMotif height={2} />
      <CartSummary subtotal={subtotal} />
    </div>
  )
}
