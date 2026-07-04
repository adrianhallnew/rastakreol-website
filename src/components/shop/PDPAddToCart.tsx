'use client'

import { useState } from 'react'
import { StickyAddToCart } from '../layout/StickyAddToCart'
import { useToast } from '../ui/toast-provider'
import { useCartCount } from '../cart/CartCountProvider'
import { addToCartAction } from '../../lib/cart/actions'
import type { StickyAddToCartVariant } from '../layout/StickyAddToCart'

interface PDPAddToCartProps {
  productId: number
  variants: StickyAddToCartVariant[]
}

export function PDPAddToCart({ productId, variants }: PDPAddToCartProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'adding' | 'added'>('idle')
  const { toast } = useToast()
  const { setCount } = useCartCount()

  const handleAddToCart = async () => {
    const variant = variants.find((v) => v.size === selectedSize)
    if (!variant) return

    setStatus('adding')
    const result = await addToCartAction(productId, variant.sku, variant.size, 1)

    if (!result.success) {
      setStatus('idle')
      toast({ type: 'error', message: result.error })
      return
    }

    setStatus('added')
    toast({ type: 'success', message: 'Added to cart.' })
    setCount(result.cartCount)
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
