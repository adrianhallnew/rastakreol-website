'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User } from 'lucide-react'
import { StripeMotif } from '../ui/StripeMotif'
import { cn } from '../../lib/cn'

interface TopNavProps {
  accountHref: string
  cartCount: number
}

const desktopLinks = [
  { label: 'Home', href: '/', isActive: (p: string) => p === '/' },
  { label: 'Shop', href: '/shop', isActive: (p: string) => p.startsWith('/shop') },
]

export function TopNav({ accountHref, cartCount }: TopNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="sticky top-0 z-40">
      <nav
        aria-label="Primary"
        className={cn(
          'flex h-14 items-center justify-between bg-brand-paper px-4',
          'transition-shadow duration-[var(--motion-micro)] ease-out-quart motion-reduce:transition-none',
          scrolled && 'shadow-sticky',
        )}
      >
        <Link
          href="/"
          aria-label="Rasta Kreol home"
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-sm',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink',
          )}
        >
          <Image src="/logo.jpeg" alt="Rasta Kreol" width={32} height={32} className="rounded-full" priority />
        </Link>

        {/* Primary nav lives in BottomNav on mobile; at md:+ BottomNav hides, so this
            carries the same job — avoids duplicating Home/Shop/Account on small screens. */}
        <div className="hidden items-center gap-6 md:flex">
          {desktopLinks.map((link) => {
            const active = link.isActive(pathname)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-sm text-sm font-medium underline-offset-4',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink',
                  active ? 'text-brand-ink underline' : 'text-brand-muted no-underline hover:text-brand-ink',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/cart"
            aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-sm text-brand-ink',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink',
            )}
          >
            <ShoppingCart aria-hidden="true" size={22} />
          </Link>
          <Link
            href={accountHref}
            aria-label="Account"
            className={cn(
              'hidden h-11 w-11 items-center justify-center rounded-sm text-brand-ink md:flex',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink',
            )}
          >
            <User aria-hidden="true" size={22} />
          </Link>
        </div>
      </nav>
      <StripeMotif height={4} />
    </div>
  )
}
