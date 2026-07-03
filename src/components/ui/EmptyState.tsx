import Link from 'next/link'
import { buttonVariants } from './button-variants'

interface EmptyStateProps {
  heading: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
}

export function EmptyState({ heading, body, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <h2 className="font-display text-xl font-semibold text-brand-ink">{heading}</h2>
      {body && <p className="mt-2 max-w-sm text-brand-muted">{body}</p>}
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className={buttonVariants({ variant: 'primary', size: 'md', className: 'mt-6' })}>
          {ctaLabel}
        </Link>
      )}
    </div>
  )
}
