import type {
  AdminUser,
  AdminProject,
  AdminViolation,
  AdminProjectReport,
  ProjectHistoryItem,
  UserStatus,
  UserRole,
  ProjectStatus,
  ViolationCategory,
  ViolationStatus,
} from '../types'
import type { AdminUserBackendResponse, AdminUserDetailBackendResponse } from './admin-users'
import type {
  AdminProjectBackendResponse,
  AdminProjectDetailBackendResponse,
} from './admin-projects'
import type { AdminReportBackendResponse, AdminReportDetailBackendResponse } from './admin-reports'

const AVATAR_COLORS = [
  '#0A66C2',
  '#16A34A',
  '#D97706',
  '#DC2626',
  '#7C3AED',
  '#0D9488',
  '#EA580C',
  '#4F46E5',
]

export function getInitialsFromName(name?: string | null): string {
  if (!name || !name.trim()) return 'OC'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function getColorFromString(str?: string | null): string {
  if (!str) return AVATAR_COLORS[0]
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  const idx = Math.abs(hash) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

export function formatDateTime(isoString?: string | null): string {
  if (!isoString) return 'Vừa xong'
  try {
    const d = new Date(isoString)
    if (Number.isNaN(d.getTime())) return isoString
    const pad = (n: number) => n.toString().padStart(2, '0')
    const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`
    const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
    return `${time} ${date}`
  } catch {
    return isoString
  }
}

export function mapReasonCategoryToLabel(category?: string | null): string {
  switch (category) {
    case 'FRAUD':
      return 'Nội dung vi phạm / Lừa đảo'
    case 'OUTSIDE_PAYMENT':
      return 'Giao dịch ngoài sàn trái phép'
    case 'FAKE_INFORMATION':
      return 'Thông tin giả mạo / Không trung thực'
    case 'SPAM':
      return 'Spam, quấy rối hoặc quảng cáo'
    case 'HARASSMENT':
      return 'Quấy rối / Đe dọa'
    case 'OTHER':
    default:
      return 'Vi phạm quy định chung'
  }
}

export function mapReportStatusToLabel(status?: string | null): ViolationStatus {
  switch (status) {
    case 'RESOLVED':
      return 'Đã giải quyết'
    case 'DISMISSED':
      return 'Đã bác bỏ'
    case 'INVESTIGATING':
      return 'Đang xác minh'
    case 'PENDING':
    default:
      return 'Chờ xử lý'
  }
}

export function mapUserStatusToLabel(status?: string | null, isFlagged = false): UserStatus {
  if (isFlagged) return 'Bị gắn cờ'
  switch (status) {
    case 'SUSPENDED':
    case 'BANNED':
    case 'INACTIVE':
    case 'DELETED':
      return 'Bị khóa'
    case 'ACTIVE':
    default:
      return 'Hoạt động'
  }
}

export function mapUserRoleToLabel(role?: string | null): UserRole {
  const norm = (role || '').toUpperCase()
  if (norm === 'FREELANCER') return 'Freelancer'
  if (norm === 'CLIENT') return 'Client'
  if (norm === 'ADMIN') return 'Admin'
  return 'Người dùng'
}

export function toAdminUser(
  item: AdminUserBackendResponse,
  detail?: AdminUserDetailBackendResponse,
): AdminUser {
  const name = item.fullName?.trim() || item.email.split('@')[0]
  const isFlagged = detail ? detail.isFlagged : item.isFlagged
  const status = mapUserStatusToLabel(detail?.status || item.status, isFlagged)
  const role = mapUserRoleToLabel(detail?.role || item.role)

  const history: ProjectHistoryItem[] = (detail?.recentContracts || []).map((c) => ({
    id: c.id,
    title: c.title || `Hợp đồng #${c.id.slice(0, 8)}`,
    date: formatDateTime(c.startedAt || c.finishedAt),
    amount: c.agreedRate
      ? `${new Intl.NumberFormat('vi-VN').format(c.agreedRate)} đ`
      : 'Thỏa thuận',
    status: c.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang thực hiện',
  }))

  const totalContracts = detail?.totalContracts ?? (detail?.totalCompletedContracts || 0)
  const completedContracts = detail?.totalCompletedContracts || 0
  const completionRate =
    totalContracts > 0 ? `${Math.round((completedContracts / totalContracts) * 100)}%` : '100%'

  return {
    id: item.id,
    name,
    email: item.email,
    role,
    status,
    joined: formatDateTime(item.createdAt),
    initials: getInitialsFromName(name),
    color: getColorFromString(item.email),
    joinedProjects: totalContracts,
    createdProjects: role === 'Client' ? totalContracts : 0,
    completionRate,
    rating: 4.8,
    ratingCount: Math.max(1, completedContracts),
    reportsCount: detail?.disputeCount || 0,
    reportCount: detail?.disputeCount || 0,
    flagCount: isFlagged ? 1 : 0,
    flagReason: detail?.flagReason || undefined,
    lastLogin: formatDateTime(item.createdAt),
    projectHistory: history,
  }
}

