import type { Metadata } from 'next'
import { VerifyEmailStatus } from './verify-email-status'

export const metadata: Metadata = { title: 'Verify email' }

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return (
    <div className="account-shell mx-auto flex max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-bold text-brand-ink">Verify email</h1>
      <VerifyEmailStatus token={token ?? ''} />
    </div>
  )
}
