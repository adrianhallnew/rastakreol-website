import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Info' }

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

export default function InfoPage() {
  return (
    <div className="px-6 py-12">
      <h1 className="font-display text-2xl font-bold text-brand-ink">Info</h1>
      <ul className="mt-6 space-y-3">
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
    </div>
  )
}
