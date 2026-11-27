import { apiClient } from '../../../lib/api-client.ts'
import type { PageResponse, SingleResponse, SuccessResponse } from '../../../types/api.ts'
import {
  toNotif,
  type GetNotificationsParams,
  type NotificationResponse,
  type NotificationsPageResult,
  type UnreadCountResponse,
} from '../types/index.ts'

export async function getNotifications(
  params?: GetNotificationsParams,
): Promise<NotificationsPageResult> {
  const page = params?.page ?? 0
  const limit = params?.limit ?? 20

  const res = await apiClient.get<PageResponse<NotificationResponse>>('/notifications', {
    params: { page, limit },
  })

  const rawItems = Array.isArray(res?.data) ? res.data : []
  const paging = res?.paging ?? {
    page,
    limit,
    total: rawItems.length,
    totalPages: rawItems.length > 0 ? 1 : 0,
  }

  return {
    items: rawItems.map((item) => toNotif(item)),
    paging,
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  const res = await apiClient.get<SingleResponse<UnreadCountResponse>>(
    '/notifications/unread-count',
  )
  return Number(res?.data?.unreadCount ?? 0)
}

export async function markNotificationAsRead(notificationId: string): Promise<SuccessResponse> {
  return await apiClient.put<SuccessResponse>(`/notifications/${notificationId}/read`)
}

export async function markAllNotificationsAsRead(): Promise<SuccessResponse> {
  return await apiClient.put<SuccessResponse>('/notifications/read-all')
}

export async function deleteNotification(notificationId: string): Promise<SuccessResponse> {
  return await apiClient.delete<SuccessResponse>(`/notifications/${notificationId}`)
}
