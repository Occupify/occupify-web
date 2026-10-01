export type NotifTab = 'all' | 'unread'

export type NotifBadgeType = 'contract' | 'review' | 'proposal' | 'message' | 'alert' | 'system'

export interface Notif {
  id: number
  title: string
  content: string
  time: string
  isRead: boolean
  actorName?: string
  badgeType: NotifBadgeType
  link?: string
}
