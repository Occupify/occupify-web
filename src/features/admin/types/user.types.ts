export interface ProjectHistoryItem {
  id: number
  title: string
  date: string
  amount: string
  status: 'Hoàn thành' | 'Đang thực hiện'
}

export type UserStatus = 'Hoạt động' | 'Bị gắn cờ' | 'Bị khóa'
export type UserRole = 'Freelancer' | 'Client'

export interface AdminUser {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  joined: string
  initials: string
  color: string
  phone: string
  joinedProjects: number
  createdProjects: number
  completionRate: string
  moneyIn: string
  moneyOut: string
  rating: number
  ratingCount: number
  reportsCount: number
  lastLogin: string
  projectHistory: ProjectHistoryItem[]
}
