'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { resetPasswordAction } from '../../actions'
import { buttonVariants } from '../../../../../components/ui/button-variants'
import { RequiredMark } from '../../../../../components/ui/RequiredMark'

const inputClass = 'rounded-sm border border-brand-stone px-3 py-2 text-base min-h-11'
const labelClass = 'flex flex-col gap-1 text-sm text-brand-ink'

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
    return (
      <p className="mt-6 text-brand-error" role="alert">
        Missing reset token.
      </p>
    )
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <label className={labelClass}>
        <span>
          New password
          <RequiredMark />
        </span>
        <input name="password" type="password" required minLength={8} className={inputClass} />
      </label>
      {state?.success === false && (
        <p className="text-sm text-brand-error" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={buttonVariants({ variant: 'primary', size: 'lg' })}>
        {pending ? 'Saving…' : 'Set password'}
      </button>
    </form>
  )
}
