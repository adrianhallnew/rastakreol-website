'use client'

import { useState, useTransition } from 'react'
import { Star } from 'lucide-react'
import { Button } from '../ui/Button'
import { submitReviewAction } from '../../lib/reviews/actions'

interface ReviewFormProps {
  orderId: number
  productId: number
  productName: string
}

export function ReviewForm({ orderId, productId, productName }: ReviewFormProps) {
  const [rating, setRating] = useState<'1' | '2' | '3' | '4' | '5'>('5')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (submitted) {
    return <p className="text-sm text-brand-muted">Thanks — your review is awaiting approval.</p>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const result = await submitReviewAction(orderId, productId, rating, title, body)
      if (!result.success) {
        setError(result.error)
        return
      }
      setSubmitted(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 rounded-md border border-brand-border p-3 text-left">
      <p className="text-sm font-medium text-brand-ink">Write a review — {productName}</p>

      <fieldset className="flex items-center gap-1">
        <legend className="sr-only">Rating</legend>
        {(['1', '2', '3', '4', '5'] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`${value} star${value === '1' ? '' : 's'}`}
            aria-pressed={Number(rating) >= Number(value)}
            onClick={() => setRating(value)}
            className="flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
          >
            <Star
              aria-hidden="true"
              size={20}
              fill={Number(rating) >= Number(value) ? 'currentColor' : 'none'}
              className="text-brand-ink"
            />
          </button>
        ))}
      </fieldset>

      <label className="flex flex-col gap-1 text-sm text-brand-ink">
        Title (optional)
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="min-h-11 rounded-md border border-brand-ink/20 px-3 py-2 text-base"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-brand-ink">
        Review
        <textarea
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="rounded-md border border-brand-ink/20 px-3 py-2 text-base"
        />
      </label>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" size="md" loading={isPending}>
        Submit review
      </Button>
    </form>
  )
}
