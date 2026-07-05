import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getCurrentCustomer } from '../../../lib/auth/get-current-customer'
import { logoutAction } from './actions'
import { StripeMotif } from '../../../components/ui/StripeMotif'
import { buttonVariants } from '../../../components/ui/button-variants'
import { cn } from '../../../lib/cn'

export const metadata: Metadata = { title: 'My account' }

const menuItems = [
  { href: '/account/orders', label: 'My Orders' },
  { href: '/account/address', label: 'My Address' },
  { href: '/account/edit', label: 'My Profile' },
  { href: '/account/wishlist', label: 'My Wishlist' },
  { href: '/account/info', label: 'Info' },
]

function MenuRow({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-between gap-3 py-4 text-brand-ink',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink',
      )}
    >
      <span className="font-medium">{label}</span>
      <ChevronRight aria-hidden="true" size={20} className="text-brand-muted" />
    </Link>
  )
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

        <Link
          href="/account/info"
          className="mt-6 inline-block text-sm font-medium text-brand-muted hover:text-brand-ink"
        >
          Info & policies
        </Link>
      </div>
    )
  }

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-brand-ink">{customer.name}</h1>
      <p className="text-sm text-brand-muted">{customer.email}</p>

      <StripeMotif height={2} />

      <nav className="divide-y divide-brand-border">
        {menuItems.map((item) => (
          <MenuRow key={item.href} href={item.href} label={item.label} />
        ))}
      </nav>

      <StripeMotif height={2} />

      <form action={logoutAction} className="py-6">
        <button type="submit" className={buttonVariants({ variant: 'ghost', size: 'md', className: 'w-full' })}>
          Sign out
        </button>
      </form>
    </div>
  )
}
