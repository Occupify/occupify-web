import * as React from 'react'
import { cn } from '@/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'connect'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'
export type ButtonShape = 'pill' | 'rounded' | 'square'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      shape = 'pill',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-semibold transition-all duration-150 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-[#0A66C2] text-white hover:bg-[#084FA0] active:translate-y-[1px] shadow-[0_1px_2px_rgba(10,102,194,0.25)] hover:shadow-[0_4px_12px_rgba(10,102,194,0.25)] border border-transparent',
      secondary:
        'bg-transparent text-[#0A66C2] border border-[#0A66C2] hover:bg-[#EAF1FA] active:translate-y-[1px]',
      outline:
        'bg-white text-[rgba(0,0,0,0.90)] border border-[rgba(0,0,0,0.15)] hover:bg-[#FAFAF8] hover:border-[rgba(0,0,0,0.30)] active:translate-y-[1px]',
      ghost:
        'bg-transparent text-[rgba(0,0,0,0.60)] hover:bg-[#FAFAF8] hover:text-[rgba(0,0,0,0.90)] border border-transparent',
      danger:
        'bg-transparent text-[#C03A2B] border border-[#FECACA] hover:bg-[#FBE2E2] hover:border-[#C03A2B] active:translate-y-[1px]',
      connect:
        'bg-transparent text-[#0A66C2] border border-[#0A66C2] hover:bg-[#EAF1FA] hover:shadow-xs active:translate-y-[1px]',
    }

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'text-[12px] px-3 py-1.5 gap-1.5 h-8',
      md: 'text-[14px] px-4 py-2 gap-2 h-9',
      lg: 'text-[15px] px-6 py-2.5 gap-2.5 h-11',
      icon: 'w-9 h-9 p-0',
    }

    // Default to pill shape per LinkedIn/Occupify design guidelines
    const shapeStyles: Record<ButtonShape, string> = {
      pill: 'rounded-full',
      rounded: 'rounded-[8px]',
      square: 'rounded-[4px]',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          shapeStyles[shape],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    )
  },
)

Button.displayName = 'Button'
