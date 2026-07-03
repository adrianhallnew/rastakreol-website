'use client'

import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-gold text-brand-ink hover:bg-brand-gold-warm active:bg-brand-gold-deep',
  secondary:
    'bg-transparent text-brand-ink border border-brand-ink hover:bg-brand-ink/8',
  ghost: 'bg-transparent text-brand-muted hover:bg-brand-ink/5',
  danger: 'bg-brand-red text-white hover:brightness-90',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-[52px] px-6 text-base',
}

const spinnerSize: Record<ButtonSize, number> = {
  sm: 18,
  md: 20,
  lg: 22,
}

export const buttonVariants = ({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}) =>
  cn(
    'relative inline-flex items-center justify-center gap-2 rounded-sm font-medium',
    'transition-[background-color,transform,filter] duration-micro ease-out-quart',
    'active:scale-[0.97]',
    'disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )

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
