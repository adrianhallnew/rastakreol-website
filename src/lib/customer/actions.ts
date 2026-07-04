'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentCustomer } from '../auth/get-current-customer'

export type ProfileActionResult = { success: true } | { success: false; error: string }

// Shared between /account/edit's standalone form and checkout's Address step — checkout's
// address step both edits and saves the profile address, it isn't a separate copy of the data.
export async function updateProfileAction(
  _prevState: ProfileActionResult | null,
  formData: FormData,
): Promise<ProfileActionResult> {
  const customer = await getCurrentCustomer()
  if (!customer) return { success: false, error: 'Not logged in.' }

  const name = String(formData.get('name') ?? '')
  if (!name) return { success: false, error: 'Name is required.' }

  const payload = await getPayload({ config })

  try {
    await payload.update({
      collection: 'customers',
      id: customer.id,
      data: {
        name,
        phone: String(formData.get('phone') ?? ''),
        address_line1: String(formData.get('address_line1') ?? ''),
        address_line2: String(formData.get('address_line2') ?? ''),
        district: String(formData.get('district') ?? ''),
        island: (String(formData.get('island') ?? '') || undefined) as
          | 'mahe'
          | 'praslin'
          | 'la_digue'
          | 'other'
          | undefined,
      },
      overrideAccess: true,
    })
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Update failed.' }
  }
}
