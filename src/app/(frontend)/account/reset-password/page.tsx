import type { Metadata } from 'next'
import { RequestResetForm } from './request-reset-form'

export const metadata: Metadata = { title: 'Reset password' }

export default function ResetPasswordPage() {
  return (
    <div className="account-shell mx-auto flex max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-bold text-brand-ink">Reset password</h1>
      <RequestResetForm />
    </div>
  )
}
