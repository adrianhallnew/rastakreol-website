'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { resetPasswordAction } from '../../actions'

export function ConfirmResetForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      router.push('/account')
      router.refresh()
    }
  }, [state, router])

  if (!token) {
    return <p className="mt-6 text-red-600">Missing reset token.</p>
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <label className="flex flex-col gap-1 text-sm text-brand-ink">
        New password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="rounded-md border border-brand-ink/20 px-3 py-2"
        />
      </label>
      {state?.success === false && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-gold px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-gold-warm disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Set password'}
      </button>
    </form>
  )
}
