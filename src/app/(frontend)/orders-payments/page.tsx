import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Orders & Payments',
  description: 'How ordering and payment works at Rasta Kreol.',
}

export default function OrdersPaymentsPage() {
  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-brand-ink">Orders & Payments</h1>
      <div className="mt-4 max-w-md space-y-4 text-brand-ink">
        <p>
          Online payment isn’t connected yet. When you place an order, it’s recorded as pending
          and we’ll be in touch directly to arrange payment.
        </p>
        <p>
          You can view your order history and status at any time from your account.
        </p>
        <p>This page will be updated once online payment is available.</p>
      </div>
    </div>
  )
}
