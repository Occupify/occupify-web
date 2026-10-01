import type { MyProject, PendingProject } from './projects/types'
import type { Notif } from './notifications/types'
import type { JobListing } from './saved-items/types'

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECTS MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const MY_PROJECTS_DATA: MyProject[] = [
  {
    id: 1,
    name: 'Redesign Mobile App',
    description:
      'Tái thiết kế toàn bộ trải nghiệm người dùng, luồng thanh toán và giao diện ứng dụng di động cho hơn 200.000 người dùng hàng ngày.',
    owner: 'Tôi (Chủ dự án)',
    period: 'Hàng tháng',
    dueDate: '2026-12-31',
    tags: ['Mobile App', 'React Native', 'UI/UX', 'Fintech'],
    recruitingRoles: [
      {
        id: 'mr1',
        title: 'Backend Developer',
        skills: ['Node.js', 'NestJS', 'PostgreSQL', 'Redis'],
        salaryRange: '18.000.000 - 25.000.000 ₫',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
      },
      {
        id: 'mr2',
        title: 'Frontend Developer',
        skills: ['React Native', 'TypeScript', 'Tailwind'],
        salaryRange: '15.000.000 - 22.000.000 ₫',
        slotsTotal: 1,
        slotsFilled: 1,
        status: 'filled',
        assignedMemberName: 'Nguyễn Thị Thu',
      },
      {
        id: 'mr3',
        title: 'UI/UX Designer',
        skills: ['Figma', 'Design System', 'User Testing'],
        salaryRange: '12.000.000 - 18.000.000 ₫',
        slotsTotal: 1,
        slotsFilled: 1,
        status: 'filled',
        assignedMemberName: 'Lê Văn Hùng',
      },
      {
        id: 'mr4',
        title: 'QA / Tester Lead',
        skills: ['Appium', 'Postman', 'Automation Testing'],
        salaryRange: '10.000.000 - 15.000.000 ₫',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
      },
    ],
    members: [
      {
        name: 'Lê Văn Hùng',
        email: 'hung.le@gmail.com',
        price: '12.000.000 ₫',
        dueDate: '2026-12-31',
        salaryDueDate: 'Ngày 05 hàng tháng',
        role: 'UI/UX Designer',
        status: 'Đang làm',
      },
      {
        name: 'Nguyễn Thị Thu',
        email: 'thu.nguyen@gmail.com',
        price: '10.000.000 ₫',
        dueDate: '2026-11-30',
        salaryDueDate: 'Ngày 05 hàng tháng',
        role: 'Frontend Developer',
        status: 'Đang làm',
      },
    ],
  },
  {
    id: 2,
    name: 'Xây dựng Design System SaaS',
    description:
      'Quy chuẩn hóa toàn bộ thư viện component, token màu sắc, typography và micro-interactions cho hệ sinh thái sản phẩm SaaS B2B.',
    owner: 'Tôi (Chủ dự án)',
    period: 'Hàng quý',
    dueDate: '2027-03-31',
    tags: ['Design System', 'Storybook', 'React', 'SaaS'],
    recruitingRoles: [
      {
        id: 'mr5',
        title: 'Frontend Engineer',
        skills: ['React', 'Storybook', 'Tailwind CSS', 'Accessibility'],
        salaryRange: '20.000.000 - 28.000.000 ₫',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
      },
      {
        id: 'mr6',
        title: 'UI/UX Lead',
        skills: ['Figma Tokens', 'Design Architecture', 'Guidelines'],
        salaryRange: '25.000.000 - 35.000.000 ₫',
        slotsTotal: 1,
        slotsFilled: 1,
        status: 'filled',
        assignedMemberName: 'Phạm Đức Anh',
      },
      {
        id: 'mr7',
        title: 'Fullstack Developer',
        skills: ['Next.js', 'Node.js', 'PostgreSQL'],
        salaryRange: '22.000.000 - 30.000.000 ₫',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
      },
    ],
    members: [
      {
        name: 'Phạm Đức Anh',
        email: 'duc.anh@gmail.com',
        price: '15.000.000 ₫',
        dueDate: '2027-03-31',
        salaryDueDate: 'Ngày 15 hàng quý',
        role: 'UI/UX Lead',
        status: 'Đang làm',
      },
    ],
  },
]

