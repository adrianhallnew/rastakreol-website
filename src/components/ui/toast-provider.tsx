'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Toast } from './Toast'

export type ToastType = 'success' | 'error' | 'info'

interface ToastOptions {
  type: ToastType
  message: string
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const AUTO_DISMISS_MS = 4000
const EXIT_MS = 200

export function ToastProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<(ToastOptions & { id: number }) | null>(null)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
  }

  const startAutoDismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setVisible(false)
      exitTimerRef.current = setTimeout(() => setCurrent(null), EXIT_MS)
    }, AUTO_DISMISS_MS)
  }, [])

  const toast = useCallback(
    ({ type, message }: ToastOptions) => {
      clearTimers()
      // design.md §3.6: max 1 visible at once — a new toast replaces whatever is showing.
      setCurrent({ type, message, id: Date.now() })
      setVisible(true)
      startAutoDismiss()
    },
    [startAutoDismiss],
  )

  const dismiss = useCallback(() => {
    clearTimers()
    setVisible(false)
    exitTimerRef.current = setTimeout(() => setCurrent(null), EXIT_MS)
  }, [])

  const pause = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const resume = useCallback(() => {
    if (current) startAutoDismiss()
  }, [current, startAutoDismiss])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 z-40 flex justify-center px-4"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        {current && (
          <div className="pointer-events-auto">
            <Toast
              type={current.type}
              message={current.message}
              visible={visible}
              onDismiss={dismiss}
              onPause={pause}
              onResume={resume}
            />
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
