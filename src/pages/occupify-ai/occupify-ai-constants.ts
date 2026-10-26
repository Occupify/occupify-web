export type AiFeatureKey =
  'improve-cv' | 'build-roadmap' | 'find-freelancer' | 'job-recommendation' | 'create-project'

export interface AiFeatureItem {
  id: AiFeatureKey
  title: string
  subtitle: string
  description: string
  iconKey: 'file-text' | 'compass' | 'users' | 'briefcase' | 'folder-plus'
  route: string
}

export const AI_FEATURES: AiFeatureItem[] = [
  {
    id: 'improve-cv',
    title: 'Improve your CV',
    subtitle: 'Nâng cấp & Chuẩn hóa hồ sơ',
    description:
      'Tối ưu hóa từ khóa chuyên môn, cấu trúc trải nghiệm và format chuẩn cho các dự án hợp đồng.',
    iconKey: 'file-text',
    route: '/occupify-ai/improve-cv',
  },
  {
    id: 'build-roadmap',
    title: 'Build your roadmap',
    subtitle: 'Lộ trình phát triển kỹ năng',
    description:
      'Xây dựng lộ trình thăng tiến chuyên môn và mục tiêu thu nhập theo từng cột mốc rõ ràng.',
    iconKey: 'compass',
    route: '/occupify-ai/build-roadmap',
  },
  {
    id: 'find-freelancer',
    title: 'Find freelancer',
    subtitle: 'Tìm kiếm nhân tài dự án',
    description:
      'Phân tích yêu cầu bài toán kỹ thuật để gợi ý danh sách ứng viên freelance có năng lực cao.',
    iconKey: 'users',
    route: '/occupify-ai/find-freelancer',
  },
  {
    id: 'job-recommendation',
    title: 'Job recommendation',
    subtitle: 'Gợi ý hợp đồng phù hợp',
    description:
      'Đối soát hồ sơ CV với dữ liệu các dự án đang tuyển dụng và gợi ý hợp đồng có độ khớp cao nhất.',
    iconKey: 'briefcase',
    route: '/occupify-ai/job-recommendation',
  },
  {
    id: 'create-project',
    title: 'Create your project',
    subtitle: 'Khởi tạo dự án & Hợp đồng',
    description:
      'Tự động tạo bản mô tả công việc (JD), tiêu chí nghiệm thu và phân rã các mốc thanh toán Escrow.',
    iconKey: 'folder-plus',
    route: '/occupify-ai/create-project',
  },
]
