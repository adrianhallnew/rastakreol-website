import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentCustomer } from '../../../lib/auth/get-current-customer'
import { logoutAction } from './actions'

export const metadata: Metadata = { title: 'My account' }

export default async function AccountPage() {
  const customer = await getCurrentCustomer()

  if (!customer) {
    redirect('/account/login')
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-bold text-brand-ink">My account</h1>
      <p className="mt-4 text-brand-ink">{customer.name}</p>
      <p className="text-brand-muted">{customer.email}</p>
      <form action={logoutAction} className="mt-6">
        <button
          type="submit"
          className="rounded-md border border-brand-ink/20 px-6 py-3 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-ink/5"
        >
          Log out
        </button>
      </form>
    </div>
  )
}
