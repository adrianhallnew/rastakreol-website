import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping & Delivery',
  description: 'Shipping and delivery information for Rasta Kreol orders.',
}

export default function ShippingPage() {
  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-brand-ink">Shipping & Delivery</h1>
      <div className="mt-4 max-w-md space-y-4 text-brand-ink">
        <p>We currently deliver locally within Seychelles only.</p>
        <p>
          Once your order is confirmed, we’ll be in touch to arrange delivery. Typical delivery
          times and any delivery fees will be confirmed with you directly before dispatch.
        </p>
        <p>
          If you have questions about delivery to your area, please get in touch before placing
          your order.
        </p>
      </div>
    </div>
  )
}
