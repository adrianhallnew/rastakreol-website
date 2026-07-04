'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'
import { formatPrice } from '../../lib/format-price'

export interface PickupLocation {
  name: string
  address: string
  island?: string | null
}

interface DeliveryStepProps {
  pickupLocations: PickupLocation[]
  courierRate: number
  freeShippingThreshold: number | null
  subtotal: number
  onContinue: (method: 'courier' | 'pickup', pickupLocationLabel: string | null) => void
  onBack: () => void
}

export function DeliveryStep({
  pickupLocations,
  courierRate,
  freeShippingThreshold,
  subtotal,
  onContinue,
  onBack,
}: DeliveryStepProps) {
  const [method, setMethod] = useState<'courier' | 'pickup'>('courier')
  const [pickupIndex, setPickupIndex] = useState(0)

  const freeShipping = freeShippingThreshold != null && subtotal >= freeShippingThreshold
  const canContinue = method === 'courier' || pickupLocations.length > 0

  const handleContinue = () => {
    if (method === 'pickup') {
      const location = pickupLocations[pickupIndex]
      onContinue('pickup', location ? `${location.name} — ${location.address}` : null)
    } else {
      onContinue('courier', null)
    }
  }

  return (
    <div className="mt-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="text-xs font-medium uppercase tracking-[0.08em] text-brand-muted">Delivery method</legend>

        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-sm border border-brand-stone px-3 py-2">
          <span className="flex items-center gap-3">
            <input
              type="radio"
              name="delivery-method"
              checked={method === 'courier'}
              onChange={() => setMethod('courier')}
              className="h-5 w-5 accent-brand-ink"
            />
            <span className="text-brand-ink">Courier</span>
          </span>
          <span className="text-sm text-brand-muted">{freeShipping ? 'Free' : formatPrice(courierRate)}</span>
        </label>

        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-sm border border-brand-stone px-3 py-2">
          <span className="flex items-center gap-3">
            <input
              type="radio"
              name="delivery-method"
              checked={method === 'pickup'}
              onChange={() => setMethod('pickup')}
              disabled={pickupLocations.length === 0}
              className="h-5 w-5 accent-brand-ink"
            />
            <span className="text-brand-ink">Pickup</span>
          </span>
          <span className="text-sm text-brand-muted">Free</span>
        </label>

        {method === 'pickup' && pickupLocations.length > 0 && (
          <label className="flex flex-col gap-1 text-sm text-brand-ink">
            Pickup location
            <select
              value={pickupIndex}
              onChange={(e) => setPickupIndex(Number(e.target.value))}
              className="min-h-11 rounded-sm border border-brand-stone px-3 py-2 text-base"
            >
              {pickupLocations.map((location, i) => (
                <option key={location.name} value={i}>
                  {location.name} — {location.address}
                </option>
              ))}
            </select>
          </label>
        )}
      </fieldset>

      <div className="mt-6 flex gap-3">
        <Button variant="secondary" size="lg" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button size="lg" className="flex-1" disabled={!canContinue} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}
