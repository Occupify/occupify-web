import {
  FileTextIcon,
  StarIcon,
  CheckCircleIcon,
  ChatDotsIcon,
  WarningCircleIcon,
  GearIcon,
} from '@phosphor-icons/react'
import type { NotifBadgeType } from '../types'

interface NotifBadgeProps {
  type: NotifBadgeType
}

export function NotifBadge({ type }: NotifBadgeProps) {
  switch (type) {
    case 'contract':
      return (
        <span className="w-5 h-5 rounded-full !bg-[var(--color-primary-500)] !text-white flex items-center justify-center shrink-0 shadow-xs">
          <FileTextIcon size={11} weight="bold" />
        </span>
      )
    case 'review':
      return (
        <span className="w-5 h-5 rounded-full !bg-[var(--color-secondary-500)] !text-white flex items-center justify-center shrink-0 shadow-xs">
          <StarIcon size={11} weight="fill" />
        </span>
      )
    case 'proposal':
      return (
        <span className="w-5 h-5 rounded-full !bg-[var(--color-success-fg)] !text-white flex items-center justify-center shrink-0 shadow-xs">
          <CheckCircleIcon size={11} weight="bold" />
        </span>
      )
    case 'message':
      return (
        <span className="w-5 h-5 rounded-full !bg-[var(--color-primary-600)] !text-white flex items-center justify-center shrink-0 shadow-xs">
          <ChatDotsIcon size={11} weight="fill" />
        </span>
      )
    case 'alert':
      return (
        <span className="w-5 h-5 rounded-full !bg-[var(--color-warning-fg)] !text-white flex items-center justify-center shrink-0 shadow-xs">
          <WarningCircleIcon size={11} weight="bold" />
        </span>
      )
    case 'system':
    default:
      return (
        <span className="w-5 h-5 rounded-full !bg-[var(--text-secondary)] !text-white flex items-center justify-center shrink-0 shadow-xs">
          <GearIcon size={11} weight="bold" />
        </span>
      )
  }
}
