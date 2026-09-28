import { toast, type ToastOptions } from '@/stores/toast'

/**
 * Hook adapter providing an API compatible with NotificationProvider from study-web-fe
 * (showSuccess, showError, showInfo, showWarning).
 */
export function useNotification() {
  return {
    showSuccess: (message: string, options?: ToastOptions) =>
      toast.success(message, { title: 'Thành công', ...options }),
    showError: (message: string, options?: ToastOptions) =>
      toast.error(message, { title: 'Đã xảy ra lỗi', ...options }),
    showInfo: (message: string, options?: ToastOptions) =>
      toast.info(message, { title: 'Thông báo', ...options }),
    showWarning: (message: string, options?: ToastOptions) =>
      toast.warning(message, { title: 'Cảnh báo', ...options }),
  }
}
