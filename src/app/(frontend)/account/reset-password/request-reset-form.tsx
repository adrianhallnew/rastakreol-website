'use client'

import { useActionState } from 'react'
import { requestPasswordResetAction } from '../actions'

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
      <label className="flex flex-col gap-1 text-sm text-brand-ink">
        Email
        <input name="email" type="email" required className="rounded-md border border-brand-ink/20 px-3 py-2" />
      </label>
      {state?.success === false && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-gold px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-gold-warm disabled:opacity-50"
      >
        {pending ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  )
}
