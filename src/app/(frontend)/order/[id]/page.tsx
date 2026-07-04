import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Clock, PackageCheck, CircleDashed, AlertTriangle } from 'lucide-react'
import { getCurrentCustomer } from '../../../../lib/auth/get-current-customer'
import { StripeMotif } from '../../../../components/ui/StripeMotif'
import { buttonVariants } from '../../../../components/ui/button-variants'
import { formatPrice } from '../../../../lib/format-price'
import { ReviewForm } from '../../../../components/order/ReviewForm'
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

  const reviewedProductIds = new Set(
    order.status === 'delivered'
      ? (
          await payload.find({
            collection: 'reviews',
            where: { order: { equals: order.id } },
            overrideAccess: true,
            limit: 100,
            select: { product: true },
          })
        ).docs.map((r) => (typeof r.product === 'object' ? r.product.id : r.product))
      : [],
  )

  // Three real payment states, not a boolean — a `failed` order previously rendered
  // identically to a successful one (same green checkmark, "confirmed" copy), which was
  // actively misleading regardless of MCB being stubbed.
  const paymentState: 'pending' | 'failed' | 'completed' =
    order.payment_status === 'failed' ? 'failed' : order.payment_status === 'completed' ? 'completed' : 'pending'

  const stateCopy = {
    pending: {
      icon: <Clock aria-hidden="true" size={48} className="text-brand-ink" />,
      headline: 'Your order has been placed.',
      body: "Online payment isn't connected yet — we'll follow up to arrange payment. This order is saved and won't be lost.",
    },
    failed: {
      icon: <AlertTriangle aria-hidden="true" size={48} className="text-brand-error" />,
      headline: 'Payment did not go through.',
      body: "This order is saved, but payment wasn't completed. We'll be in touch to arrange another way to pay.",
    },
    completed: {
      icon: <PackageCheck aria-hidden="true" size={48} className="text-brand-green" />,
      headline: 'Your order is confirmed.',
      body: null,
    },
  }[paymentState]

  return (
    <div className="mx-auto max-w-md px-4 py-10 text-center">
      <p className="font-display text-2xl font-bold text-brand-ink">Rasta Kreol</p>
      <StripeMotif height={4} />

      <div className="mt-8 flex flex-col items-center">
        {stateCopy.icon}
        <p className="mt-3 text-sm font-medium text-brand-muted">{order.order_number}</p>
        <h1 className="mt-2 font-display text-xl font-semibold text-brand-ink">{stateCopy.headline}</h1>
        {stateCopy.body && <p className="mt-2 text-sm text-brand-muted">{stateCopy.body}</p>}
      </div>

      <ol className="mt-8 flex items-center justify-center gap-2 text-xs text-brand-muted">
        <li className="flex items-center gap-1 text-brand-green">
          <PackageCheck aria-hidden="true" size={16} /> Placed
        </li>
        <li aria-hidden="true">—</li>
        <li
          className={
            paymentState === 'failed'
              ? 'flex items-center gap-1 text-brand-error'
              : paymentState === 'completed'
                ? 'flex items-center gap-1 text-brand-green'
                : 'flex items-center gap-1 text-brand-ink'
          }
        >
          {paymentState === 'failed' ? (
            <AlertTriangle aria-hidden="true" size={16} />
          ) : paymentState === 'completed' ? (
            <PackageCheck aria-hidden="true" size={16} />
          ) : (
            <Clock aria-hidden="true" size={16} />
          )}{' '}
          Payment
        </li>
        <li aria-hidden="true">—</li>
        <li
          className={
            paymentState === 'completed'
              ? 'flex items-center gap-1 text-brand-green'
              : 'flex items-center gap-1 text-brand-muted'
          }
        >
          {paymentState === 'completed' ? (
            <PackageCheck aria-hidden="true" size={16} />
          ) : (
            <CircleDashed aria-hidden="true" size={16} />
          )}{' '}
          Confirmed
        </li>
      </ol>

      <div className="mt-6 text-left">
        <h2 className="font-display text-lg font-semibold text-brand-ink">Order summary</h2>
        <ul className="mt-3 divide-y divide-brand-border">
          {order.items.map((item, i) => {
            const product = typeof item.product === 'object' ? (item.product as Product) : null
            const canReview = order.status === 'delivered' && product && !reviewedProductIds.has(product.id)
            return (
              <li key={`${item.variant_sku}-${i}`} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-brand-ink">{product?.name ?? 'Product'}</p>
                    <p className="text-sm text-brand-muted">
                      Size {item.size} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-brand-ink">{formatPrice(item.unit_price * item.quantity)}</span>
                </div>
                {canReview && product && (
                  <ReviewForm orderId={order.id} productId={product.id} productName={product.name} />
                )}
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
