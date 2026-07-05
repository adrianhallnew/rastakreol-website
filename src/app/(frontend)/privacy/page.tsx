import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Rasta Kreol handles your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="px-4 py-10">
      <h1 className="font-display text-2xl font-bold text-brand-ink">Privacy Policy</h1>
      <div className="mt-4 max-w-md space-y-4 text-brand-ink">
        <p>
          We collect the information needed to create your account, process orders, and get in
          touch about deliveries — such as your name, email, phone number, and delivery address.
        </p>
        <p>
          This is placeholder text — our full privacy policy will be published here, including
          details on data storage and your rights.
        </p>
        <p>If you have questions about your data, please contact us.</p>
      </div>
    </div>
  )
}
