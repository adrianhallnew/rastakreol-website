'use client'

import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'
import { buttonVariants } from './button-variants'
import type { ButtonSize, ButtonVariant } from './button-variants'

const spinnerSize: Record<ButtonSize, number> = {
  sm: 18,
  md: 20,
  lg: 22,
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={buttonVariants({ variant, size, className })}
        {...props}
      >
        {/* opacity, not `invisible` — visibility:hidden would strip the label from the
            accessibility tree too, leaving a loading button with no accessible name */}
        <span className={cn('inline-flex items-center gap-2', loading && 'opacity-0')}>
          {children}
        </span>
        {loading && (
          <Loader2
            aria-hidden="true"
            className="absolute animate-spin motion-reduce:animate-none"
            size={spinnerSize[size]}
          />
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