export function toAdminProject(
  item: AdminProjectBackendResponse,
  detail?: AdminProjectDetailBackendResponse,
): AdminProject {
  const ownerName = item.employer?.fullName?.trim() || item.employer?.email || 'Chủ dự án'
  const status: ProjectStatus = item.status === 'OPEN' ? 'Đang tuyển' : 'Đã đóng'

  const reports: AdminProjectReport[] = (detail?.reports || []).map((r) => {
    const repName = r.reporterName || r.reporterEmail?.split('@')[0] || 'Người báo cáo'
    return {
      id: r.id,
      reporterName: repName,
      reporterEmail: r.reporterEmail || '',
      violationCategory: mapReasonCategoryToLabel(r.reasonCategory),
      description: r.description,
      createdAt: formatDateTime(r.createdAt),
      status: (r.status as any) || 'PENDING',
    }
  })

  return {
    id: item.id,
    title: item.title,
    owner: {
      name: ownerName,
      initials: getInitialsFromName(ownerName),
      color: getColorFromString(item.employer?.email || ownerName),
      email: item.employer?.email,
    },
    status,
    date: formatDateTime(item.createdAt),
    description: item.description || detail?.description || 'Không có mô tả chi tiết.',
    reportCount: item.reportCount || detail?.reportCount || 0,
    reports,
  }
}

export function toAdminViolation(
  item: AdminReportBackendResponse,
  detail?: AdminReportDetailBackendResponse,
): AdminViolation {
  const reporterEmail = item.reporterEmail || 'user@occupify.local'
  const reporterName = reporterEmail.split('@')[0]
  const isProject = item.targetType === 'PROJECT'
  const category: ViolationCategory = isProject ? 'Dự án' : 'Tài khoản'

  let targetDisplay = 'Mục tiêu vi phạm'
  if (isProject) {
    targetDisplay = item.targetProjectId
      ? `Dự án: #${item.targetProjectId.slice(0, 8)}`
      : 'Dự án vi phạm'
  } else {
    targetDisplay = item.targetUserId
      ? `Người dùng: #${item.targetUserId.slice(0, 8)}`
      : 'Tài khoản vi phạm'
  }

  const evidenceImg =
    detail?.evidenceUrls && detail.evidenceUrls.length > 0 ? detail.evidenceUrls[0] : undefined

  return {
    id: item.id,
    reporter: {
      name: reporterName,
      initials: getInitialsFromName(reporterName),
      color: getColorFromString(reporterEmail),
    },
    target: targetDisplay,
    category,
    time: formatDateTime(item.createdAt),
    status: mapReportStatusToLabel(item.status),
    reason: mapReasonCategoryToLabel(item.reasonCategory),
    evidence: item.description,
    evidenceImage: evidenceImg,
    evidenceUrls: detail?.evidenceUrls || (evidenceImg ? [evidenceImg] : []),
  }
}
