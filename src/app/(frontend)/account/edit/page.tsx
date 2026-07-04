import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentCustomer } from '../../../../lib/auth/get-current-customer'
import { EditProfileForm } from './edit-profile-form'

export const metadata: Metadata = { title: 'Edit profile' }

export default async function EditProfilePage() {
  const customer = await getCurrentCustomer()
  if (!customer) redirect('/account/login')

  return (
    <div className="px-6 py-12">
      <h1 className="font-display text-2xl font-bold text-brand-ink">Edit profile</h1>
      <EditProfileForm customer={customer} />
    </div>
  )
}
