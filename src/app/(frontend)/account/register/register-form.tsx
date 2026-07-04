'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { registerAction } from '../actions'

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
      <label className="flex flex-col gap-1 text-sm text-brand-ink">
        Name
        <input name="name" type="text" required className="rounded-md border border-brand-ink/20 px-3 py-2 text-base" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-brand-ink">
        Email
        <input name="email" type="email" required className="rounded-md border border-brand-ink/20 px-3 py-2 text-base" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-brand-ink">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="rounded-md border border-brand-ink/20 px-3 py-2 text-base"
        />
      </label>
      {state?.success === false && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-gold px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-gold-warm disabled:opacity-50"
      >
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
