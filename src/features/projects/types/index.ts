import { ApiError } from '../../../types/api.ts'
import type { JobExperienceLevel } from '@/features/jobs/types'

export interface ProjectRole {
  id: string
  role?: string
  title: string
  skills?: string[]
  salaryRange?: string
  salaryType?: string
  termsFileUrl?: string | null
  startedAt?: string | null
  finishedAt?: string | null
  slotsTotal?: number
  slotsFilled?: number
  status?: 'recruiting' | 'filled' | 'closed'
  assignedMemberName?: string
  jobDescription?: string
}

export interface ProjectMember {
  id?: string
  contractId?: string
  name: string
  email: string
  price: string
  dueDate?: string
  salaryDueDate?: string
  role?: string
  status?: string
}

export interface PendingProject {
  id: number | string
  name: string
  owner: string
  ownerAvatar?: string
  ownerCompany?: string
  ownerRole?: string
  ownerRating?: number
  ownerCompletedProjects?: number
  period: string
  price: string
  dueDate?: string
  description?: string
  tags?: string[]
  invitedRole: string
  inviteMessage?: string
  recruitingRoles?: ProjectRole[]
}

export interface MyProject {
  id: number | string
  name: string
  owner?: string
  ownerCompany?: string
  ownerRating?: number
  period: string
  dueDate?: string
  bidCloseDate?: string
  contractDuration?: string
  description?: string
  tags?: string[]
  members: ProjectMember[]
  recruitingRoles?: ProjectRole[]
  status?: ProjectStatus
  startPrice?: number
  closedAt?: string | null
}

export interface FreelancerReview {
  rating: number
  onTime: boolean
  comment: string
}

export interface ApplicantProposal {
  id: number | string
  name: string
  bid: string
  salaryCycle: string
  salaryCycleType: 'monthly' | 'hourly' | 'weekly' | 'fixed'
  rawBidValue: string
  rating: number
  ratingCount: number
  occupation: string
  roleApplied: string
  commitment: string
  cvFileName: string
  cvFileSize: string
  portfolioUrl?: string
  status: 'pending' | 'accepted' | 'rejected'
  comment: string
  email: string
  phone: string
  location: string
  appliedDate: string
  projectId?: string
  jobId?: string
  cvFileUrl?: string
}

export interface CreateProjectFormData {
  name: string
  description: string
  dueDate?: string
  bidCloseDate?: string
  experienceLevel?: JobExperienceLevel
  tags?: string[]
  startPrice?: string
  period?: string
}

export interface CreateContractFormData {
  projectId?: string
  title: string
  value: string
  period: string
  startDate?: string
  endDate?: string
  role: string
  freelancerEmail: string
  candidateName?: string
  candidateEmail?: string
  project?: string | null
  projectName?: string
  roleTitle?: string
  salary?: string
  scope?: string
  jobDescription?: string
  attachedFileName?: string
  attachedFileSize?: string
  termsFileName?: string
  paymentType?: 'milestone' | 'period'
  invitationMessage?: string
  jobId?: string
  file?: File | null
}

// ─────────────────────────────────────────────────────────────
// Backend Core Project Types & Contracts (POST, GET, PUT, PATCH /projects)
// ─────────────────────────────────────────────────────────────

export type ProjectPeriod = 'FIXED' | 'HOURLY' | 'WEEKLY' | 'MONTHLY'
export type ProjectExperienceLevel = 'ENTRY' | 'INTERMEDIATE' | 'EXPERT'
export type ProjectStatus = 'OPEN' | 'CLOSED'

export interface EmployerSummary {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
}

export interface JobSkill {
  id: string
  name: string
}

export interface ProjectJob {
  id: string
  role?: string
  title: string
  description?: string
  quantity?: number
  headcount?: number
  salaryType?: string
  budgetMin?: number
  budgetMax?: number
  budget?: number
  termsFileUrl?: string | null
  startedAt?: string | null
  finishedAt?: string | null
  status?: string
  skills?: string[] | JobSkill[]
  deletedAt?: string | null
  createdAt?: string
}

