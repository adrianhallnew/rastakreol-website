import Link from 'next/link'
import { buttonVariants } from '../ui/button-variants'
import { formatPrice } from '../../lib/format-price'

interface CartSummaryProps {
  subtotal: number
}

export function CartSummary({ subtotal }: CartSummaryProps) {
  return (
    <div className="px-4 py-6">
      <p className="text-right text-lg font-medium text-brand-ink">Subtotal: {formatPrice(subtotal)}</p>
      <Link href="/checkout" className={buttonVariants({ variant: 'primary', size: 'lg', className: 'mt-4 w-full' })}>
        Checkout →
      </Link>
      <Link
        href="/shop"
        className={buttonVariants({ variant: 'ghost', size: 'md', className: 'mt-2 w-full text-brand-muted' })}
      >
        Continue shopping
      </Link>
    </div>
  )
}
