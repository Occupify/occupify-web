import type { Notif } from '../types'
import { MOCK_NOTIFICATIONS } from '@/features/mock-data'

let notificationsStore: Notif[] = [...MOCK_NOTIFICATIONS]

export async function getNotifications(): Promise<Notif[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  return [...notificationsStore]
}

export async function markNotificationAsRead(id: number): Promise<{ id: number; isRead: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  notificationsStore = notificationsStore.map((n) => (n.id === id ? { ...n, isRead: true } : n))
  return { id, isRead: true }
}

export async function markAllNotificationsAsRead(): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 60))
  notificationsStore = notificationsStore.map((n) => ({ ...n, isRead: true }))
  return { success: true }
}

export async function deleteNotification(id: number): Promise<{ id: number }> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  notificationsStore = notificationsStore.filter((n) => n.id !== id)
  return { id }
}
