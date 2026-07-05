import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Returns & Cancellations',
  description: 'Returns and cancellations policy for Rasta Kreol orders.',
}

export default function ReturnsPage() {
  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-brand-ink">Returns & Cancellations</h1>
      <div className="mt-4 max-w-md space-y-4 text-brand-ink">
        <p>
          If you need to cancel or make changes to an order, please contact us as soon as
          possible after placing it.
        </p>
        <p>
          If there’s an issue with an item you’ve received, get in touch and we’ll work with you
          to sort it out.
        </p>
        <p>This page will be updated with our full returns and cancellations policy.</p>
      </div>
    </div>
  )
}
