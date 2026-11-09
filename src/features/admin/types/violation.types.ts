export type ViolationCategory = 'Tài khoản' | 'Dự án'
export type ViolationStatus =
  | 'Chờ xử lý'
  | 'Đang xác minh'
  | 'Đã giải quyết'
  | 'Đã bác bỏ'
  | 'PENDING'
  | 'INVESTIGATING'
  | 'RESOLVED'
  | 'DISMISSED'

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
  evidenceImage?: string
  actionTaken?: string
  resolveNote?: string
  resolvedAt?: string
}
