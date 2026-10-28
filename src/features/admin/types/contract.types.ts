export type ContractStatus = 'Đang thực hiện' | 'Hoàn thành' | 'Đã hủy / Thất bại'

export type ContractPaymentPeriod = 'Hàng tháng' | 'Hàng tuần' | 'Hàng quý' | 'Cố định'

export interface AdminContractParty {
  name: string
  initials: string
  color: string
  role: string
  email: string
  phone: string
  rating: number
  reviewCount: number
}

export interface AdminContractAttachment {
  name: string
  size: string
  url?: string
}

export interface AdminContract {
  id: string
  project: string
  client: AdminContractParty
  freelancer: AdminContractParty
  value: string
  period: ContractPaymentPeriod
  startDate: string
  endDate: string
  status: ContractStatus
  attachment: AdminContractAttachment

  // Giữ lại để đảm bảo tính tương thích với bảng danh sách Admin
  payment: string
  dateRange: string
}
