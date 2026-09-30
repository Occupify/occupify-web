import * as React from 'react'
import { cn } from '@/utils'

export type InputVariant = 'default' | 'search'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: InputVariant
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
  fullWidth?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      variant = 'default',
      leftIcon,
      rightElement,
      fullWidth = true,
      required,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    const variantStyles: Record<InputVariant, string> = {
      default:
        'bg-white border-[rgba(0,0,0,0.15)] focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] placeholder:text-[rgba(0,0,0,0.45)] text-[14px]',
      search:
        'bg-[#EAF1FA] border-transparent focus:bg-white focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] placeholder:text-[rgba(0,0,0,0.50)] text-[13px]',
    }

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[12px] font-semibold text-[rgba(0,0,0,0.90)] flex items-center gap-1 select-none"
          >
            <span>{label}</span>
            {required && <span className="text-[#C03A2B] font-bold">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[rgba(0,0,0,0.45)]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            className={cn(
              'w-full rounded-[4px] border py-2 px-3 outline-none text-[rgba(0,0,0,0.90)] font-sans transition-all duration-150',
              variantStyles[variant],
              leftIcon && 'pl-9',
              rightElement && 'pr-10',
              error && 'border-[#C03A2B] focus:border-[#C03A2B] focus:ring-[#C03A2B] bg-[#FFF8F8]',
              className,
            )}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3 flex items-center text-[rgba(0,0,0,0.45)]">
              {rightElement}
            </div>
          )}
        </div>

        {error && <span className="text-[12px] text-[#C03A2B] font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-[12px] text-[rgba(0,0,0,0.60)]">{helperText}</span>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
