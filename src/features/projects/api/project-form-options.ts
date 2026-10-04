import type { JobExperienceLevel } from '@/features/jobs/types'

export const PREDEFINED_PROJECT_FIELDS: string[] = [
  'Thiết kế UI/UX',
  'Phát triển Web',
  'Ứng dụng Di động',
  'Backend / API',
  'AI & Machine Learning',
  'Đồ họa & Thương hiệu',
  'Marketing & Content',
  'Data & Phân tích',
  'DevOps & Cloud',
  'Blockchain / Web3',
]

export const CY_PERIODS: string[] = ['Theo giờ', 'Hàng tuần', 'Hàng tháng', 'Cố định']

export interface ExperienceLevelOption {
  value: JobExperienceLevel
  label: string
  description: string
}

export const EXPERIENCE_LEVEL_OPTIONS: ExperienceLevelOption[] = [
  {
    value: 'entry',
    label: 'Mới bắt đầu',
    description: 'Dành cho sinh viên, thực tập sinh hoặc người mới bắt đầu',
  },
  {
    value: 'intermediate',
    label: 'Có kinh nghiệm',
    description: 'Yêu cầu 1-3 năm kinh nghiệm thực chiến, hoàn thành công việc độc lập',
  },
  {
    value: 'expert',
    label: 'Chuyên gia',
    description: 'Yêu cầu trên 3-5 năm kinh nghiệm, tư duy kiến trúc và kỹ năng chuyên sâu',
  },
]

export interface HoursPerDayOption {
  value: number
  label: string
  badge: string
}

export const HOURS_PER_DAY_OPTIONS: HoursPerDayOption[] = [
  { value: 2, label: '2h / ngày', badge: 'Part-time linh hoạt' },
  { value: 4, label: '4h / ngày', badge: 'Bán thời gian tiêu chuẩn' },
  { value: 8, label: '8h / ngày', badge: 'Toàn thời gian' },
]

export const DURATION_OPTIONS: string[] = [
  'Dưới 1 tháng',
  '1 - 3 tháng',
  '3 - 6 tháng',
  'Trên 6 tháng',
]

export const CONTRACT_DURATION_OPTIONS: string[] = [
  '1 tháng',
  '2 tháng',
  '3 tháng',
  '6 tháng',
  '12 tháng',
  'Linh hoạt / Thỏa thuận',
]
