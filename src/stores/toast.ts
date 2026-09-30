import { create } from 'zustand'

export type ToastType = 'success' | 'info' | 'warning' | 'error'

export interface ToastItem {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export type ToastOptions = Omit<ToastItem, 'id' | 'message' | 'type'>

interface ToastState {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toastItem) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastItem = { ...toastItem, id }
    set((state) => ({ toasts: [...state.toasts, newToast] }))
    return id
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
}))

/**
 * Imperative helper for displaying toast notifications from anywhere in the application.
 */
export const toast = {
  success: (message: string, options?: ToastOptions) =>
    useToastStore.getState().addToast({ type: 'success', message, ...options }),
  error: (message: string, options?: ToastOptions) =>
    useToastStore.getState().addToast({ type: 'error', message, ...options }),
  info: (message: string, options?: ToastOptions) =>
    useToastStore.getState().addToast({ type: 'info', message, ...options }),
  warning: (message: string, options?: ToastOptions) =>
    useToastStore.getState().addToast({ type: 'warning', message, ...options }),
  custom: (item: Omit<ToastItem, 'id'>) => useToastStore.getState().addToast(item),
  dismiss: (id: string) => useToastStore.getState().removeToast(id),
}
