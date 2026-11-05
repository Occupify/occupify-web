import type { EntityId } from './common.types'

export interface ProjectApplicant {
  name: string
  initials: string
  color: string
  date: string
  bid: string
}

export type ProjectReportStatus =
  | 'PENDING'
  | 'INVESTIGATING'
  | 'RESOLVED'
  | 'DISMISSED'
  | 'Chờ xử lý'
  | 'Đang xác minh'
  | 'Đã giải quyết'
  | 'Đã bác bỏ'

export interface AdminProjectReport {
  id: EntityId
  reporterName: string
  reporterEmail?: string
  reporterInitials?: string
  reporterColor?: string
  violationCategory: string
  description: string
  createdAt: string
  status: ProjectReportStatus
}

export type ProjectStatus =
  | 'OPEN'
  | 'HIRING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CLOSED'
  | 'SUSPENDED'
  | 'Đang tuyển'
  | 'Đang thực hiện'
  | 'Đã đóng'

export interface AdminProject {
  id: EntityId
  title: string
  owner: {
    name: string
    initials: string
    color: string
    email?: string
  }
  budget?: string
  budgetType?: 'Cố định' | 'Hàng tháng' | string
  field?: string
  applicants?: number
  status: ProjectStatus
  date: string
  description: string
  skills?: string[]
  reports?: AdminProjectReport[]
  reportCount?: number
  applicantList?: ProjectApplicant[]
}
