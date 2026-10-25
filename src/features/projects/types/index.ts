import type { JobExperienceLevel } from '@/features/jobs/types'

export interface ProjectRole {
  id: string
  title: string
  skills?: string[]
  salaryRange?: string
  slotsTotal?: number
  slotsFilled?: number
  status?: 'recruiting' | 'filled'
  assignedMemberName?: string
  jobDescription?: string
}

export interface ProjectMember {
  name: string
  email: string
  price: string
  dueDate?: string
  salaryDueDate?: string
  role?: string
  status?: string
}

export interface PendingProject {
  id: number
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
  id: number
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
  title: string
  description?: string
  quantity?: number
  headcount?: number
  salaryType?: string
  budgetMin?: number
  budgetMax?: number
  budget?: number
  status?: string
  skills?: string[] | JobSkill[]
  createdAt?: string
}

export interface ProjectSummary {
  id: string
  title: string
  description?: string
  startPrice?: number
  period: ProjectPeriod
  dueDate?: string
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
  bidCloseDate?: string
  experienceLevel?: ProjectExperienceLevel
  skillIds?: string[]
}

export interface UpdateProjectPayload {
  title?: string
  description?: string
  startPrice?: number
  period?: ProjectPeriod
  dueDate?: string
  bidCloseDate?: string
  experienceLevel?: ProjectExperienceLevel
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
      ? detail.jobs.map((job) => {
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

          const isFilled = String(job.status || '').toUpperCase() === 'FILLED'
          const roleStatus: 'recruiting' | 'filled' = isFilled ? 'filled' : 'recruiting'
          const slots = job.quantity || job.headcount || 1

          return {
            id: job.id,
            title: job.title,
            skills,
            salaryRange,
            slotsTotal: slots,
            slotsFilled: isFilled ? slots : 0,
            status: roleStatus,
            jobDescription: job.description,
          }
        })
      : []

  return {
    id: detail.id,
    name: detail.title,
    description: detail.description,
    owner: detail.employer?.fullName || 'Chủ dự án',
    ownerCompany: detail.employer?.fullName,
    ownerRating: 5.0,
    period: periodLabel,
    dueDate: detail.dueDate,
    startPrice: detail.startPrice,
    status: detail.status,
    closedAt: 'closedAt' in detail ? detail.closedAt : null,
    tags: recruitingRoles.flatMap((r) => r.skills || []),
    members: [],
    recruitingRoles,
  }
}
