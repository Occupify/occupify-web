import type { EntityId } from './common.types'

export interface ProjectHistoryItem {
  id: EntityId
  title: string
  date: string
  amount: string
  status: 'Hoàn thành' | 'Đang thực hiện' | 'COMPLETED' | 'IN_PROGRESS' | string
}

export type UserStatus =
  'ACTIVE' | 'FLAGGED' | 'SUSPENDED' | 'BANNED' | 'Hoạt động' | 'Bị gắn cờ' | 'Bị khóa'

export type UserRole = 'Freelancer' | 'Client' | 'FREELANCER' | 'CLIENT' | 'ADMIN' | 'USER' | string

export interface AdminUser {
  id: EntityId
  name: string
  email: string
  role: UserRole
  status: UserStatus
  joined: string
  initials: string
  color: string
  phone?: string
  joinedProjects: number
  createdProjects: number
  completionRate: string
  moneyIn?: string
  moneyOut?: string
  rating: number
  ratingCount: number
  reportsCount: number
  reportCount?: number
  flagCount?: number
  lastLogin: string
  projectHistory: ProjectHistoryItem[]
}
