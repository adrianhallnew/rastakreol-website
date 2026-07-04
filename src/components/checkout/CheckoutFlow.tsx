'use client'

import { useState } from 'react'
import { AddressStep } from './AddressStep'
import { DeliveryStep } from './DeliveryStep'
import { PaymentStep } from './PaymentStep'
import type { PickupLocation } from './DeliveryStep'
import type { Customer } from '../../payload-types'

const STEP_LABELS = ['Delivery address', 'Delivery method', 'Payment']

interface CheckoutFlowProps {
  customer: Customer
  subtotal: number
  pickupLocations: PickupLocation[]
  courierRate: number
  freeShippingThreshold: number | null
}

export function CheckoutFlow({ customer, subtotal, pickupLocations, courierRate, freeShippingThreshold }: CheckoutFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup'>('courier')
  const [pickupLocationLabel, setPickupLocationLabel] = useState<string | null>(null)

  const freeShipping = freeShippingThreshold != null && subtotal >= freeShippingThreshold
  const shippingCost = deliveryMethod === 'courier' && !freeShipping ? courierRate : 0

  return (
    <div className="px-4 py-6">
      <p className="text-sm text-brand-muted">
        Step {step} of 3 — {STEP_LABELS[step - 1]}
      </p>

      {step === 1 && <AddressStep customer={customer} onContinue={() => setStep(2)} />}

      {step === 2 && (
        <DeliveryStep
          pickupLocations={pickupLocations}
          courierRate={courierRate}
          freeShippingThreshold={freeShippingThreshold}
          subtotal={subtotal}
          onBack={() => setStep(1)}
          onContinue={(method, label) => {
            setDeliveryMethod(method)
            setPickupLocationLabel(label)
            setStep(3)
          }}
        />
      )}

      {step === 3 && (
        <PaymentStep
          subtotal={subtotal}
          shippingCost={shippingCost}
          deliveryMethod={deliveryMethod}
          pickupLocationLabel={pickupLocationLabel}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  )
}
