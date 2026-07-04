'use client'

import Link from 'next/link'
import { buttonVariants } from '../../components/ui/button-variants'

export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 py-24 text-center">
      <h1 className="font-display text-xl font-semibold text-brand-ink">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-brand-muted">
        We hit a snag loading this page. Try again, or head back to the shop.
      </p>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={reset} className={buttonVariants({ variant: 'secondary', size: 'md' })}>
          Try again
        </button>
        <Link href="/" className={buttonVariants({ variant: 'primary', size: 'md' })}>
          Back to home
        </Link>
      </div>
    </div>
  )
}
