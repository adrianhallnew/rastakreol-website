import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentCustomer } from '../../../../lib/auth/get-current-customer'
import { AddressForm } from './address-form'

export const metadata: Metadata = { title: 'My Address' }

export default async function AddressPage() {
  const customer = await getCurrentCustomer()
  if (!customer) redirect('/account/login')

  return (
    <div className="px-6 py-12">
      <h1 className="font-display text-2xl font-bold text-brand-ink">My Address</h1>
      <AddressForm customer={customer} />
    </div>
  )
}
