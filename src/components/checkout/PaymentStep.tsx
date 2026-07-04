'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/Button'
import { useCartCount } from '../cart/CartCountProvider'
import { formatPrice } from '../../lib/format-price'
import { createOrderAction } from '../../lib/checkout/actions'

interface PaymentStepProps {
  subtotal: number
  shippingCost: number
  deliveryMethod: 'courier' | 'pickup'
  pickupLocationLabel: string | null
  onBack: () => void
}

// design.md 4.5: "Do not implement a payment form — MCB handles it." The button below is the
// real, final control — it just can't redirect to MCB's hosted page yet (API docs not
// received), so it creates the order as pending and sends the customer to /order/[id], which
// shows an honest "payment integration pending" notice instead of a fake success screen.
export function PaymentStep({ subtotal, shippingCost, deliveryMethod, pickupLocationLabel, onBack }: PaymentStepProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { setCount } = useCartCount()
  const total = subtotal + shippingCost

  const handlePay = () => {
    startTransition(async () => {
      const result = await createOrderAction(deliveryMethod, pickupLocationLabel)
      if (!result.success) {
        setError(result.error)
        return
      }
      setCount(0) // cart was just cleared server-side as part of order creation
      router.push(`/order/${result.orderId}`)
    })
  }

  return (
    <div className="mt-6">
      <div className="space-y-2 rounded-md border border-brand-stone p-4">
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Subtotal</span>
          <span className="text-brand-ink">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-muted">Shipping</span>
          <span className="text-brand-ink">{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
        </div>
        <div className="flex justify-between border-t border-brand-border pt-2 font-medium">
          <span className="text-brand-ink">Total</span>
          <span className="text-brand-ink">{formatPrice(total)}</span>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-brand-error" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <Button variant="secondary" size="lg" className="flex-1" onClick={onBack} disabled={isPending}>
          Back
        </Button>
        <Button size="lg" className="flex-1" loading={isPending} onClick={handlePay}>
          Pay {formatPrice(total)} with Mastercard →
        </Button>
      </div>
    </div>
  )
}
