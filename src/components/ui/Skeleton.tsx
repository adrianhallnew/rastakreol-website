import type { CSSProperties } from 'react'
import { cn } from '../../lib/cn'

interface SkeletonProps {
  className?: string
  style?: CSSProperties
}

// Purely decorative — a single loading operation usually renders many of these at
// once (e.g. a product grid), so the announcement belongs on the containing
// component (one `role="status"` region), not on every individual block.
export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn('animate-shimmer motion-reduce:animate-none bg-brand-border', className)}
      style={style}
      aria-hidden="true"
    />
  )
}
