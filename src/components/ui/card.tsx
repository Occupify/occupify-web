import * as React from 'react'
import { cn } from '@/utils'

interface CardContextValue {
  hoverable?: boolean
}

const CardContext = React.createContext<CardContextValue | null>(null)

function useCardContext() {
  const context = React.useContext(CardContext)
  if (!context) {
    throw new Error('Card compound components must be rendered inside a <Card> parent.')
  }
  return context
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  elevated?: boolean
  noPadding?: boolean
}

export function Card({
  className,
  hoverable = false,
  elevated = true,
  noPadding = false,
  children,
  ...props
}: CardProps) {
  return (
    <CardContext.Provider value={{ hoverable }}>
      <div
        className={cn(
          'rounded-[8px] bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] transition-all duration-200 overflow-hidden',
          elevated && 'bg-[#FFFFFF]',
          hoverable &&
            'hover:border-[rgba(10,102,194,0.28)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.09)] hover:-translate-y-[1px]',
          !noPadding && 'p-4 sm:p-5',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  )
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode
}

function CardHeader({ className, action, children, ...props }: CardHeaderProps) {
  useCardContext()
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 mb-3 pb-2 border-b border-[rgba(0,0,0,0.04)]',
        className,
      )}
      {...props}
    >
      <div className="space-y-1 flex-1">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

function CardTitle({ as: Comp = 'h3', className, children, ...props }: CardTitleProps) {
  useCardContext()
  return (
    <Comp
      className={cn(
        'font-heading font-semibold text-[17px] text-[rgba(0,0,0,0.90)] tracking-tight m-0',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

function CardDescription({ className, children, ...props }: CardDescriptionProps) {
  useCardContext()
  return (
    <p
      className={cn('text-[13px] text-[rgba(0,0,0,0.60)] m-0 leading-normal', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function CardContent({ className, children, ...props }: CardContentProps) {
  useCardContext()
  return (
    <div className={cn('text-[14px] text-[rgba(0,0,0,0.90)]', className)} {...props}>
      {children}
    </div>
  )
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean
}

function CardFooter({ className, bordered = false, children, ...props }: CardFooterProps) {
  useCardContext()
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 pt-3 mt-4 text-[13px]',
        bordered && 'border-t border-[rgba(0,0,0,0.06)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Body = CardContent
Card.Footer = CardFooter
