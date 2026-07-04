'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { registerAction } from '../actions'
import { buttonVariants } from '../../../../components/ui/button-variants'
import { RequiredMark } from '../../../../components/ui/RequiredMark'

const inputClass = 'rounded-sm border border-brand-stone px-3 py-2 text-base min-h-11'
const labelClass = 'flex flex-col gap-1 text-sm text-brand-ink'

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, null)

  if (state?.success) {
    return (
      <p className="mt-6 text-brand-ink">
        Account created. Check your email for a verification link before logging in.
      </p>
    )
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <label className={labelClass}>
        <span>
          Name
          <RequiredMark />
        </span>
        <input name="name" type="text" required className={inputClass} />
      </label>
      <label className={labelClass}>
        <span>
          Email
          <RequiredMark />
        </span>
        <input name="email" type="email" required className={inputClass} />
      </label>
      <label className={labelClass}>
        <span>
          Password
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
        {pending ? 'Creating account…' : 'Create account'}
      </button>
      <p className="text-sm text-brand-muted">
        Already have an account?{' '}
        <Link href="/account/login" className="underline">
          Log in
        </Link>
      </p>
    </form>
  )
}
