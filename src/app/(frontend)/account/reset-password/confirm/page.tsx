import type { Metadata } from 'next'
import { ConfirmResetForm } from './confirm-reset-form'

export const metadata: Metadata = { title: 'Set new password' }

export default async function ResetPasswordConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return (
    <div className="account-shell mx-auto flex max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-bold text-brand-ink">Set new password</h1>
      <ConfirmResetForm token={token ?? ''} />
    </div>
  )
}
