import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentCustomer } from '../../../../lib/auth/get-current-customer'
import { EmptyState } from '../../../../components/ui/EmptyState'
import { formatPrice } from '../../../../lib/format-price'
import { formatSCT } from '../../../../lib/timezone/format'

export const metadata: Metadata = { title: 'My Orders' }

async function getCustomerOrders(customerId: number) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'orders',
    where: { customer: { equals: customerId } },
    sort: '-createdAt',
    overrideAccess: true,
    limit: 50,
  })
  return result.docs
}

export default async function OrdersPage() {
  const customer = await getCurrentCustomer()
  if (!customer) redirect('/account/login')

  const orders = await getCustomerOrders(customer.id)

  return (
    <div className="px-6 py-12">
      <h1 className="font-display text-2xl font-bold text-brand-ink">My Orders</h1>
      {orders.length === 0 ? (
        <div className="mt-6">
          <EmptyState heading="No orders yet" body="Your order history will show up here." />
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-brand-border">
          {orders.map((order) => (
            <li key={order.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm text-brand-muted">{formatSCT(order.createdAt, { dateStyle: 'medium', timeStyle: undefined })}</p>
                <p className="font-medium text-brand-ink">{order.order_number}</p>
                <p className="text-sm capitalize text-brand-muted">{order.status}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-brand-ink">{formatPrice(order.total)}</span>
                <Link href={`/order/${order.id}`} className="text-sm font-medium text-brand-ink underline">
                  View →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
