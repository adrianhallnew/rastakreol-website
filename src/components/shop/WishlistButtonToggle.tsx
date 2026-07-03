'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '../../lib/cn'

interface WishlistButtonToggleProps {
  productName: string
}

// Presentational only — no Wishlist collection mutation yet. Real persistence
// is batch 4's job, same handoff pattern as StickyAddToCart in batch 2.
export function WishlistButtonToggle({ productName }: WishlistButtonToggleProps) {
  const [saved, setSaved] = useState(false)

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from saved` : `Save ${productName}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setSaved((prev) => !prev)
      }}
      className={cn(
        'absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-sm bg-brand-cream/80',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink',
      )}
    >
      <Heart
        aria-hidden="true"
        size={20}
        fill={saved ? 'currentColor' : 'none'}
        className={saved ? 'text-brand-red' : 'text-brand-ink'}
      />
    </button>
  )
}
