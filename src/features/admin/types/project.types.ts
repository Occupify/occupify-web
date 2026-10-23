export interface ProjectApplicant {
  name: string
  initials: string
  color: string
  date: string
  bid: string
}

export type ProjectStatus = 'Đang tuyển' | 'Đang thực hiện' | 'Đã đóng'

export interface AdminProject {
  id: number
  title: string
  owner: {
    name: string
    initials: string
    color: string
  }
  budget: string
  budgetType: 'Cố định' | 'Hàng tháng'
  field: string
  applicants: number
  status: ProjectStatus
  date: string
  description: string
  skills: string[]
  applicantList: ProjectApplicant[]
}
