// Dữ liệu mô phỏng danh sách các trường đại học (Mock schools dataset for Onboarding)
export const MOCK_SCHOOL_OPTIONS = [
  'Đại học Bách Khoa Hà Nội (HUST)',
  'Đại học Quốc gia Hà Nội (VNU)',
  'Đại học Quốc gia TP.HCM (VNUHCM)',
  'Đại học FPT',
  'Đại học Kinh tế Quốc dân (NEU)',
  'Đại học Ngoại thương',
  'Đại học Bách Khoa TP.HCM',
  'Đại học Công nghệ TP.HCM (HUTECH)',
  'Học viện Công nghệ Bưu chính Viễn thông',
  'Đại học Tôn Đức Thắng',
  'Đại học RMIT Việt Nam',
  'Trường khác',
] as const

/**
 * Fetches the list of universities/schools for onboarding profile completion.
 *
 * NOTE: Currently mocks the network response. When backend endpoint is available:
 * ```ts
 * import { apiClient } from '@/lib/api-client'
 * const response = await apiClient.get<string[]>('/schools')
 * return response.data
 * ```
 */
export async function getSchools(): Promise<readonly string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SCHOOL_OPTIONS)
    }, 60)
  })
}
