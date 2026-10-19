export type ViolationCategory = 'Tài khoản' | 'Dự án'
export type ViolationStatus = 'Chờ xử lý' | 'Đã giải quyết' | 'Đã bác bỏ'

export interface AdminViolation {
  id: string
  reporter: {
    name: string
    initials: string
    color: string
  }
  target: string
  category: ViolationCategory
  time: string
  status: ViolationStatus
  reason: string
  evidence: string
}
