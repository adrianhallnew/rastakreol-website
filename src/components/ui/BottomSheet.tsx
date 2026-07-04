'use client'

import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent, PointerEvent, ReactNode } from 'react'
import { cn } from '../../lib/cn'

const EXIT_MS = 260
const SWIPE_VELOCITY_THRESHOLD = 0.11 // px/ms — design.md §3.4
const SWIPE_DISTANCE_RATIO = 0.4 // fraction of sheet height that also triggers close

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  ariaLabel: string
  children: ReactNode
}

export function BottomSheet({ open, onClose, ariaLabel, children }: BottomSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const dragState = useRef<{ startY: number; startTime: number; dragging: boolean } | null>(null)

  const requestClose = () => {
    setVisible(false)
    window.setTimeout(() => dialogRef.current?.close(), EXIT_MS)
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      if (!dialog.open) dialog.showModal()
      // showModal()'s native default-focus behavior (focus the first focusable
      // descendant) can drag the browser's own scroll-into-view behavior along with
      // it — on a long scrollable sheet on mobile Safari this was observed opening
      // already scrolled partway down instead of showing the top. Take focus
      // management back explicitly: focus the sheet itself (not a descendant, so
      // there's nothing for the browser to scroll to) with `preventScroll`, and
      // force the internal scroll position to the top regardless.
      sheetRef.current?.focus({ preventScroll: true })
      if (sheetRef.current) sheetRef.current.scrollTop = 0
      const raf = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(raf)
    }

    if (dialog.open) requestClose()
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => onClose()
    const handleCancel = (event: Event) => {
      // Intercept Esc so the sheet gets its own exit animation instead of
      // vanishing instantly (native <dialog> default behavior on Esc).
      event.preventDefault()
      requestClose()
    }

    dialog.addEventListener('close', handleClose)
    dialog.addEventListener('cancel', handleCancel)
    return () => {
      dialog.removeEventListener('close', handleClose)
      dialog.removeEventListener('cancel', handleCancel)
    }
  }, [onClose])

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) requestClose()
  }

  // Native <dialog> in showModal() keeps the background inert, but does not
  // reliably wrap Tab/Shift+Tab back to the first/last focusable descendant —
  // without this, Tab from the last element lands on <body>, escaping the trap.
  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return
    const dialog = dialogRef.current
    if (!dialog) return

    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragState.current = { startY: event.clientY, startTime: performance.now(), dragging: true }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current
    const sheet = sheetRef.current
    if (!drag?.dragging || !sheet) return
    const delta = Math.max(0, event.clientY - drag.startY)
    sheet.style.transition = 'none'
    sheet.style.transform = `translateY(${delta}px)`
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current
    const sheet = sheetRef.current
    if (!drag?.dragging || !sheet) return
    dragState.current = null

    const delta = Math.max(0, event.clientY - drag.startY)
    const duration = Math.max(1, performance.now() - drag.startTime)
    const velocity = delta / duration
    const sheetHeight = sheet.offsetHeight || 1

    sheet.style.transition = ''
    sheet.style.transform = ''

    if (velocity >= SWIPE_VELOCITY_THRESHOLD || delta / sheetHeight >= SWIPE_DISTANCE_RATIO) {
      requestClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={ariaLabel}
      aria-modal="true"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'm-0 max-h-none max-w-none p-0 backdrop:bg-brand-ink/50',
        'backdrop:transition-opacity backdrop:duration-[240ms] backdrop:ease-out-quart',
        'motion-reduce:[&::backdrop]:transition-none',
      )}
      // dvh/dvw (dynamic viewport), not vh/vw — a <dialog>'s own layout algorithm doesn't
      // reliably auto-stretch to fill `inset: 0` the way a plain div does (its only child
      // here is itself position:absolute, contributing no intrinsic size), so omitting
      // width/height outright collapsed it to 0×0. dvh/dvw track the real CURRENT visual
      // viewport reactively as browser chrome shows/hides — unlike static vh (sized
      // against the LARGEST possible viewport, chrome hidden, which on iOS Safari with
      // chrome showing made the dialog taller than the real screen and anchored the
      // bottom-0 sheet below the actually visible bottom).
      style={{ position: 'fixed', inset: 0, width: '100dvw', height: '100dvh', background: 'transparent', border: 0 }}
    >
      <div
        ref={sheetRef}
        tabIndex={-1}
        className={cn(
          // `fixed`, not `absolute` — an `absolute` child resolves `bottom-0` against
          // the DIALOG's own box, and on real iOS Safari that box's inline 100dvh can
          // paint at a stale/small size for one frame right after showModal() (before
          // WebKit finishes recalculating the dynamic viewport), pinning this sheet near
          // the top showing only its tail end until a later touch/scroll forces a
          // relayout. A `fixed` ancestor does NOT establish a containing block for a
          // `fixed` descendant (only transform/filter/perspective/will-change/contain
          // do, and none of those sit between this div and the dialog) — so `fixed`
          // here resolves straight against the true viewport regardless of whatever
          // size the dialog's own box has at that instant.
          //
          // svh, not vh — plain vh on iOS Safari is based on the LARGEST possible
          // viewport (chrome hidden), so 85vh can visually eat almost the entire
          // visible screen while the browser's own chrome is showing, reading as
          // "slides to the top" instead of a proper bottom sheet. svh is pinned to
          // the smallest possible viewport, so the cap holds regardless of chrome state.
          'fixed inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto rounded-t-lg bg-brand-paper shadow-sheet',
          'transition-transform ease-drawer motion-reduce:transition-none',
          visible
            ? 'translate-y-0 duration-[var(--motion-layout)]'
            : 'translate-y-full duration-[var(--motion-layout-out)] ease-in-expo',
        )}
        // Bottom clearance for the device's own gesture bar/home indicator — 0 on most
        // Android, nonzero on iOS and some Android. Lives here (not in each sheet's own
        // content) so every BottomSheet consumer gets it for free, same reasoning as
        // BottomNav's env(safe-area-inset-bottom) handling in styles.css.
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex touch-none justify-center py-3"
        >
          <div className="h-1 w-8 rounded-full bg-brand-border" aria-hidden="true" />
        </div>
        {children}
      </div>
    </dialog>
  )
}
