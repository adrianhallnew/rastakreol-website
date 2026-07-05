import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentCustomer } from '../../../lib/auth/get-current-customer'
import { logoutAction } from './actions'
import { StripeMotif } from '../../../components/ui/StripeMotif'
import { buttonVariants } from '../../../components/ui/button-variants'
import { EmptyState } from '../../../components/ui/EmptyState'
import { formatPrice } from '../../../lib/format-price'
import { formatSCT } from '../../../lib/timezone/format'

export const metadata: Metadata = { title: 'My account' }

const infoLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
  { href: '/shipping', label: 'Shipping & Delivery' },
  { href: '/returns', label: 'Returns & Cancellations' },
  { href: '/orders-payments', label: 'Orders & Payments' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/privacy', label: 'Privacy Policy' },
]

function InfoLinks() {
  return (
    <ul className="mt-4 space-y-3">
      {infoLinks.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="text-sm font-medium text-brand-muted hover:text-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

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

export default async function AccountPage() {
  const customer = await getCurrentCustomer()

  if (!customer) {
    return (
      <div className="px-6 py-8">
        <h1 className="font-display text-2xl font-bold text-brand-ink">Account</h1>
        <p className="mt-2 text-brand-muted">
          Log in or create an account to view your orders and wishlist.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/account/login" className={buttonVariants({ variant: 'primary', size: 'md' })}>
            Log in
          </Link>
          <Link href="/account/register" className={buttonVariants({ variant: 'secondary', size: 'md' })}>
            Create account
          </Link>
        </div>

        <StripeMotif height={2} />

        <section className="py-6">
          <h2 className="font-display text-lg font-semibold text-brand-ink">Info</h2>
          <InfoLinks />
        </section>
      </div>
    )
  }

  const orders = await getCustomerOrders(customer.id)

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-brand-ink">{customer.name}</h1>
      <p className="text-sm text-brand-muted">{customer.email}</p>

      <StripeMotif height={2} />

      <section className="py-6">
        <h2 className="font-display text-lg font-semibold text-brand-ink">Orders</h2>
        {orders.length === 0 ? (
          <EmptyState heading="No orders yet" body="Your order history will show up here." />
        ) : (
          <ul className="mt-4 divide-y divide-brand-border">
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
      </section>

      <StripeMotif height={2} />

      <div className="flex flex-col gap-3 py-6">
        <Link href="/account/edit" className={buttonVariants({ variant: 'secondary', size: 'md' })}>
          Edit profile
        </Link>
        <Link href="/account/wishlist" className={buttonVariants({ variant: 'ghost', size: 'md' })}>
          My wishlist
        </Link>
        <form action={logoutAction}>
          <button type="submit" className={buttonVariants({ variant: 'ghost', size: 'md', className: 'w-full' })}>
            Sign out
          </button>
        </form>
      </div>

      <StripeMotif height={2} />

      <section className="py-6">
        <h2 className="font-display text-lg font-semibold text-brand-ink">Info</h2>
        <InfoLinks />
      </section>
    </div>
  )
}