export const EMPLOYEE_PROJECTS_DATA: MyProject[] = [
  {
    id: 2,
    name: 'Xây dựng API REST cho hệ thống ERP',
    description:
      'Tái cấu trúc và xây dựng bộ API RESTful toàn diện kết nối các phân hệ nhân sự, chuỗi cung ứng, kho vận và kế toán doanh nghiệp cho đối tác quốc tế.',
    owner: 'Lê Thị Hoa',
    ownerCompany: 'SmartLog ERP Solutions',
    ownerRating: 5.0,
    period: 'Cố định',
    dueDate: '2027-01-15',
    tags: ['ERP', 'RESTful API', 'Database Optimization', 'Enterprise'],
    members: [
      {
        name: 'Nguyễn Minh Khoa (Tôi)',
        email: 'khoa@gmail.com',
        price: '40.000.000 ₫',
        salaryDueDate: 'Hoàn thành nghiệm thu',
        role: 'Backend Developer',
        status: 'Đang làm',
      },
    ],
  },
  {
    id: 10,
    name: 'Thiết kế landing page chiến dịch Marketing',
    description:
      'Xây dựng landing page tối ưu chuyển đổi và animation mượt mà phục vụ chiến dịch mở bán sản phẩm Q3/2026.',
    owner: 'Trần Minh Khoa',
    ownerCompany: 'Alpha Media & Tech',
    ownerRating: 4.9,
    period: 'Cố định',
    dueDate: '2026-08-20',
    tags: ['Landing Page', 'Animation', 'Framer', 'Marketing'],
    members: [
      {
        name: 'Nguyễn Minh Khoa (Tôi)',
        email: 'khoa@gmail.com',
        price: '12.000.000 ₫',
        salaryDueDate: 'Hoàn thành nghiệm thu',
        role: 'Frontend Developer',
        status: 'Đang làm',
      },
    ],
  },
  {
    id: 11,
    name: 'Prototyping & User Testing Dashboard',
    description:
      'Thực hiện interactive prototype độ trung thực cao và tổ chức chuỗi 15 buổi kiểm thử người dùng cho dashboard giám sát AI.',
    owner: 'Công ty Công nghệ Nova',
    ownerCompany: 'Nova AI Systems',
    ownerRating: 5.0,
    period: 'Hàng tháng',
    dueDate: '2026-07-10',
    tags: ['Dashboard', 'AI Monitoring', 'Usability Testing'],
    members: [
      {
        name: 'Nguyễn Minh Khoa (Tôi)',
        email: 'khoa@gmail.com',
        price: '32.000.000 ₫',
        salaryDueDate: 'Ngày 05 hàng tháng',
        role: 'UX Researcher & Prototyper',
        status: 'Đang làm',
      },
    ],
  },
]

export const PENDING_PROJECTS_DATA: PendingProject[] = [
  {
    id: 3,
    name: 'Phân tích dữ liệu người dùng Q4',
    description:
      'Nghiên cứu hành vi khách hàng, xây dựng dashboard phân tích chỉ số chuyển đổi, phễu mua hàng và dự báo churn rate cho sàn thương mại điện tử hàng đầu.',
    owner: 'Phạm Văn Dũng',
    ownerRole: 'Data Lead & Founder',
    ownerCompany: 'InsightMetrics Co.',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    ownerRating: 4.8,
    ownerCompletedProjects: 14,
    price: '18.000.000 ₫',
    period: 'Hàng quý',
    dueDate: '2026-12-25',
    invitedRole: 'Data & BI Analyst',
    inviteMessage:
      'Chào bạn, qua hồ sơ ấn tượng của bạn trên Occupify, chúng tôi nhận thấy kinh nghiệm kiến trúc microservice và tối ưu cơ sở dữ liệu của bạn rất phù hợp với vị trí Backend Developer cho module thanh toán lõi của dự án. Rất mong được hợp tác cùng bạn!',
    tags: ['Fintech', 'Mobile Banking', 'Microservices', 'High Security'],
    recruitingRoles: [
      {
        id: 'pr3_1',
        title: 'Data & BI Analyst',
        skills: ['Python', 'SQL', 'PowerBI', 'Data Cleaning'],
        salaryRange: '16.000.000 - 22.000.000 ₫',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
      },
      {
        id: 'pr3_2',
        title: 'Backend Data Engineer',
        skills: ['ETL Pipelines', 'Airflow', 'BigQuery'],
        salaryRange: '24.000.000 - 32.000.000 ₫',
        slotsTotal: 1,
        slotsFilled: 1,
        status: 'filled',
        assignedMemberName: 'Đặng Hoàng Nam',
      },
    ],
  },
]

