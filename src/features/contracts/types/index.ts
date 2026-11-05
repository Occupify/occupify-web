import type { MyProject, ProjectMember, PendingProject } from '@/features/projects/types'

export type ContractStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface ContractEmployerSummary {
  id: string
  fullName?: string
  email?: string
  avatarUrl?: string
}

export interface ContractEmployeeSummary {
  id: string
  fullName?: string
  email?: string
  avatarUrl?: string
}

export interface ContractSummaryResponse {
  id: string
  role?: string
  title?: string
  freelancerEmail?: string
  message?: string
  employerId?: string
  employerName?: string
  employeeId?: string | null
  employeeName?: string | null
  projectId?: string
  projectTitle?: string
  jobId?: string
  jobTitle?: string
  agreedRate?: number
  salaryType?: string
  salaryDueDate?: string
  status: ContractStatus
  paymentStatus?: string
  termsFileUrl?: string | null
  startedAt?: string | null
  finishedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface CancellationContractResponse {
  id: string
  reason: string
  evidenceFileUrl?: string | null
  status: string
  requestedByName?: string
  createdAt?: string
}

export interface ContractDetailResponse extends ContractSummaryResponse {
  employer?: ContractEmployerSummary
  employee?: ContractEmployeeSummary
  jobDescription?: string
  termsFileKey?: string | null
  termsFileUrl?: string | null
  cancellationResponse?: CancellationContractResponse | null
}

export interface CreateContractPayload {
  jobId: string
  freelancerEmail: string
  message?: string
  file?: File | null
}

export interface UpdateContractPayload {
  jobId?: string
  freelancerEmail?: string
  message?: string
  file?: File | null
}

export interface CompleteContractPayload {
  rating: number
  comment?: string
}

export interface ContractFilterParams {
  projectId?: string
  status?: ContractStatus
  page?: number
  limit?: number
  sort?: string
}

/**
 * Format currency into standard Vietnamese Dong string
 */
export function formatCurrencyVND(amount?: number | null): string {
  if (amount == null) return '0 ₫'
  return `${amount.toLocaleString('vi-VN')} ₫`
}

/**
 * Maps a backend ContractSummaryResponse into a MyProject object for employee/participant view
 */
export function toMyProjectFromContract(
  contract: ContractSummaryResponse,
  currentUserId?: string,
): MyProject {
  const isEmployee = !currentUserId || String(contract.employeeId) === String(currentUserId)
  const formattedSalary = formatCurrencyVND(contract.agreedRate)
  const roleName = contract.role || contract.jobTitle || contract.title || 'Thành viên dự án'

  const member: ProjectMember = {
    name: isEmployee
      ? `${contract.employeeName || 'Tôi'} (Tôi)`
      : contract.employeeName || contract.freelancerEmail || 'Ứng viên',
    email: contract.freelancerEmail || '',
    price: formattedSalary,
    dueDate: contract.finishedAt ? contract.finishedAt.slice(0, 10) : '2026-12-31',
    salaryDueDate:
      contract.salaryDueDate ||
      (contract.salaryType === 'HOURLY' ? 'Theo giờ làm việc' : 'Ngày 05 hàng tháng'),
    role: roleName,
    status:
      contract.status === 'IN_PROGRESS'
        ? 'Đang làm'
        : contract.status === 'COMPLETED'
          ? 'Đã hoàn thành'
          : 'Đã hủy',
  }

  return {
    id: contract.id,
    name: contract.projectTitle || contract.title || `Hợp đồng ${roleName}`,
    description: contract.message || undefined,
    owner: contract.employerName || 'Chủ dự án',
    ownerCompany: contract.employerName,
    ownerRating: 5.0,
    period:
      contract.salaryType === 'HOURLY'
        ? 'Theo giờ'
        : contract.salaryType === 'FIXED'
          ? 'Cố định'
          : 'Hàng tháng',
    dueDate: contract.finishedAt ? contract.finishedAt.slice(0, 10) : undefined,
    startPrice: contract.agreedRate,
    status: contract.status === 'IN_PROGRESS' ? 'OPEN' : 'CLOSED',
    tags: [roleName],
    members: [member],
  }
}

/**
 * Maps a backend ContractSummaryResponse into a ProjectMember for project detail view
 */
export function toProjectMemberFromContract(contract: ContractSummaryResponse): ProjectMember {
  const formattedPrice = formatCurrencyVND(contract.agreedRate)
  const roleName = contract.role || contract.jobTitle || contract.title || 'Thành viên dự án'

  let memberStatus = 'Đang làm'
  if (contract.status === 'PENDING') memberStatus = 'Chờ phản hồi'
  else if (contract.status === 'COMPLETED') memberStatus = 'Đã hoàn thành'
  else if (contract.status === 'CANCELLED') memberStatus = 'Đã hủy'

  return {
    id: contract.id,
    contractId: contract.id,
    name: contract.employeeName || contract.freelancerEmail || 'Ứng viên',
    email: contract.freelancerEmail || '',
    price: formattedPrice,
    dueDate: contract.finishedAt ? contract.finishedAt.slice(0, 10) : undefined,
    salaryDueDate: contract.salaryDueDate || 'Ngày 05 hàng tháng',
    role: roleName,
    status: memberStatus,
  }
}

/**
 * Maps a backend ContractSummaryResponse into a PendingProject for invitation card/modal
 */
export function toPendingProjectFromContract(contract: ContractSummaryResponse): PendingProject {
  const formattedPrice = formatCurrencyVND(contract.agreedRate)
  const roleName = contract.role || contract.jobTitle || contract.title || 'Thành viên dự án'

  return {
    id: contract.id as unknown as number,
    name: contract.projectTitle || contract.title || `Dự án tuyển ${roleName}`,
    owner: contract.employerName || 'Chủ dự án',
    ownerCompany: contract.employerName,
    ownerRating: 5.0,
    ownerCompletedProjects: 12,
    period:
      contract.salaryType === 'HOURLY'
        ? 'Theo giờ'
        : contract.salaryType === 'FIXED'
          ? 'Cố định'
          : 'Hàng tháng',
    price: formattedPrice,
    dueDate: contract.finishedAt ? contract.finishedAt.slice(0, 10) : undefined,
    description: contract.message || `Lời mời tham gia vị trí ${roleName}`,
    tags: [roleName],
    invitedRole: roleName,
    inviteMessage: contract.message || undefined,
  }
}
