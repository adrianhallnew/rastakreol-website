'use client'

import { useActionState, useEffect } from 'react'
import { updateProfileAction } from '../../lib/customer/actions'
import { Button } from '../ui/Button'
import type { Customer } from '../../payload-types'

const inputClass = 'rounded-md border border-brand-ink/20 px-3 py-2 text-base min-h-11'
const labelClass = 'flex flex-col gap-1 text-sm text-brand-ink'

interface AddressStepProps {
  customer: Customer
  onContinue: () => void
}

// Reuses updateProfileAction directly (same one /account/edit uses) — checkout's address
// step both edits and saves the profile address, it isn't a separate copy of the data.
export function AddressStep({ customer, onContinue }: AddressStepProps) {
  const [state, formAction, pending] = useActionState(updateProfileAction, null)

  useEffect(() => {
    if (state?.success) onContinue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-6">
      <fieldset className="flex flex-col gap-4">
        <legend className="text-xs font-medium uppercase tracking-[0.08em] text-brand-muted">Contact</legend>
        <label className={labelClass}>
          Name
          <input name="name" type="text" required defaultValue={customer.name} className={inputClass} />
        </label>
        <label className={labelClass}>
          Phone
          <input name="phone" type="tel" defaultValue={customer.phone ?? ''} className={inputClass} />
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-xs font-medium uppercase tracking-[0.08em] text-brand-muted">Delivery address</legend>
        <label className={labelClass}>
          Address line 1
          <input name="address_line1" type="text" defaultValue={customer.address_line1 ?? ''} className={inputClass} />
        </label>
        <label className={labelClass}>
          Address line 2
          <input name="address_line2" type="text" defaultValue={customer.address_line2 ?? ''} className={inputClass} />
        </label>
        <label className={labelClass}>
          District
          <input name="district" type="text" defaultValue={customer.district ?? ''} className={inputClass} />
        </label>
        <label className={labelClass}>
          Island
          <select name="island" defaultValue={customer.island ?? ''} className={inputClass}>
            <option value="">Select an island</option>
            <option value="mahe">Mahé</option>
            <option value="praslin">Praslin</option>
            <option value="la_digue">La Digue</option>
            <option value="other">Other</option>
          </select>
        </label>
      </fieldset>

      {state?.success === false && <p className="text-sm text-red-600" role="alert">{state.error}</p>}

      <Button type="submit" size="lg" loading={pending} className="w-full">
        Continue
      </Button>
    </form>
  )
}
