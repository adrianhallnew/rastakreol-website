'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { verifyEmailAction } from '../actions'

type Status = 'pending' | 'success' | 'error'

export function VerifyEmailStatus({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>(token ? 'pending' : 'error')
  const [error, setError] = useState(token ? '' : 'Missing verification token.')

  useEffect(() => {
    if (!token) return

    verifyEmailAction(token).then((result) => {
      if (result.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setError(result.error)
      }
    })
  }, [token])

  if (status === 'pending') {
    return <p className="mt-6 text-brand-muted">Verifying…</p>
  }

  if (status === 'error') {
    return <p className="mt-6 text-red-600">{error}</p>
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      <p className="text-brand-ink">Your email is verified.</p>
      <Link
        href="/account/login"
        className="rounded-md bg-brand-gold px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-brand-gold-warm"
      >
        Log in
      </Link>
    </div>
  )
}
