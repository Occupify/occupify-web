import * as React from 'react'
import { CheckIcon } from '@phosphor-icons/react'
import { cn } from '@/utils'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  description?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, checked, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const checkboxId = id || generatedId

    return (
      <div className={cn('flex items-start gap-2.5 select-none', className)}>
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="checkbox"
            ref={ref}
            id={checkboxId}
            checked={checked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={cn(
              'flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border border-[rgba(0,0,0,0.25)] bg-white transition-all cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-[#0A66C2] peer-focus-visible:ring-offset-1 peer-checked:bg-[#0A66C2] peer-checked:border-[#0A66C2] peer-checked:text-white',
              disabled && 'opacity-50 cursor-not-allowed bg-[rgba(0,0,0,0.05)]',
            )}
          >
            <CheckIcon size={12} weight="bold" className="opacity-0 peer-checked:opacity-100 transition-opacity" />
          </label>
        </div>

        {(label || description) && (
          <div className="flex flex-col text-[13px] leading-tight">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  'font-medium text-[rgba(0,0,0,0.90)] cursor-pointer',
                  disabled && 'opacity-50 cursor-not-allowed',
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <span className="text-[12px] text-[rgba(0,0,0,0.55)] mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'
