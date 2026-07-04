'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '../../lib/cn'

interface QuantityStepperProps {
  quantity: number
  max: number
  onChange: (newQuantity: number) => void
  disabled?: boolean
}

const stepperButtonClass = cn(
  'flex h-11 w-11 items-center justify-center rounded-sm border border-brand-stone text-brand-ink',
  'disabled:opacity-40',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink',
)

export function QuantityStepper({ quantity, max, onChange, disabled }: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || quantity <= 1}
        onClick={() => onChange(quantity - 1)}
        className={stepperButtonClass}
      >
        <Minus aria-hidden="true" size={16} />
      </button>
      <span className="w-8 text-center text-brand-ink" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || quantity >= max}
        onClick={() => onChange(quantity + 1)}
        className={stepperButtonClass}
      >
        <Plus aria-hidden="true" size={16} />
      </button>
    </div>
  )
}
