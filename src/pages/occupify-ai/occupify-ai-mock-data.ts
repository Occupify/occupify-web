export interface MatchedContractSeed {
  id: number
  roleTitle: string
  projectTitle: string
  clientName: string
  clientRating: number
  completedProjects: number
  budget: string
  salaryType: 'fixed' | 'hourly' | 'monthly'
  salaryTypeLabel: string
  workingMode: 'Remote' | 'Hybrid' | 'On-site'
  duration: string
  postedAgo: string
  matchScore: number
  matchReason: string
  matchedSkills: string[]
  otherSkills: string[]
  description: string
  deadline: string
  isEscrowVerified: boolean
}

export const SEED_CONTRACTS: MatchedContractSeed[] = [
  {
    id: 101,
    roleTitle: 'Senior Frontend React / Next.js Engineer',
    projectTitle: 'Tái thiết kế Cổng Marketplace & Thanh toán Escrow B2B',
    clientName: 'Fintech Solutions Asia',
    clientRating: 4.9,
    completedProjects: 14,
    budget: '28.000.000 ₫',
    salaryType: 'fixed',
    salaryTypeLabel: 'Hợp đồng trọn gói',
    workingMode: 'Remote',
    duration: '3 tháng',
    postedAgo: '2 giờ trước',
    matchScore: 96,
    matchReason: 'Trùng khớp kỹ năng React, TypeScript và kinh nghiệm xây dựng Design System',
    matchedSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    otherSkills: ['RESTful API', 'Zustand'],
    description:
      'Cần kỹ sư Frontend có kinh nghiệm xây dựng ứng dụng web quy mô lớn, tối ưu hóa hiệu năng render, chuẩn hóa Design System và kết nối API thanh toán Escrow bảo chứng an toàn.',
    deadline: 'Còn 4 ngày nộp báo giá',
    isEscrowVerified: true,
  },
  {
    id: 102,
    roleTitle: 'Full-stack Node.js & React Developer',
    projectTitle: 'Nền tảng SaaS Quản lý Hợp đồng Điện tử & Chữ ký số',
    clientName: 'SaaS Innovate Labs',
    clientRating: 4.8,
    completedProjects: 9,
    budget: '450.000 ₫ / giờ',
    salaryType: 'hourly',
    salaryTypeLabel: 'Thanh toán theo giờ',
    workingMode: 'Remote',
    duration: '6 tháng',
    postedAgo: '5 giờ trước',
    matchScore: 92,
    matchReason:
      'Phù hợp định hướng kiến trúc Node.js, RESTful API và quản trị cơ sở dữ liệu PostgreSQL',
    matchedSkills: ['Node.js', 'React', 'PostgreSQL', 'Docker'],
    otherSkills: ['NestJS', 'Redis'],
    description:
      'Phát triển module ký kết hợp đồng và xác thực phân quyền đa bên. Yêu cầu thành thạo kiến trúc microservices và kinh nghiệm làm việc với Redis/PostgreSQL.',
    deadline: 'Còn 6 ngày nộp báo giá',
    isEscrowVerified: true,
  },
  {
    id: 103,
    roleTitle: 'Lead UI/UX & Design System Architect',
    projectTitle: 'Chuẩn hóa Thư viện Giao diện & Trải nghiệm Ứng dụng B2B',
    clientName: 'Base Technology Group',
    clientRating: 5.0,
    completedProjects: 21,
    budget: '32.000.000 ₫',
    salaryType: 'fixed',
    salaryTypeLabel: 'Hợp đồng trọn gói',
    workingMode: 'Hybrid',
    duration: '2 tháng',
    postedAgo: '1 ngày trước',
    matchScore: 89,
    matchReason:
      'Trùng khớp năng lực thiết kế Figma, nghiên cứu người dùng và chuyển giao kỹ thuật',
    matchedSkills: ['Figma', 'Design System', 'UI/UX', 'User Research'],
    otherSkills: ['Prototyping', 'Design Tokens'],
    description:
      'Nghiên cứu hành vi người dùng, tái cấu trúc hệ thống design token và xây dựng bộ component hoàn chỉnh để chuyển giao cho đội ngũ Frontend triển khai.',
    deadline: 'Còn 3 ngày nộp báo giá',
    isEscrowVerified: true,
  },
  {
    id: 104,
    roleTitle: 'Backend Specialist (Java / Spring Boot & Microservices)',
    projectTitle: 'Xây dựng Core API Gateway & Hệ thống Giao dịch Phân tán',
    clientName: 'VNPAY Ecosystem',
    clientRating: 4.9,
    completedProjects: 27,
    budget: '36.000.000 ₫',
    salaryType: 'fixed',
    salaryTypeLabel: 'Hợp đồng trọn gói',
    workingMode: 'On-site',
    duration: '4 tháng',
    postedAgo: '1 ngày trước',
    matchScore: 85,
    matchReason: 'Đạt yêu cầu về xử lý cơ sở dữ liệu lớn và thiết kế API bảo mật cao',
    matchedSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'RESTful API'],
    otherSkills: ['Docker', 'Kafka', 'Kubernetes'],
    description:
      'Thiết kế và triển khai các microservice xử lý luồng đối soát tự động, tối ưu hóa truy vấn dữ liệu và tuân thủ các tiêu chuẩn bảo mật thanh toán ngân hàng.',
    deadline: 'Còn 5 ngày nộp báo giá',
    isEscrowVerified: true,
  },
  {
    id: 105,
    roleTitle: 'Mobile Application Engineer (React Native)',
    projectTitle: 'Ứng dụng Quản lý Ví điện tử & Hợp đồng Thông minh trên Di động',
    clientName: 'MobiTech Global',
    clientRating: 4.7,
    completedProjects: 7,
    budget: '25.000.000 ₫',
    salaryType: 'fixed',
    salaryTypeLabel: 'Hợp đồng trọn gói',
    workingMode: 'Remote',
    duration: '3 tháng',
    postedAgo: '2 ngày trước',
    matchScore: 82,
    matchReason: 'Phù hợp năng lực React cross-platform và tích hợp API hệ thống',
    matchedSkills: ['React', 'TypeScript', 'RESTful API'],
    otherSkills: ['React Native', 'Mobile UI', 'Push Notification'],
    description:
      'Xây dựng ứng dụng di động cho cả hai nền tảng iOS và Android, hỗ trợ thông báo đẩy thời gian thực, quản lý danh sách hợp đồng và ví ký quỹ.',
    deadline: 'Còn 7 ngày nộp báo giá',
    isEscrowVerified: true,
  },
  {
    id: 106,
    roleTitle: 'DevOps & Cloud Infrastructure Engineer',
    projectTitle: 'Thiết lập Hạ tầng Kubernetes & CI/CD Pipeline Tự động hóa',
    clientName: 'CloudBridge Solutions',
    clientRating: 4.9,
    completedProjects: 16,
    budget: '500.000 ₫ / giờ',
    salaryType: 'hourly',
    salaryTypeLabel: 'Thanh toán theo giờ',
    workingMode: 'Remote',
    duration: '5 tháng',
    postedAgo: '3 ngày trước',
    matchScore: 78,
    matchReason: 'Phù hợp với các kỹ năng Docker, AWS và tự động hóa quy trình triển khai',
    matchedSkills: ['AWS', 'Docker', 'CI/CD'],
    otherSkills: ['Kubernetes', 'Terraform', 'Prometheus'],
    description:
      'Cấu hình hạ tầng đám mây trên AWS, thiết lập hệ thống tự động co giãn tài nguyên, pipeline kiểm thử tự động và giám sát cảnh báo hoạt động 24/7.',
    deadline: 'Còn 2 ngày nộp báo giá',
    isEscrowVerified: true,
  },
]

