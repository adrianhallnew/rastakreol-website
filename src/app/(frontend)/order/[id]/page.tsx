import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Clock, PackageCheck, CircleDashed } from 'lucide-react'
import { getCurrentCustomer } from '../../../../lib/auth/get-current-customer'
import { StripeMotif } from '../../../../components/ui/StripeMotif'
import { buttonVariants } from '../../../../components/ui/button-variants'
import { formatPrice } from '../../../../lib/format-price'
import type { Product } from '../../../../payload-types'

type Params = Promise<{ id: string }>

export const metadata: Metadata = { title: 'Order confirmation' }

export default async function OrderConfirmationPage({ params }: { params: Params }) {
  const { id } = await params
  const customer = await getCurrentCustomer()
  if (!customer) redirect('/account/login')

  const payload = await getPayload({ config })
  let order
  try {
    order = await payload.findByID({ collection: 'orders', id, depth: 1, overrideAccess: true })
  } catch {
    notFound()
  }

  // Storefront view is customer-only — staff use the admin panel instead. Don't leak
  // existence of another customer's order.
  const orderCustomerId = typeof order.customer === 'object' ? order.customer.id : order.customer
  if (orderCustomerId !== customer.id) notFound()

  const paymentPending = order.payment_status === 'pending'

  return (
    <div className="mx-auto max-w-md px-4 py-10 text-center">
      <p className="font-display text-2xl font-bold text-brand-ink">Rasta Kreol</p>
      <StripeMotif height={4} />

      <div className="mt-8 flex flex-col items-center">
        {paymentPending ? (
          <Clock aria-hidden="true" size={48} className="text-brand-warning" />
        ) : (
          <PackageCheck aria-hidden="true" size={48} className="text-brand-green" />
        )}
        <p className="mt-3 text-sm font-medium text-brand-muted">{order.order_number}</p>
        <h1 className="mt-2 font-display text-xl font-semibold text-brand-ink">
          {paymentPending ? 'Your order has been placed.' : 'Your order is confirmed.'}
        </h1>
        {paymentPending && (
          <p className="mt-2 text-sm text-brand-muted">
            Online payment isn&apos;t connected yet — we&apos;ll follow up to arrange payment. This order is saved and won&apos;t be lost.
          </p>
        )}
      </div>

      <ol className="mt-8 flex items-center justify-center gap-2 text-xs text-brand-muted">
        <li className="flex items-center gap-1 text-brand-green">
          <PackageCheck aria-hidden="true" size={16} /> Placed
        </li>
        <li aria-hidden="true">—</li>
        <li className={paymentPending ? 'flex items-center gap-1 text-brand-warning' : 'flex items-center gap-1 text-brand-green'}>
          {paymentPending ? <Clock aria-hidden="true" size={16} /> : <PackageCheck aria-hidden="true" size={16} />} Payment
        </li>
        <li aria-hidden="true">—</li>
        <li className="flex items-center gap-1 text-brand-muted">
          <CircleDashed aria-hidden="true" size={16} /> Confirmed
        </li>
      </ol>

      <StripeMotif height={2} />

      <div className="mt-6 text-left">
        <h2 className="font-display text-lg font-semibold text-brand-ink">Order summary</h2>
        <ul className="mt-3 divide-y divide-brand-border">
          {order.items.map((item, i) => {
            const product = typeof item.product === 'object' ? (item.product as Product) : null
            return (
              <li key={`${item.variant_sku}-${i}`} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium text-brand-ink">{product?.name ?? 'Product'}</p>
                  <p className="text-sm text-brand-muted">
                    Size {item.size} × {item.quantity}
                  </p>
                </div>
                <span className="text-brand-ink">{formatPrice(item.unit_price * item.quantity)}</span>
              </li>
            )
          })}
        </ul>
        <div className="mt-3 flex justify-between border-t border-brand-border pt-3 font-medium">
          <span className="text-brand-ink">Total</span>
          <span className="text-brand-ink">{formatPrice(order.total)}</span>
        </div>
      </div>

      <StripeMotif height={4} />

      <Link href="/shop" className={buttonVariants({ variant: 'secondary', size: 'lg', className: 'mt-6' })}>
        Back to shop
      </Link>
    </div>
  )
}
