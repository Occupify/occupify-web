import { useToastStore } from '@/stores/toast'
import { Toast } from './toast'

export interface ToastContainerProps {
  position?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left'
}

export function ToastContainer({ position = 'bottom-right' }: ToastContainerProps) {
  const { toasts, removeToast } = useToastStore()

  const positionStyles = {
    'bottom-right': 'bottom-5 right-5',
    'top-right': 'top-5 right-5',
    'bottom-left': 'bottom-5 left-5',
    'top-left': 'top-5 left-5',
  }

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      className={`fixed z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0 ${positionStyles[position]}`}
    >
      {toasts.map((item) => (
        <Toast key={item.id} toast={item} onDismiss={removeToast} />
      ))}
    </div>
  )
}
