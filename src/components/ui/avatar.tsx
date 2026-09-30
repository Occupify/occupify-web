import * as React from 'react'
import { cn } from '@/utils'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  name?: string
  size?: AvatarSize
  status?: 'online' | 'offline' | 'busy'
  openToWork?: boolean
}

function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({
  className,
  src,
  alt = '',
  name,
  size = 'md',
  status,
  openToWork = false,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  const sizeStyles: Record<AvatarSize, { container: string; text: string; badge: string }> = {
    xs: { container: 'w-6 h-6', text: 'text-[10px]', badge: 'w-1.5 h-1.5 bottom-0 right-0' },
    sm: { container: 'w-8 h-8', text: 'text-[11px]', badge: 'w-2 h-2 bottom-0 right-0' },
    md: { container: 'w-12 h-12', text: 'text-[15px]', badge: 'w-2.5 h-2.5 bottom-0.5 right-0.5' },
    lg: { container: 'w-16 h-16', text: 'text-[18px]', badge: 'w-3 h-3 bottom-1 right-1' },
    xl: { container: 'w-24 h-24', text: 'text-[28px]', badge: 'w-4 h-4 bottom-1.5 right-1.5' },
  }

  const statusColors = {
    online: 'bg-[#15803D]',
    offline: 'bg-[rgba(0,0,0,0.30)]',
    busy: 'bg-[#C03A2B]',
  }

  const { container, text, badge } = sizeStyles[size]

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 rounded-full select-none',
        openToWork && 'p-[2px] bg-gradient-to-tr from-[#057642] to-[#44712E]',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'relative rounded-full overflow-hidden flex items-center justify-center bg-[#EAF1FA] text-[#0A66C2] font-semibold font-sans border-2 border-white shadow-xs',
          container,
          text,
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name || alt)}</span>
        )}
      </div>

      {status && (
        <span
          className={cn('absolute rounded-full ring-2 ring-white', badge, statusColors[status])}
        />
      )}
    </div>
  )
}
