import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gold-500 text-ink-950 hover:bg-gold-400 focus-visible:outline-gold-400 shadow-[0_0_0_1px_rgba(212,165,74,0.4)]',
  secondary:
    'bg-ink-800 text-ink-100 border border-ink-600 hover:border-gold-500/60 hover:text-gold-300 focus-visible:outline-gold-400',
  ghost:
    'bg-transparent text-ink-300 hover:text-gold-300 hover:bg-ink-800/60 focus-visible:outline-gold-400',
  danger:
    'bg-red-500/10 text-red-300 border border-red-500/40 hover:bg-red-500/20 focus-visible:outline-red-400',
}

export const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
}

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) {
  return cn(
    'inline-flex items-center justify-center rounded-md font-medium tracking-wide transition-colors duration-150',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={buttonClasses(variant, size, className)}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
