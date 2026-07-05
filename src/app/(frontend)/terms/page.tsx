import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using Rasta Kreol.',
}

export default function TermsPage() {
  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-brand-ink">Terms & Conditions</h1>
      <div className="mt-4 max-w-md space-y-4 text-brand-ink">
        <p>
          By using this site and placing an order, you agree to these terms. This is placeholder
          text — our full terms and conditions will be published here.
        </p>
        <p>
          In the meantime, if you have any questions about an order or how the site works, please
          contact us.
        </p>
      </div>
    </div>
  )
}
