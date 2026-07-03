'use client'

import { Check, Info, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { ToastType } from './toast-provider'

const iconByType: Record<ToastType, typeof Check> = {
  success: Check,
  error: X,
  info: Info,
}

const iconColorByType: Record<ToastType, string> = {
  success: 'text-brand-success',
  error: 'text-brand-error',
  info: 'text-brand-teal',
}

interface ToastProps {
  type: ToastType
  message: string
  visible: boolean
  onDismiss: () => void
  onPause: () => void
  onResume: () => void
}

export function Toast({ type, message, visible, onDismiss, onPause, onResume }: ToastProps) {
  const Icon = iconByType[type]

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocus={onPause}
      onBlur={onResume}
      className={cn(
        'flex min-h-12 w-full max-w-sm items-center gap-3 rounded-md bg-brand-ink px-4 py-3 text-white shadow-raised',
        'transition-[transform,opacity] duration-[280ms] ease-out-quint motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 duration-state ease-in-expo',
      )}
    >
      <Icon aria-hidden="true" size={20} className={cn('flex-none', iconColorByType[type])} />
      <p className="flex-1 text-sm">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className={cn(
          'flex h-11 w-11 flex-none items-center justify-center rounded-sm -mr-3',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
        )}
      >
        <X aria-hidden="true" size={16} />
      </button>
    </div>
  )
}
