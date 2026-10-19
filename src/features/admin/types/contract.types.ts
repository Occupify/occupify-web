export type ContractStatus = 'Đang thực hiện' | 'Hoàn thành' | 'Đã hủy / Thất bại'

export interface AdminContract {
  id: string
  project: string
  client: {
    name: string
    initials: string
    color: string
  }
  freelancer: {
    name: string
    initials: string
    color: string
  }
  payment: string
  dateRange: string
  status: ContractStatus
}
