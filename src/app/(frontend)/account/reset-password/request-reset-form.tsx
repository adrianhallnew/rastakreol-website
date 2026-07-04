'use client'

import { useActionState } from 'react'
import { requestPasswordResetAction } from '../actions'
import { buttonVariants } from '../../../../components/ui/button-variants'
import { RequiredMark } from '../../../../components/ui/RequiredMark'

const inputClass = 'rounded-sm border border-brand-stone px-3 py-2 text-base min-h-11'
const labelClass = 'flex flex-col gap-1 text-sm text-brand-ink'

export function RequestResetForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, null)

  if (state?.success) {
    return (
      <p className="mt-6 text-brand-ink">
        If an account exists with that email, a reset link has been sent.
      </p>
    )
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <label className={labelClass}>
        <span>
          Email
          <RequiredMark />
        </span>
        <input name="email" type="email" required className={inputClass} />
      </label>
      {state?.success === false && (
        <p className="text-sm text-brand-error" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={buttonVariants({ variant: 'primary', size: 'lg' })}>
        {pending ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  )
}
