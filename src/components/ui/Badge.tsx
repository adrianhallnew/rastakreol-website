import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type BadgeVariant = 'oos' | 'category' | 'low-stock' | 'count'

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  oos: 'inline-flex items-center rounded-sm bg-brand-red px-2 py-1 text-xs font-medium text-white',
  category: 'inline-flex items-center text-xs font-medium uppercase tracking-[0.08em] text-brand-muted',
  // design.md §5.5 flags brand-warning (= brand-gold, 2.5:1) as contrast-unsafe for text and
  // names brand-error (5.8:1, AA) as the safe alternative for low-stock/OOS text — used here.
  'low-stock': 'inline-flex items-center text-xs font-normal text-brand-error',
  count:
    'inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-medium leading-none text-white',
}

export function Badge({ variant, children, className }: BadgeProps) {
  return <span className={cn(variantClasses[variant], className)}>{children}</span>
}
