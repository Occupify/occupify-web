import { FileText, Star, CheckCircle, ChatDots, WarningCircle, Gear } from '@phosphor-icons/react'
import type { NotifBadgeType } from '../types'

interface NotifBadgeProps {
  type: NotifBadgeType
}

export function NotifBadge({ type }: NotifBadgeProps) {
  switch (type) {
    case 'contract':
      return (
        <span className="w-5 h-5 rounded-full !bg-[var(--color-primary-500)] !text-white flex items-center justify-center shrink-0 shadow-xs">
          <FileText size={11} weight="bold" />
        </span>
      )
    case 'review':
      return (
        <span className="w-5 h-5 rounded-full !bg-[var(--color-secondary-500)] !text-white flex items-center justify-center shrink-0 shadow-xs">
          <Star size={11} weight="fill" />
        </span>
      )
    case 'proposal':
      return (
        <span className="w-5 h-5 rounded-full !bg-[var(--color-success-fg)] !text-white flex items-center justify-center shrink-0 shadow-xs">
          <CheckCircle size={11} weight="bold" />
        </span>
      )
    case 'message':
      return (
        <span className="w-5 h-5 rounded-full !bg-[var(--color-primary-600)] !text-white flex items-center justify-center shrink-0 shadow-xs">
          <ChatDots size={11} weight="fill" />
        </span>
      )
    case 'alert':
      return (
        <span className="w-5 h-5 rounded-full !bg-[var(--color-warning-fg)] !text-white flex items-center justify-center shrink-0 shadow-xs">
          <WarningCircle size={11} weight="bold" />
        </span>
      )
    case 'system':
    default:
      return (
        <span className="w-5 h-5 rounded-full !bg-[var(--text-secondary)] !text-white flex items-center justify-center shrink-0 shadow-xs">
          <Gear size={11} weight="bold" />
        </span>
      )
  }
}
