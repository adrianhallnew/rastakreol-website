'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateAddressAction } from '../../../../lib/customer/actions'
import { buttonVariants } from '../../../../components/ui/button-variants'
import { DeliveryAddressFields } from '../../../../components/customer/DeliveryAddressFields'
import type { Customer } from '../../../../payload-types'

export function AddressForm({ customer }: { customer: Customer }) {
  const [state, formAction, pending] = useActionState(updateAddressAction, null)
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
        <legend className="text-xs font-medium uppercase tracking-[0.08em] text-brand-muted">Delivery address</legend>
        <DeliveryAddressFields customer={customer} />
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
