import type { JobFilterMetadata } from '../types'

const MOCK_JOB_FILTER_METADATA: JobFilterMetadata = {
  salaryTypes: [
    { value: 'all', label: 'Tất cả hình thức' },
    { value: 'fixed', label: 'Cố định / Dự án' },
    { value: 'hourly', label: 'Theo giờ' },
    { value: 'weekly', label: 'Theo tuần' },
    { value: 'monthly', label: 'Theo tháng' },
  ],
  timeFilters: [
    { value: 'all', label: 'Tất cả thời gian' },
    { value: '24h', label: '24 giờ qua' },
    { value: '3d', label: '3 ngày qua' },
    { value: '7d', label: '7 ngày qua' },
    { value: '30d', label: '30 ngày qua' },
  ],
  sortOptions: [
    { value: 'latest', label: 'Mới nhất' },
    { value: 'most-viewed', label: 'Xem nhiều nhất (Hot)' },
    { value: 'least-proposals', label: 'Ít cạnh tranh (<5 ứng tuyển)' },
    { value: 'budget-desc', label: 'Ngân sách cao nhất' },
  ],
  experienceLevels: [
    { value: 'all', label: 'Tất cả cấp độ' },
    { value: 'entry', label: 'Mới bắt đầu (Entry)' },
    { value: 'intermediate', label: 'Có kinh nghiệm (Intermediate)' },
    { value: 'expert', label: 'Chuyên gia (Expert)' },
  ],
  jobStatuses: [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'OPEN', label: '🟢 Đang mở tuyển' },
    { value: 'CLOSED', label: '⚪ Đã đóng tuyển' },
  ],
  budgetRanges: [
    { value: 'all', label: 'Tất cả mức ngân sách' },
    { value: 'under-5m', label: 'Dưới 5 triệu ₫' },
    { value: '5m-20m', label: '5 – 20 triệu ₫' },
    { value: '20m-50m', label: '20 – 50 triệu ₫' },
    { value: 'above-50m', label: 'Trên 50 triệu ₫' },
  ],
  hoursPerDay: [
    { value: 'all', label: 'Tất cả thời lượng' },
    { value: 'under-4h', label: 'Dưới 4h / ngày (Part-time)' },
    { value: '4h-8h', label: '4h – 8h / ngày (Bán toàn thời gian)' },
    { value: 'above-8h', label: 'Trên 8h / ngày (Toàn thời gian)' },
  ],
}

/**
 * Fetches the available filter options and metadata for jobs.
 *
 * NOTE: Currently mocks the network response. When backend endpoint is available:
 * ```ts
 * import { apiClient } from '@/lib/api-client'
 * const response = await apiClient.get<JobFilterMetadata>('/jobs/filters')
 * return response.data
 * ```
 */
export async function getJobFilters(): Promise<JobFilterMetadata> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_JOB_FILTER_METADATA)
    }, 60)
  })
}