export interface ProjectSummary {
  id: string
  title: string
  description?: string
  startPrice?: number
  period: ProjectPeriod
  dueDate?: string
  startDate?: string
  endDate?: string
  experienceLevel?: ProjectExperienceLevel
  status: ProjectStatus
  closedAt?: string | null
  employer: EmployerSummary
  createdAt: string
  updatedAt?: string
}

export interface ProjectDetail {
  id: string
  title: string
  description?: string
  startPrice?: number
  period: ProjectPeriod
  dueDate?: string
  startDate?: string
  endDate?: string
  experienceLevel?: ProjectExperienceLevel
  status: ProjectStatus
  closedAt?: string | null
  employer: EmployerSummary
  jobs?: ProjectJob[]
  createdAt: string
  updatedAt: string
}

export interface CreateProjectPayload {
  title: string
  description?: string
  startPrice?: number
  period: ProjectPeriod
  dueDate?: string
  startDate?: string
  endDate?: string
  bidCloseDate?: string
  experienceLevel?: ProjectExperienceLevel
  skillIds?: string[]
  tags?: string[]
}

export interface UpdateProjectPayload {
  title?: string
  description?: string
  startPrice?: number
  period?: ProjectPeriod
  dueDate?: string
  startDate?: string
  endDate?: string
  bidCloseDate?: string
  experienceLevel?: ProjectExperienceLevel
  tags?: string[]
}

export interface ProjectFilterParams {
  keyword?: string
  status?: ProjectStatus
  employerId?: string
  period?: ProjectPeriod
  experienceLevel?: ProjectExperienceLevel
  minPrice?: number
  maxPrice?: number
  page?: number
  size?: number
  limit?: number
  sort?: string
}

export function toBackendPeriod(label?: string): ProjectPeriod {
  if (!label) return 'MONTHLY'
  const normalized = label.trim().toLowerCase()
  if (normalized.includes('giờ') || normalized === 'hourly') return 'HOURLY'
  if (normalized.includes('tuần') || normalized === 'weekly') return 'WEEKLY'
  if (normalized.includes('cố định') || normalized === 'fixed') return 'FIXED'
  return 'MONTHLY'
}

export function toBackendExperienceLevel(level?: string): ProjectExperienceLevel {
  if (!level) return 'INTERMEDIATE'
  const normalized = level.trim().toUpperCase()
  if (normalized === 'ENTRY') return 'ENTRY'
  if (normalized === 'EXPERT') return 'EXPERT'
  return 'INTERMEDIATE'
}

export function fromBackendPeriod(period?: ProjectPeriod): string {
  switch (period) {
    case 'HOURLY':
      return 'Theo giờ'
    case 'WEEKLY':
      return 'Hàng tuần'
    case 'FIXED':
      return 'Cố định'
    case 'MONTHLY':
    default:
      return 'Hàng tháng'
  }
}

