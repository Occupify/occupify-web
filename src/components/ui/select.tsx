import * as React from 'react'
import { CaretDownIcon } from '@phosphor-icons/react'
import { cn } from '@/utils'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options?: SelectOption[]
  fullWidth?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      fullWidth = true,
      required,
      id,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const selectId = id || generatedId

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-[12px] font-semibold text-[rgba(0,0,0,0.90)] flex items-center gap-1 select-none"
          >
            <span>{label}</span>
            {required && <span className="text-[#C03A2B] font-bold">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            required={required}
            className={cn(
              'w-full appearance-none rounded-[4px] border border-[rgba(0,0,0,0.15)] bg-white py-2 pl-3 pr-9 text-[14px] text-[rgba(0,0,0,0.90)] font-sans outline-none cursor-pointer transition-all duration-150 focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2]',
              error && 'border-[#C03A2B] focus:border-[#C03A2B] focus:ring-[#C03A2B]',
              className,
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="pointer-events-none absolute right-3 flex items-center text-[rgba(0,0,0,0.50)]">
            <CaretDownIcon size={14} weight="bold" />
          </div>
        </div>

        {error && <span className="text-[12px] text-[#C03A2B] font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-[12px] text-[rgba(0,0,0,0.60)]">{helperText}</span>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
