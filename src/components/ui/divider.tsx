import * as React from 'react'
import { cn } from '@/utils'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
}

export function Divider({
  className,
  orientation = 'horizontal',
  children,
  ...props
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn('inline-block w-[1px] self-stretch bg-[rgba(0,0,0,0.08)] my-auto', className)}
        {...props}
      />
    )
  }

  if (children) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 my-4 text-[12px] text-[rgba(0,0,0,0.60)]',
          className,
        )}
        {...props}
      >
        <div className="flex-1 h-[1px] bg-[rgba(0,0,0,0.08)]" />
        <span className="shrink-0 uppercase font-medium tracking-wider text-[11px]">
          {children}
        </span>
        <div className="flex-1 h-[1px] bg-[rgba(0,0,0,0.08)]" />
      </div>
    )
  }

  return (
    <hr
      className={cn('border-none h-[1px] bg-[rgba(0,0,0,0.08)] my-4 w-full', className)}
      {...props}
    />
  )
}
