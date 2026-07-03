'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingCart, Store, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { StripeMotif } from '../ui/StripeMotif'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/cn'

interface BottomNavProps {
  accountHref: string
  cartCount: number
}

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  isActive: (pathname: string) => boolean
}

export function BottomNav({ accountHref, cartCount }: BottomNavProps) {
  const pathname = usePathname()

  if (pathname.startsWith('/checkout')) return null

  const items: NavItem[] = [
    { label: 'Home', href: '/', icon: Home, isActive: (p) => p === '/' },
    { label: 'Shop', href: '/shop', icon: Store, isActive: (p) => p.startsWith('/shop') },
    {
      label: 'Cart',
      href: '/cart',
      icon: ShoppingCart,
      isActive: (p) => p.startsWith('/cart'),
    },
    { label: 'Account', href: accountHref, icon: User, isActive: (p) => p.startsWith('/account') },
  ]

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <StripeMotif height={4} />
      <nav
        aria-label="Main navigation"
        className="flex h-16 bg-brand-paper pb-[env(safe-area-inset-bottom)]"
      >
        {items.map((item) => {
          const active = item.isActive(pathname)
          const Icon = item.icon
          const showBadge = item.label === 'Cart' && cartCount > 0

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              aria-label={showBadge ? `${item.label}, ${cartCount} items` : item.label}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1',
                'transition-transform duration-micro ease-out-quart motion-reduce:transition-none active:scale-[0.93]',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink',
              )}
            >
              <span className="relative">
                <Icon
                  aria-hidden="true"
                  size={20}
                  fill={active ? 'currentColor' : 'none'}
                  className={active ? 'text-brand-green' : 'text-brand-muted'}
                />
                {showBadge && (
                  <span className="absolute -right-2 -top-2">
                    <Badge variant="count">{cartCount}</Badge>
                  </span>
                )}
              </span>
              <span
                className={cn(
                  'text-xs uppercase tracking-[0.04em]',
                  active ? 'font-medium text-brand-ink' : 'font-normal text-brand-muted',
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
