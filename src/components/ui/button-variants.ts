// No 'use client' — pure class-string logic, needs to be callable from Server
// Components directly (e.g. styling a <Link> as a button). Kept separate from
// Button.tsx: that file has 'use client', which would make every export from
// it (including a plain function like this one) a client-only reference that
// Server Components can't call directly, only render as a Component.
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
    'transition-[background-color,transform,filter] duration-[var(--motion-micro)] ease-out-quart',
    'active:scale-[0.97]',
    'disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )
