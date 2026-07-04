'use client'

import { useState, useSyncExternalStore } from 'react'
import { X } from 'lucide-react'

// djb2 — doesn't need to be cryptographic, just needs to change when the text changes
// (spec 3.14: dismiss key is `banner-dismissed-[hash of text]`, reappears if text changes).
function hashText(text: string): string {
  let hash = 5381
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i)
  }
  return (hash >>> 0).toString(36)
}

function noopSubscribe() {
  return () => {}
}

interface AnnouncementBannerProps {
  text: string
  link?: string | null
}

export function AnnouncementBanner({ text, link }: AnnouncementBannerProps) {
  const storageKey = `banner-dismissed-${hashText(text)}`
  // localStorage read must not happen during SSR — useSyncExternalStore handles the
  // server/client snapshot split without a manual effect+setState (which react-hooks/
  // set-state-in-effect correctly flags as a cascading-render risk).
  const storedDismissed = useSyncExternalStore(
    noopSubscribe,
    () => localStorage.getItem(storageKey) === 'true',
    () => true,
  )
  const [justDismissed, setJustDismissed] = useState(false)
  const dismissed = storedDismissed || justDismissed

  if (dismissed) return null

  const content = (
    <p className="text-sm text-brand-ink">
      {text}
      {link && <span className="ml-1 underline">Learn more</span>}
    </p>
  )

  return (
    <div className="flex items-center justify-between gap-3 bg-brand-gold/20 px-4 py-2">
      {link ? (
        <a href={link} className="flex-1">
          {content}
        </a>
      ) : (
        <div className="flex-1">{content}</div>
      )}
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          localStorage.setItem(storageKey, 'true')
          setJustDismissed(true)
        }}
        className="flex h-11 w-11 flex-none items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
      >
        <X aria-hidden="true" size={18} className="text-brand-ink" />
      </button>
    </div>
  )
}
