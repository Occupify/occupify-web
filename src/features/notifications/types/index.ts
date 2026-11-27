import { ApiError, type PageResponse } from '../../../types/api.ts'

export type NotifTab = 'all' | 'unread'

export type NotifBadgeType = 'contract' | 'review' | 'proposal' | 'message' | 'alert' | 'system'

export type NotificationCategory =
  'CONTRACT' | 'JOB' | 'PROJECT' | 'SYSTEM' | 'MESSAGE' | 'PAYMENT' | 'COMMUNITY'

export type NotificationActionType =
  | 'PROPOSAL_VIEWED'
  | 'PROPOSAL_SUBMITTED'
  | 'PROPOSAL_ACCEPTED'
  | 'PROPOSAL_CANCELLED'
  | 'POST_LIKED'
  | 'POST_COMMENTED'
  | 'POST_SHARED'
  | 'JOB_MATCH_POSTED'
  | 'CONTRACT_INVITATION'
  | 'CONTRACT_ACCEPTED'
  | 'CONTRACT_REJECTED'
  | 'CONTRACT_COMPENSATED'
  | 'CONTRACT_COMPLETED'
  | 'CONTRACT_CANCELLED'
  | 'PROJECT_CREATED'
  | 'PROJECT_CLOSED'
  | 'REVIEW_CREATED'
  | (string & {})

export interface NotificationResponse {
  id: string
  userId: string
  title: string
  content: string
  category?: NotificationCategory | string | null
  actionType?: NotificationActionType | null
  isRead: boolean
  readAt?: string | null
  createdAt?: string | null
}

export interface UnreadCountResponse {
  userId: string
  unreadCount: number
}

export interface GetNotificationsParams {
  page?: number
  limit?: number
}

export interface Notif {
  id: string
  title: string
  content: string
  time: string
  isRead: boolean
  actorName?: string
  badgeType: NotifBadgeType
  link?: string
  category?: string | null
  actionType?: string | null
  readAt?: string | null
  createdAt?: string | null
}

export interface NotificationsPageResult {
  items: Notif[]
  paging: PageResponse<NotificationResponse>['paging']
}

export function mapActionTypeToBadgeType(
  actionType?: string | null,
  category?: string | null,
): NotifBadgeType {
  const normalizedAction = actionType?.trim().toUpperCase()
  switch (normalizedAction) {
    case 'REVIEW_CREATED':
      return 'review'
    case 'PROPOSAL_VIEWED':
    case 'PROPOSAL_SUBMITTED':
    case 'PROPOSAL_ACCEPTED':
    case 'PROPOSAL_CANCELLED':
    case 'JOB_MATCH_POSTED':
      return 'proposal'
    case 'CONTRACT_INVITATION':
    case 'CONTRACT_ACCEPTED':
    case 'CONTRACT_COMPLETED':
    case 'PROJECT_CREATED':
    case 'PROJECT_CLOSED':
      return 'contract'
    case 'CONTRACT_REJECTED':
    case 'CONTRACT_COMPENSATED':
    case 'CONTRACT_CANCELLED':
      return 'alert'
    case 'POST_COMMENTED':
    case 'POST_LIKED':
    case 'POST_SHARED':
      return 'message'
    default:
      break
  }

  const normalizedCategory = category?.trim().toUpperCase()
  switch (normalizedCategory) {
    case 'CONTRACT':
    case 'PROJECT':
      return 'contract'
    case 'JOB':
      return 'proposal'
    case 'MESSAGE':
    case 'COMMUNITY':
      return 'message'
    case 'PAYMENT':
      return 'alert'
    case 'SYSTEM':
    default:
      return 'system'
  }
}

export function formatNotificationRelativeTime(
  isoString?: string | null,
  now: Date = new Date(),
): string {
  if (!isoString || !isoString.trim()) return 'Gần đây'

  const parsed = new Date(isoString)
  if (Number.isNaN(parsed.getTime())) return 'Gần đây'

  const diffMs = now.getTime() - parsed.getTime()
  if (diffMs < 0) return 'Vừa xong'

  const diffSeconds = Math.floor(diffMs / 1000)
  if (diffSeconds < 60) return 'Vừa xong'

  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes} phút trước`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Hôm qua'
  if (diffDays < 7) return `${diffDays} ngày trước`

  const day = String(parsed.getDate()).padStart(2, '0')
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const year = parsed.getFullYear()
  return `${day}/${month}/${year}`
}

export function toNotif(dto: NotificationResponse, now: Date = new Date()): Notif {
  return {
    id: dto.id,
    title: dto.title || 'Thông báo',
    content: dto.content || '',
    time: formatNotificationRelativeTime(dto.createdAt, now),
    isRead: Boolean(dto.isRead),
    actorName: dto.title || 'Occupify',
    badgeType: mapActionTypeToBadgeType(dto.actionType, dto.category),
    category: dto.category ?? null,
    actionType: dto.actionType ?? null,
    readAt: dto.readAt ?? null,
    createdAt: dto.createdAt ?? null,
  }
}

export function getNotificationErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.errorCode) {
      case 'NOTI_001':
        return 'Không tìm thấy thông báo hoặc thông báo đã bị xóa.'
      case 'NOTI_002':
        return 'Bạn không có quyền thao tác với thông báo này.'
      case 'NOTI_003':
        return 'Không tìm thấy thông tin người dùng.'
      case 'NOTI_004':
        return 'Dữ liệu thông báo không hợp lệ.'
      case 'SYS_002':
        return 'Tham số truy vấn thông báo không hợp lệ.'
      case 'SYS_001':
        return 'Hệ thống thông báo gặp sự cố nội bộ. Vui lòng thử lại sau.'
      case 'SYS_008':
        return 'Dịch vụ thông báo tạm thời không khả dụng. Vui lòng thử lại sau.'
      case 'SYS_009':
        return 'Yêu cầu tới dịch vụ thông báo bị quá thời gian phản hồi.'
      case 'AUTH_003':
      case 'AUTH_005':
      case 'AUTH_SESSION_EXPIRED':
        return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      case 'NETWORK_ERROR':
        return 'Không thể kết nối đến máy chủ thông báo. Vui lòng kiểm tra kết nối mạng.'
      default:
        break
    }

    switch (error.statusCode) {
      case 400:
        return error.message || 'Yêu cầu thông báo không hợp lệ (400).'
      case 401:
        return 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn (401).'
      case 403:
        return 'Bạn không có quyền truy cập thông báo này (403).'
      case 404:
        return 'Không tìm thấy thông báo yêu cầu (404).'
      case 500:
        return 'Hệ thống thông báo gặp lỗi nội bộ (500).'
      case 503:
        return 'Dịch vụ thông báo tạm thời không khả dụng (503).'
      case 504:
        return 'Hết thời gian phản hồi từ dịch vụ thông báo (504).'
      default:
        return error.message || 'Có lỗi xảy ra khi xử lý thông báo.'
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Có lỗi xảy ra, vui lòng thử lại sau.'
}