export function toMyProject(detail: ProjectDetail | ProjectSummary): MyProject {
  const cleanPrice = detail.startPrice ?? 0
  const formattedSalary = `${cleanPrice.toLocaleString('vi-VN')} ₫`
  const periodLabel = fromBackendPeriod(detail.period)

  const recruitingRoles =
    'jobs' in detail && detail.jobs && detail.jobs.length > 0
      ? detail.jobs
          .filter((job) => !job.deletedAt)
          .map((job) => {
            const rawSkills: Array<string | JobSkill> = job.skills || []
            const skills: string[] = rawSkills
              .map((s) => (typeof s === 'string' ? s : s?.name))
              .filter((s): s is string => Boolean(s))

            let salaryRange = formattedSalary
            if (job.budgetMin != null && job.budgetMax != null) {
              salaryRange = `${job.budgetMin.toLocaleString('vi-VN')} - ${job.budgetMax.toLocaleString('vi-VN')} ₫`
            } else if (job.budgetMin != null) {
              salaryRange = `Từ ${job.budgetMin.toLocaleString('vi-VN')} ₫`
            } else if (job.budget != null) {
              salaryRange = `${job.budget.toLocaleString('vi-VN')} ₫`
            }

            const rawStatus = String(job.status || '').toUpperCase()
            const roleStatus: 'recruiting' | 'filled' | 'closed' =
              rawStatus === 'FILLED' ? 'filled' : rawStatus === 'CLOSED' ? 'closed' : 'recruiting'
            const slots = job.quantity || job.headcount || 1

            return {
              id: job.id,
              role: job.role,
              title: job.title,
              skills,
              salaryRange,
              salaryType: job.salaryType,
              termsFileUrl: job.termsFileUrl ?? null,
              startedAt: job.startedAt ?? null,
              finishedAt: job.finishedAt ?? null,
              slotsTotal: slots,
              slotsFilled: rawStatus === 'FILLED' ? slots : 0,
              status: roleStatus,
              jobDescription: job.description,
            }
          })
      : []

  const rawStartDate = 'startDate' in detail ? detail.startDate : undefined
  const bidCloseDate = rawStartDate
    ? rawStartDate.split('T')[0]
    : 'bidCloseDate' in detail
      ? (detail as { bidCloseDate?: string }).bidCloseDate
      : undefined

  return {
    id: detail.id,
    name: detail.title,
    description: detail.description,
    owner: detail.employer?.fullName || 'Chủ dự án',
    ownerCompany: detail.employer?.fullName,
    ownerRating: 5.0,
    period: periodLabel,
    dueDate: detail.dueDate,
    bidCloseDate,
    startPrice: detail.startPrice,
    status: detail.status,
    closedAt: 'closedAt' in detail ? detail.closedAt : null,
    tags: recruitingRoles.flatMap((r) => r.skills || []),
    members: [],
    recruitingRoles,
  }
}

export function getWorkspaceErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.errorCode) {
      case 'PROJ_001':
        return 'Không tìm thấy dự án hoặc dự án đã bị xóa.'
      case 'PROJ_002':
        return 'Bạn không có quyền chỉnh sửa hoặc đóng dự án này.'
      case 'PROJ_003':
        return 'Dự án đã được đóng hoặc không thể chuyển sang trạng thái này.'
      case 'PROJ_004':
        return 'Không tìm thấy hồ sơ chủ dự án trên hệ thống.'
      case 'SYS_001':
        return 'Hệ thống gặp sự cố nội bộ. Vui lòng thử lại sau.'
      case 'SYS_002':
        return 'Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra lại thông tin.'
      case 'SYS_003':
        return 'Không tìm thấy tài nguyên yêu cầu.'
      case 'SYS_006':
        return 'Định dạng mã định danh hoặc tham số không hợp lệ.'
      case 'SYS_008':
        return 'Dịch vụ tạm thời không khả dụng hoặc chưa xác thực. Vui lòng thử lại sau.'
      case 'SYS_009':
        return 'Bạn không có quyền thực hiện thao tác này hoặc yêu cầu bị quá thời gian.'
      case 'AUTH_003':
      case 'AUTH_005':
      case 'AUTH_SESSION_EXPIRED':
        return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      case 'NETWORK_ERROR':
        return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
      default:
        break
    }

    switch (error.statusCode) {
      case 400:
        return error.message || 'Dữ liệu yêu cầu không hợp lệ (400).'
      case 401:
        return 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn (401).'
      case 403:
        return 'Bạn không có quyền thực hiện thao tác này (403).'
      case 404:
        return 'Không tìm thấy dữ liệu yêu cầu (404).'
      case 409:
        return 'Dữ liệu bị xung đột trạng thái (409).'
      case 500:
        return 'Hệ thống máy chủ gặp lỗi nội bộ (500).'
      case 503:
        return 'Dịch vụ quản lý dự án tạm thời không khả dụng (503).'
      case 504:
        return 'Hết thời gian phản hồi từ máy chủ (504).'
      default:
        return error.message || 'Có lỗi xảy ra khi xử lý dữ liệu dự án.'
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Có lỗi xảy ra, vui lòng thử lại sau.'
}
