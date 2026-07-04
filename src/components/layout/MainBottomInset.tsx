'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

// Mirrors BottomNav's own /checkout pathname check — BottomNav hides itself there, so <main>
// shouldn't reserve space for a nav that isn't rendered.
export function MainBottomInset({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const hideBottomNav = pathname.startsWith('/checkout')

  return <main className={hideBottomNav ? undefined : 'main-bottom-inset'}>{children}</main>
}
