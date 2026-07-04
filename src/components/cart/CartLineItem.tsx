'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'
import { QuantityStepper } from './QuantityStepper'
import { formatPrice } from '../../lib/format-price'

export interface CartLineItemData {
  variantSku: string
  productSlug: string
  productName: string
  size: string
  quantity: number
  priceSnapshot: number
  imageUrl?: string
  imageAlt?: string
  maxStock: number
}

interface CartLineItemProps {
  item: CartLineItemData
  onQuantityChange: (variantSku: string, quantity: number) => void
  onRemove: (variantSku: string) => void
  disabled?: boolean
}

export function CartLineItem({ item, onQuantityChange, onRemove, disabled }: CartLineItemProps) {
  return (
    <div className="flex gap-3 py-4">
      <Link href={`/products/${item.productSlug}`} className="relative h-20 w-16 flex-none overflow-hidden rounded-sm bg-brand-paper">
        {item.imageUrl && (
          <Image src={item.imageUrl} alt={item.imageAlt ?? item.productName} fill unoptimized sizes="64px" className="object-cover" />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/products/${item.productSlug}`} className="font-medium text-brand-ink hover:underline">
              {item.productName}
            </Link>
            <p className="text-sm text-brand-muted">Size {item.size}</p>
          </div>
          <button
            type="button"
            aria-label={`Remove ${item.productName} from cart`}
            disabled={disabled}
            onClick={() => onRemove(item.variantSku)}
            className="flex h-11 w-11 flex-none items-center justify-center text-brand-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <QuantityStepper
            quantity={item.quantity}
            max={item.maxStock}
            disabled={disabled}
            onChange={(q) => onQuantityChange(item.variantSku, q)}
          />
          <span className="font-medium text-brand-ink">{formatPrice(item.priceSnapshot * item.quantity)}</span>
        </div>
      </div>
    </div>
  )
}
