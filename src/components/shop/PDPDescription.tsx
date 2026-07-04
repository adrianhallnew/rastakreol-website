'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'

export function PDPDescription({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <div
        id="pdp-description-content"
        className="max-w-[65ch] space-y-3 overflow-hidden text-brand-ink"
        style={{ maxHeight: expanded ? 'none' : '6rem' }}
      >
        {children}
      </div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="pdp-description-content"
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 text-sm font-medium text-brand-muted underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
      >
        {expanded ? 'Show less' : 'Read more'}
      </button>
    </div>
  )
}