export const CY_PERIODS: string[] = ['Hàng tuần', 'Hàng tháng', 'Hàng quý', 'Cố định']

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

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const MOCK_NOTIFICATIONS: Notif[] = [
  {
    id: 1,
    title: 'Hợp đồng mới được gửi đến bạn',
    content:
      'Công ty Cổ phần Công nghệ TechVibe đã gửi cho bạn hợp đồng cho dự án "Thiết kế UI/UX Mobile Banking". Vui lòng xem và ký xác nhận.',
    time: '5 phút trước',
    isRead: false,
    actorName: 'TechVibe Corp',
    badgeType: 'contract',
    link: '/workspace',
  },
  {
    id: 2,
    title: 'Đề xuất ứng tuyển đã được chấp nhận',
    content:
      'Lời ứng tuyển vị trí Fullstack Developer của bạn cho dự án "Nền tảng Quản trị Chuỗi cung ứng" đã được chấp thuận.',
    time: '1 giờ trước',
    isRead: false,
    actorName: 'LogiChain Solutions',
    badgeType: 'proposal',
    link: '/workspace',
  },
  {
    id: 3,
    title: 'Đánh giá 5 sao từ khách hàng',
    content:
      'Khách hàng Nguyễn Văn An đã để lại đánh giá 5 sao cho dự án hoàn thành gần đây của bạn: "Làm việc rất chuyên nghiệp, đúng tiến độ!"',
    time: '3 giờ trước',
    isRead: false,
    actorName: 'Nguyễn Văn An',
    badgeType: 'review',
  },
  {
    id: 4,
    title: 'Tin nhắn mới từ người quản lý dự án',
    content:
      'Trần Thị Mai: "Chào bạn, chúng tôi đã xem qua bản phác thảo đợt 1 và có một số phản hồi nhỏ trong tài liệu đính kèm."',
    time: 'Hôm qua',
    isRead: true,
    actorName: 'Trần Thị Mai',
    badgeType: 'message',
  },
  {
    id: 5,
    title: 'Xác thực tài khoản thành công',
    content:
      'Hồ sơ nghề nghiệp và định danh danh tính của bạn đã được kiểm duyệt và phê duyệt huy hiệu Đã Xác Thực (Verified).',
    time: '2 ngày trước',
    isRead: true,
    actorName: 'Occupify Team',
    badgeType: 'system',
  },
  {
    id: 6,
    title: 'Nhắc nhở hạn nộp mốc công việc',
    content:
      'Mốc 2 của dự án "Landing Page giới thiệu sản phẩm AI" sẽ đến hạn bàn giao trong vòng 48 giờ tới.',
    time: '3 ngày trước',
    isRead: true,
    actorName: 'Occupify Reminders',
    badgeType: 'alert',
    link: '/workspace',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// SAVED JOBS MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const JOB_LISTINGS: JobListing[] = [
  {
    id: 1,
    title: 'Senior React & React Native Engineer',
    company: 'Fintech Viet Solution',
    clientName: 'Fintech Viet Solution',
    location: 'TP. Hồ Chí Minh (Hybrid)',
    budget: '45.000.000 ₫/tháng',
    postedAgo: '2 giờ trước',
    description:
      'Tìm kiếm kỹ sư Senior am hiểu sâu về React 19, TypeScript và tối ưu hiệu năng mobile app cho hệ thống thanh toán điện tử chuẩn bảo mật PCI-DSS.',
    skills: ['React', 'React Native', 'TypeScript', 'Tailwind CSS', 'PCI-DSS'],
    roles: [
      { id: 'r1', title: 'Senior Frontend Developer' },
      { id: 'r2', title: 'React Native Specialist' },
    ],
  },
  {
    id: 2,
    title: 'Lead UI/UX Designer - Nền tảng SaaS B2B',
    company: 'Nexus Creative Studio',
    clientName: 'Phạm Hồng Nhung',
    location: 'Hà Nội (Remote)',
    budget: '35.000.000 ₫/tháng',
    postedAgo: '5 giờ trước',
    description:
      'Thiết kế toàn bộ trải nghiệm người dùng và Design System cho phần mềm quản lý kho bãi & vận tải đa phương thức thế hệ mới.',
    skills: ['Figma', 'Design System', 'User Research', 'Wireframing'],
    roles: [{ id: 'r3', title: 'Lead Product Designer' }],
  },
  {
    id: 3,
    title: 'Fullstack Go & Vue.js Developer',
    company: 'NextGen Retail Tech',
    clientName: 'NextGen Retail',
    location: 'Đà Nẵng (Remote)',
    budget: '40.000.000 ₫/tháng',
    postedAgo: '1 ngày trước',
    description:
      'Phát triển API microservices hiệu năng cao bằng Golang, tích hợp giao diện Vue 3 cho hệ thống bán lẻ đa kênh omnichannel với hàng triệu lượt truy cập.',
    skills: ['Golang', 'Vue.js', 'PostgreSQL', 'Docker', 'Redis'],
    roles: [{ id: 'r4', title: 'Backend Go Specialist' }],
  },
  {
    id: 4,
    title: 'Chuyên viên AI & Machine Learning Engineer',
    company: 'VisionAI Labs',
    clientName: 'Đặng Quốc Huy',
    location: 'TP. Hồ Chí Minh (Remote)',
    budget: '60.000.000 ₫/tháng',
    postedAgo: '2 ngày trước',
    description:
      'Huấn luyện và triển khai mô hình nhận diện khuôn mặt và trích xuất dữ liệu tài liệu tự động (OCR/LLM) phục vụ quy trình định danh điện tử eKYC.',
    skills: ['Python', 'PyTorch', 'LLMs', 'FastAPI', 'Computer Vision'],
    roles: [{ id: 'r5', title: 'AI Research Engineer' }],
  },
]
