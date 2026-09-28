import * as React from 'react'
import {
  InfoIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  WarningIcon,
  XIcon,
} from '@phosphor-icons/react'
import { cn } from '@/utils'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  onClose?: () => void
}

export function Alert({
  className,
  variant = 'info',
  title,
  onClose,
  children,
  ...props
}: AlertProps) {
  const variantStyles: Record<AlertVariant, { container: string; iconColor: string }> = {
    info: {
      container: 'bg-[#EAF1FA] text-[#0A66C2] border border-[#BFDBFE]',
      iconColor: 'text-[#0A66C2]',
    },
    success: {
      container: 'bg-[#E5F6E8] text-[#057642] border border-[#BBF7D0]',
      iconColor: 'text-[#057642]',
    },
    warning: {
      container: 'bg-[#FFF4D6] text-[#915907] border border-[#FDE68A]',
      iconColor: 'text-[#915907]',
    },
    error: {
      container: 'bg-[#FBE2E2] text-[#C03A2B] border border-[#FECACA]',
      iconColor: 'text-[#C03A2B]',
    },
  }

  const icons: Record<AlertVariant, React.ReactNode> = {
    info: <InfoIcon size={20} weight="fill" />,
    success: <CheckCircleIcon size={20} weight="fill" />,
    warning: <WarningIcon size={20} weight="fill" />,
    error: <WarningCircleIcon size={20} weight="fill" />,
  }

  const { container, iconColor } = variantStyles[variant]

  return (
    <div
      role="alert"
      className={cn(
        'rounded-[8px] p-3.5 flex items-start gap-3 text-[14px] leading-relaxed transition-all',
        container,
        className,
      )}
      {...props}
    >
      <div className={cn('shrink-0 mt-0.5', iconColor)}>{icons[variant]}</div>

      <div className="flex-1 space-y-0.5">
        {title && <div className="font-semibold text-[14px]">{title}</div>}
        <div className="text-[13px] opacity-90">{children}</div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-1 rounded hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Dismiss alert"
        >
          <XIcon size={15} weight="bold" />
        </button>
      )}
    </div>
  )
}
