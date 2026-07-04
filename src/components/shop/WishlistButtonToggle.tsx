'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useToast } from '../ui/toast-provider'
import { toggleWishlistAction } from '../../lib/wishlist/actions'

interface WishlistButtonToggleProps {
  productId: number
  productName: string
  initiallySaved: boolean
}

export function WishlistButtonToggle({ productId, productName, initiallySaved }: WishlistButtonToggleProps) {
  const [saved, setSaved] = useState(initiallySaved)
  const [pending, setPending] = useState(false)
  const { toast } = useToast()

  const handleClick = async () => {
    if (pending) return

    setPending(true)
    const result = await toggleWishlistAction(productId)
    setPending(false)

    if (!result.success) {
      if (result.needsLogin) {
        toast({ type: 'info', message: 'Log in to save items to your wishlist.' })
      } else {
        toast({ type: 'error', message: result.error })
      }
      return
    }

    setSaved(result.saved)
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from saved` : `Save ${productName}`}
      onClick={handleClick}
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
