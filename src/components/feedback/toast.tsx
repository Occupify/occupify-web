import * as React from 'react'
import { CheckCircleIcon, InfoIcon, WarningCircleIcon, XIcon } from '@phosphor-icons/react'
import { cn } from '@/utils'
import type { ToastItem, ToastType } from '@/stores/toast'

interface ToastProps {
  toast: ToastItem
  onDismiss: (id: string) => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const { id, type, title, message, duration = 4000, action } = toast
  const [isPaused, setIsPaused] = React.useState(false)
  const [isExiting, setIsExiting] = React.useState(false)

  const handleDismiss = React.useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      onDismiss(id)
    }, 220)
  }, [id, onDismiss])

  React.useEffect(() => {
    if (duration <= 0 || isPaused || isExiting) return

    const timer = setTimeout(() => {
      handleDismiss()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, isPaused, isExiting, handleDismiss])

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircleIcon size={20} weight="fill" className="text-[#057642]" />,
    info: <InfoIcon size={20} weight="fill" className="text-[#0A66C2]" />,
    warning: <WarningCircleIcon size={20} weight="fill" className="text-[#915907]" />,
    error: <WarningCircleIcon size={20} weight="fill" className="text-[#C03A2B]" />,
  }

  const iconBgStyles: Record<ToastType, string> = {
    success: 'bg-[#E5F6E8]',
    info: 'bg-[#EAF1FA]',
    warning: 'bg-[#FFF4D6]',
    error: 'bg-[#FBE2E2]',
  }

  const borderAccentStyles: Record<ToastType, string> = {
    success: 'border-l-[3px] border-l-[#057642]',
    info: 'border-l-[3px] border-l-[#0A66C2]',
    warning: 'border-l-[3px] border-l-[#915907]',
    error: 'border-l-[3px] border-l-[#C03A2B]',
  }

  const progressBarStyles: Record<ToastType, string> = {
    success: 'bg-[#057642]',
    info: 'bg-[#0A66C2]',
    warning: 'bg-[#915907]',
    error: 'bg-[#C03A2B]',
  }

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        'relative w-full bg-white rounded-[8px] p-3.5 pb-4 border border-[rgba(0,0,0,0.08)] shadow-[0_12px_28px_rgba(0,0,0,0.14)] flex items-start gap-3 pointer-events-auto overflow-hidden transition-shadow duration-200',
        borderAccentStyles[type],
        isExiting ? 'toast-slide-out' : 'toast-slide-in',
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
          iconBgStyles[type],
        )}
      >
        {icons[type]}
      </div>

      <div className="flex-1 space-y-0.5 pt-0.5 min-w-0">
        {title && (
          <h4 className="font-heading font-semibold text-[14px] text-[rgba(0,0,0,0.90)] m-0 truncate">
            {title}
          </h4>
        )}
        <p className="text-[13px] text-[rgba(0,0,0,0.65)] m-0 leading-snug">{message}</p>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-2 text-[12px] font-semibold text-[#0A66C2] hover:underline cursor-pointer"
          >
            {action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        className="text-[rgba(0,0,0,0.40)] hover:text-[rgba(0,0,0,0.85)] hover:bg-[#FAFAF8] p-1 rounded-full transition-colors cursor-pointer shrink-0 mt-0.5"
        aria-label="Dismiss notification"
      >
        <XIcon size={14} weight="bold" />
      </button>

      {/* Visual countdown progress bar */}
      {duration > 0 && !isExiting && (
        <div className="h-[3px] w-full bg-[rgba(0,0,0,0.06)] absolute bottom-0 left-0 overflow-hidden">
          <div
            className={cn('h-full', progressBarStyles[type])}
            style={{
              animation: `progressShrink ${duration}ms linear forwards`,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          />
        </div>
      )}
    </div>
  )
}
