import * as React from 'react'
import { cn } from '@/utils'

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'premium'
  | 'opentowork'
  | 'hiring'
  | 'degree'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  pill?: boolean
}

export function Badge({
  className,
  variant = 'default',
  pill = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-[#FAFAF8] text-[rgba(0,0,0,0.70)] border border-[rgba(0,0,0,0.08)]',
    primary: 'bg-[#EAF1FA] text-[#0A66C2] border border-[#BFDBFE]',
    success: 'bg-[#E5F6E8] text-[#057642] border border-[#BBF7D0]',
    warning: 'bg-[#FFF4D6] text-[#915907] border border-[#FDE68A]',
    error: 'bg-[#FBE2E2] text-[#C03A2B] border border-[#FECACA]',
    premium: 'bg-[#FFF4D6] text-[#B07F00] border border-[#FDE68A] font-semibold',
    opentowork: 'bg-[#44712E] text-white border-transparent font-semibold',
    hiring: 'bg-[#E5F6E8] text-[#057642] border border-[#BBF7D0] font-semibold',
    degree: 'bg-transparent text-[rgba(0,0,0,0.45)] border-transparent font-medium',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-sans text-[11px] font-semibold tracking-wide px-2 py-0.5 select-none leading-tight transition-colors',
        pill ? 'rounded-full' : 'rounded-[4px]',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  onRemove?: () => void
}

export function Chip({
  className,
  active = false,
  onRemove,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 px-3.5 py-1 text-[13px] font-medium rounded-full border transition-all duration-150 cursor-pointer select-none',
        active
          ? 'bg-[#0A66C2] text-white border-[#0A66C2] shadow-xs'
          : 'bg-white text-[rgba(0,0,0,0.85)] border-[rgba(0,0,0,0.15)] hover:bg-[#FAFAF8] hover:border-[rgba(0,0,0,0.30)]',
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="hover:opacity-75 text-xs ml-0.5"
        >
          ×
        </span>
      )}
    </button>
  )
}
