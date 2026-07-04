'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfileAction } from '../../../../lib/customer/actions'
import { buttonVariants } from '../../../../components/ui/button-variants'
import { RequiredMark } from '../../../../components/ui/RequiredMark'
import type { Customer } from '../../../../payload-types'

const inputClass = 'rounded-sm border border-brand-stone px-3 py-2 text-base min-h-11'
const labelClass = 'flex flex-col gap-1 text-sm text-brand-ink'

export function EditProfileForm({ customer }: { customer: Customer }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      router.push('/account')
      router.refresh()
    }
  }, [state, router])

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-6">
      <fieldset className="flex flex-col gap-4">
        <legend className="text-xs font-medium uppercase tracking-[0.08em] text-brand-muted">Contact</legend>
        <label className={labelClass}>
          <span>
            Name
            <RequiredMark />
          </span>
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

      {state?.success === false && (
        <p className="text-sm text-brand-error" role="alert">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={buttonVariants({ variant: 'primary', size: 'lg' })}>
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
