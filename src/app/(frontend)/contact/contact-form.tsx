'use client'

import { useActionState } from 'react'
import { submitContactAction } from '../../../lib/contact/actions'

const inputClass = 'rounded-md border border-brand-ink/20 px-3 py-2 text-base min-h-11'
const labelClass = 'flex flex-col gap-1 text-sm text-brand-ink'

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactAction, null)

  if (state?.success) {
    return <p className="mt-6 text-brand-ink">Thanks for reaching out — we&apos;ll get back to you soon.</p>
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <label className={labelClass}>
        Name
        <input name="name" type="text" required className={inputClass} />
      </label>
      <label className={labelClass}>
        Email
        <input name="email" type="email" required className={inputClass} />
      </label>
      <label className={labelClass}>
        Subject
        <input name="subject" type="text" required className={inputClass} />
      </label>
      <label className={labelClass}>
        Message
        <textarea name="message" required rows={5} className={inputClass} />
      </label>

      {state?.success === false && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-gold px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-gold-warm disabled:opacity-50"
      >
        {pending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
