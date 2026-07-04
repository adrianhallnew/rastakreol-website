'use client'

import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface CartCountContextValue {
  count: number
  setCount: (count: number) => void
}

const CartCountContext = createContext<CartCountContextValue | null>(null)

// Server-rendered nav badge (TopNav/BottomNav) needs to update after a cart mutation
// without a full router.refresh() re-running the entire layout's data fetches just to
// refresh one integer — mutating actions return the new count, callers push it in here.
export function CartCountProvider({ initialCount, children }: { initialCount: number; children: ReactNode }) {
  const [count, setCount] = useState(initialCount)
  return <CartCountContext.Provider value={{ count, setCount }}>{children}</CartCountContext.Provider>
}

export function useCartCount(): CartCountContextValue {
  const ctx = useContext(CartCountContext)
  if (!ctx) throw new Error('useCartCount must be used within a CartCountProvider')
  return ctx
}
