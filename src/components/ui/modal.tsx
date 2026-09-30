import * as React from 'react'
import { XIcon } from '@phosphor-icons/react'
import { cn } from '@/utils'

interface ModalContextValue {
  open: boolean
  onClose: () => void
}

const ModalContext = React.createContext<ModalContextValue | null>(null)

function useModalContext() {
  const context = React.useContext(ModalContext)
  if (!context) {
    throw new Error('Modal compound components must be rendered inside a <Modal> parent.')
  }
  return context
}

export interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  // Handle ESC key press
  React.useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    // Prevent background scrolling
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <ModalContext.Provider value={{ open, onClose }}>
      <div
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(0,0,0,0.55)] backdrop-blur-[2px] animate-in fade-in duration-200',
          className,
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </ModalContext.Provider>
  )
}

export interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

function ModalContent({ className, maxWidth = 'md', children, ...props }: ModalContentProps) {
  useModalContext()

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }

  return (
    <div
      className={cn(
        'w-full bg-white rounded-[12px] shadow-2xl border border-[rgba(0,0,0,0.08)] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150',
        maxWidthStyles[maxWidth],
        className,
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  )
}

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showCloseButton?: boolean
}

function ModalHeader({ className, showCloseButton = true, children, ...props }: ModalHeaderProps) {
  const { onClose } = useModalContext()
  return (
    <div
      className={cn(
        'flex items-center justify-between p-5 border-b border-[rgba(0,0,0,0.08)] bg-white',
        className,
      )}
      {...props}
    >
      <div className="flex-1 font-semibold text-[18px] text-[rgba(0,0,0,0.90)] font-heading">
        {children}
      </div>
      {showCloseButton && (
        <button
          type="button"
          onClick={onClose}
          className="text-[rgba(0,0,0,0.50)] hover:text-[rgba(0,0,0,0.90)] hover:bg-[#FAFAF8] p-1.5 rounded-full transition-colors cursor-pointer focus:outline-none"
          aria-label="Close dialog"
        >
          <XIcon size={18} weight="bold" />
        </button>
      )}
    </div>
  )
}

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

function ModalBody({ className, children, ...props }: ModalBodyProps) {
  useModalContext()
  return (
    <div
      className={cn(
        'p-5 overflow-y-auto text-[14px] text-[rgba(0,0,0,0.85)] leading-relaxed flex-1',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

function ModalFooter({ className, children, ...props }: ModalFooterProps) {
  useModalContext()
  return (
    <div
      className={cn(
        'p-4 bg-[#FAFAF8] border-t border-[rgba(0,0,0,0.08)] flex items-center justify-end gap-2.5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

Modal.Content = ModalContent
Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter
