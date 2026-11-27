import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores'
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../api'
import type { GetNotificationsParams } from '../types'

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params?: GetNotificationsParams) => [...notificationKeys.lists(), params] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
}

export const NOTIFICATION_POLLING_INTERVAL_MS = 5_000

export function useUnreadNotificationCount() {
  const accessToken = useAuthStore((s) => s.accessToken)

  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
    enabled: Boolean(accessToken),
    staleTime: 4_000,
    refetchInterval: NOTIFICATION_POLLING_INTERVAL_MS,
    refetchIntervalInBackground: false,
    retry: 1,
  })
}

export function useNotifications(params?: GetNotificationsParams) {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((s) => s.accessToken)

  const query = useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => getNotifications(params),
    enabled: Boolean(accessToken),
    refetchInterval: NOTIFICATION_POLLING_INTERVAL_MS,
    refetchIntervalInBackground: false,
  })

  const unreadCountQuery = useUnreadNotificationCount()

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })

  const notifications = query.data?.items ?? []
  const paging = query.data?.paging ?? {
    page: params?.page ?? 0,
    limit: params?.limit ?? 20,
    total: 0,
    totalPages: 0,
  }
  const unreadCount =
    unreadCountQuery.data !== undefined
      ? unreadCountQuery.data
      : notifications.filter((n) => !n.isRead).length

  return {
    notifications,
    paging,
    unreadCount,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    deleteNotification: deleteMutation.mutateAsync,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
