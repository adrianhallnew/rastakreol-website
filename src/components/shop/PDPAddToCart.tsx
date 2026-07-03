'use client'

import { useState } from 'react'
import { StickyAddToCart } from '../layout/StickyAddToCart'
import { useToast } from '../ui/toast-provider'
import type { StickyAddToCartVariant } from '../layout/StickyAddToCart'

interface PDPAddToCartProps {
  variants: StickyAddToCartVariant[]
}

// No Cart collection mutation yet — real persistence is batch 4. Shows a
// confirmation toast so the interaction still feels complete in the meantime.
export function PDPAddToCart({ variants }: PDPAddToCartProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'adding' | 'added'>('idle')
  const { toast } = useToast()

  const handleAddToCart = () => {
    setStatus('adding')
    setTimeout(() => {
      setStatus('added')
      toast({ type: 'success', message: 'Added to cart.' })
    }, 400)
    setTimeout(() => setStatus('idle'), 2400)
  }

  return (
    <StickyAddToCart
      variants={variants}
      selectedSize={selectedSize}
      onSelectSize={setSelectedSize}
      onAddToCart={handleAddToCart}
      status={status}
    />
  )
}