export interface ChatMessage {
  id: string
  sender: 'ai' | 'user'
  text: string
  timestamp: string
}

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'ai',
    text: 'Xin chào! Tôi là Trợ lý Occupify AI. Sau khi tải CV hoặc chọn CV từ hồ sơ, bạn có thể nhắn thêm các tiêu chí mong muốn (như làm việc Remote, mức thù lao tối thiểu, hoặc kỹ năng ưu tiên) để tôi tinh chỉnh danh sách hợp đồng phù hợp nhất.',
    timestamp: 'Vừa xong',
  },
]

export const SUGGESTED_PROMPTS = [
  'Lọc việc 100% Remote',
  'Ngân sách trên 30 triệu',
  'Hợp đồng thanh toán theo giờ',
  'Dự án React & TypeScript',
]

/**
 * Converts a MatchedContractSeed from Occupify AI into a complete JobListing structure
 * for rendering in JobDetailsView or related views.
 */
export function matchedContractToJobListing(
  seed: MatchedContractSeed,
): import('@/features/jobs').JobListing {
  const numericSalary = parseInt(seed.budget.replace(/\D/g, ''), 10) || 30000000
  return {
    id: seed.id,
    title: seed.projectTitle,
    clientName: seed.clientName,
    company: seed.clientName,
    companyInitials: seed.clientName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase(),
    companyColor: '#0A66C2',
    location: `Toàn quốc · ${seed.workingMode}`,
    postedAgo: seed.postedAgo,
    budget: seed.budget,
    avgBid: seed.budget,
    salaryType: seed.salaryType,
    salaryValue: numericSalary,
    description: seed.description,
    skills: [...seed.matchedSkills, ...seed.otherSkills],
    hiring: true,
    viewsCount: 142,
    submitsCount: 5,
    openPositions: 1,
    filledPositions: 0,
    status: 'OPEN',
    experienceLevel: 'intermediate',
    clientRating: seed.clientRating,
    duration: seed.duration,
    hoursPerDay: seed.salaryType === 'hourly' ? 4 : 8,
    dueDate: seed.deadline,
    bidCloseDate: seed.deadline,
    tags: [seed.workingMode, seed.salaryTypeLabel, ...seed.matchedSkills],
    completedProjectsCount: seed.completedProjects,
    contractDuration: seed.duration,
    salaryDueDate: seed.salaryTypeLabel,
    roles: [
      {
        id: `role-${seed.id}`,
        title: seed.roleTitle,
        minBudget: Math.round(numericSalary * 0.9),
        maxBudget: Math.round(numericSalary * 1.1),
        budgetDisplay: seed.budget,
        salaryType: seed.salaryType,
        salaryTypeLabel: seed.salaryTypeLabel,
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
        jd: seed.description,
        requirements: [
          `Có kinh nghiệm thực tế với ${seed.matchedSkills.join(', ')}`,
          'Khả năng làm việc độc lập, chủ động bám sát tiến độ và báo cáo định kỳ',
          'Chất lượng bàn giao đầu ra đáp ứng tiêu chuẩn nghiệm thu của dự án',
        ],
        skills: seed.matchedSkills,
      },
    ],
  }
}
