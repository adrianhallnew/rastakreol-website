'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginAction } from '../actions'

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(loginAction, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      router.push(redirectTo)
      router.refresh()
    }
  }, [state, redirectTo, router])

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
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
          className="rounded-md border border-brand-ink/20 px-3 py-2 text-base"
        />
      </label>
      {state?.success === false && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-gold px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-gold-warm disabled:opacity-50"
      >
        {pending ? 'Logging in…' : 'Log in'}
      </button>
      <a
        href={`/api/customers/oauth/google?redirect=${encodeURIComponent(redirectTo)}`}
        className="flex items-center justify-center gap-2 rounded-md border border-brand-ink/20 px-6 py-3 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-ink/5"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615Z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.71A5.41 5.41 0 0 1 3.68 9c0-.593.102-1.17.284-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
          />
        </svg>
        Continue with Google
      </a>
      <div className="flex justify-between text-sm text-brand-muted">
        <Link href="/account/register" className="underline">
          Create account
        </Link>
        <Link href="/account/reset-password" className="underline">
          Forgot password?
        </Link>
      </div>
    </form>
  )
}
