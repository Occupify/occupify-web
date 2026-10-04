import type { JobListing, GetJobsParams } from '../types'

// Dữ liệu nội bộ mô phỏng dữ liệu phản hồi từ backend API (Mock response payload)
const MOCK_JOBS_PAYLOAD: JobListing[] = [
  {
    id: 1,
    title: 'Senior UI/UX Designer – Fintech App Redesign',
    clientName: 'Trần Thị Mai Phương',
    company: 'VNPAY Corporation',
    companyInitials: 'VNP',
    companyColor: '#0A66C2',
    location: 'Hà Nội',
    postedAgo: '3 giờ trước',
    budget: '45.000.000 ₫ / tháng',
    avgBid: 'Avg 38.200.000 ₫',
    salaryType: 'monthly',
    salaryValue: 45000000,
    description:
      'Chúng tôi đang tìm kiếm một Senior UI/UX Designer có kinh nghiệm trong lĩnh vực Fintech để dẫn dắt việc tái thiết kế toàn bộ giao diện ứng dụng thanh toán di động. Ứng viên cần có khả năng phân tích người dùng, xây dựng Design System và làm việc chặt chẽ với đội Engineering.',
    skills: ['Figma', 'Design System', 'UX Research', 'Prototyping', 'Fintech'],
    hiring: true,
    viewsCount: 342,
    submitsCount: 14,
    openPositions: 3,
    filledPositions: 1,
    status: 'OPEN',
    experienceLevel: 'expert',
    clientRating: 4.9,
    duration: '3 - 6 tháng',
    hoursPerDay: 4,
    roles: [
      {
        id: 'r1-1',
        title: 'Senior UI/UX Lead Designer',
        minBudget: 40000000,
        maxBudget: 55000000,
        budgetDisplay: '40.000.000 – 55.000.000 ₫',
        salaryType: 'monthly',
        salaryTypeLabel: '/ tháng',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
        jd: 'Chủ trì kiến trúc trải nghiệm người dùng cho app thanh toán di động thế hệ mới. Trực tiếp xây dựng Design System, User Flows và quản lý bàn giao giao diện cho đội Mobile Engineering.',
        requirements: [
          'Tối thiểu 4 năm kinh nghiệm thiết kế sản phẩm số (Fintech/Banking là lợi thế lớn)',
          'Thành thạo sâu Figma, Design Tokens, Variables và Interactive Components',
          'Kinh nghiệm phối hợp trực tiếp với lập trình viên iOS/Android qua Zeplin hoặc Figma Dev Mode',
        ],
        skills: ['Figma', 'Design System', 'Fintech', 'User Flow'],
      },
      {
        id: 'r1-2',
        title: 'Mobile Interaction & Motion Specialist',
        minBudget: 30000000,
        maxBudget: 42000000,
        budgetDisplay: '30.000.000 – 42.000.000 ₫',
        salaryType: 'monthly',
        salaryTypeLabel: '/ tháng',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
        jd: 'Thiết kế các micro-interactions, hiệu ứng chuyển cảnh mượt mà cho các tác vụ thanh toán, chuyển tiền nhanh và quét QR code trong app.',
        requirements: [
          'Ít nhất 2 năm kinh nghiệm thiết kế Motion & Interaction cho ứng dụng di động',
          'Sử dụng thành thạo ProtoPie, After Effects, Lottie hoặc Rive',
          'Am hiểu sâu Human Interface Guidelines (iOS) và Material Design 3 (Android)',
        ],
        skills: ['Micro-interactions', 'ProtoPie', 'Lottie', 'Mobile UX'],
      },
      {
        id: 'r1-3',
        title: 'UX Researcher & Usability Tester',
        minBudget: 25000000,
        maxBudget: 35000000,
        budgetDisplay: '25.000.000 – 35.000.000 ₫',
        salaryType: 'monthly',
        salaryTypeLabel: '/ tháng',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
        jd: 'Tổ chức các buổi phỏng vấn người dùng, thử nghiệm khả năng sử dụng (Usability Test) và phân tích các nút thắt chuyển đổi trong phễu thanh toán.',
        requirements: [
          'Có kinh nghiệm thực hiện kiểm thử định lượng và định tính với người dùng thực',
          'Kỹ năng tổng hợp insight và đề xuất giải pháp cải tiến UX khả thi',
        ],
        skills: ['UX Research', 'Usability Testing', 'Customer Journey', 'Data Analysis'],
      },
    ],
  },
  {
    id: 2,
    title: 'Product Designer – Consumer Super App',
    clientName: 'Lê Hoàng Nam',
    company: 'Zalo / VNG',
    companyInitials: 'VNG',
    companyColor: '#06407F',
    location: 'TP.HCM',
    postedAgo: '5 giờ trước',
    budget: '55.000.000 ₫ / dự án',
    avgBid: 'Avg 48.000.000 ₫',
    salaryType: 'fixed',
    salaryValue: 55000000,
    description:
      'Vị trí Product Designer tại Zalo, nền tảng nhắn tin và mạng xã hội hàng đầu Việt Nam với hơn 75 triệu người dùng. Bạn sẽ thiết kế các tính năng mới cho ứng dụng di động, cộng tác với Product Manager và Data Analyst để đưa ra quyết định dựa trên dữ liệu.',
    skills: ['Figma', 'Mobile Design', 'User Testing', 'Interaction Design', 'Zeplin'],
    hiring: true,
    viewsCount: 189,
    submitsCount: 6,
    openPositions: 2,
    filledPositions: 0,
    status: 'OPEN',
    experienceLevel: 'expert',
    clientRating: 5.0,
    duration: '1 - 3 tháng',
    hoursPerDay: 8,
    roles: [
      {
        id: 'r2-1',
        title: 'Principal Product Designer',
        minBudget: 50000000,
        maxBudget: 70000000,
        budgetDisplay: '50.000.000 – 70.000.000 ₫',
        salaryType: 'fixed',
        salaryTypeLabel: '/ dự án',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
        jd: 'Chịu trách nhiệm thiết kế toàn diện tính năng cộng đồng và miniapp mới trên Super App, phối hợp mật thiết với Product Director.',
        requirements: [
          '5+ năm kinh nghiệm thiết kế sản phẩm quy mô người dùng hàng chục triệu',
          'Kỹ năng lãnh đạo thiết kế và định hình chiến lược sản phẩm xuất sắc',
        ],
        skills: ['Product Strategy', 'Figma', 'High-scale UX', 'Design Leadership'],
      },
      {
        id: 'r2-2',
        title: 'Design QA & Delivery Specialist',
        minBudget: 28000000,
        maxBudget: 38000000,
        budgetDisplay: '28.000.000 – 38.000.000 ₫',
        salaryType: 'fixed',
        salaryTypeLabel: '/ dự án',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
        jd: 'Đối soát pixel-perfect giữa thiết kế Figma và bản build thực tế của engineering, xây dựng tài liệu handoff chuẩn chỉnh.',
        requirements: [
          'Hiểu biết tốt về responsive design, layout engine của React Native / iOS / Android',
          'Tỉ mỉ, cẩn thận và có mắt thẩm mỹ sắc sảo',
        ],
        skills: ['Design QA', 'Figma', 'Mobile UI', 'Handoff'],
      },
    ],
  },
  {
    id: 3,
    title: 'Lead UX Designer – E-Commerce Platform',
    clientName: 'Phạm Quốc Tuấn',
    company: 'Tiki Corporation',
    companyInitials: 'TKI',
    companyColor: '#C03A2B',
    location: 'TP.HCM',
    postedAgo: '1 ngày trước',
    budget: '60.000.000 ₫ / tháng',
    avgBid: 'Avg 52.500.000 ₫',
    salaryType: 'monthly',
    salaryValue: 60000000,
    description:
      'Tiki đang tìm Lead UX Designer để dẫn dắt đội thiết kế trong việc nâng cấp trải nghiệm mua sắm trên web và app. Bạn sẽ là người đề ra chiến lược UX, xây dựng quy trình nghiên cứu người dùng và đảm bảo tính nhất quán của sản phẩm trên mọi nền tảng.',
    skills: ['Leadership', 'UX Strategy', 'Figma', 'User Research', 'A/B Testing'],
    hiring: true,
    viewsCount: 95,
    submitsCount: 3, // Ít cạnh tranh (< 5)
    openPositions: 2,
    filledPositions: 1,
    status: 'OPEN',
    experienceLevel: 'intermediate',
    clientRating: 4.8,
    duration: '2 - 4 tháng',
    hoursPerDay: 4,
    roles: [
      {
        id: 'r3-1',
        title: 'Senior UX Architect (E-Commerce Checkout)',
        minBudget: 55000000,
        maxBudget: 75000000,
        budgetDisplay: '55.000.000 – 75.000.000 ₫',
        salaryType: 'monthly',
        salaryTypeLabel: '/ tháng',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
        jd: 'Tái cấu trúc luồng Checkout giỏ hàng, tối ưu hóa các phương thức giao vận và tích hợp ví điện tử giảm tỷ lệ bỏ giỏ hàng (Cart Abandonment).',
        requirements: [
          'Ít nhất 4 năm thiết kế các sàn thương mại điện tử lớn hoặc nền tảng booking',
          'Kinh nghiệm chạy A/B Testing và theo dõi chỉ số conversion rate',
        ],
        skills: ['E-Commerce UX', 'A/B Testing', 'Checkout Flow', 'Conversion Rate'],
      },
      {
        id: 'r3-2',
        title: 'Visual Designer (Mega Campaign & Flash Sale)',
        minBudget: 32000000,
        maxBudget: 45000000,
        budgetDisplay: '32.000.000 – 45.000.000 ₫',
        salaryType: 'monthly',
        salaryTypeLabel: '/ tháng',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
        jd: 'Sáng tạo giao diện landing page, banner động và các thành phần visual hấp dẫn cho các ngày hội mua sắm Mega Sale hàng tháng.',
        requirements: [
          'Gu thẩm mỹ hiện đại, bắt mắt, xử lý tốt phong cách visual thương mại điện tử',
          'Tốc độ thiết kế nhanh, phối hợp tốt dưới áp lực thời gian chiến dịch',
        ],
        skills: ['Campaign Design', 'Figma', 'Visual Hierarchy', 'Photoshop'],
      },
    ],
  },
  {
    id: 4,
    title: 'UX/UI Designer – Mobile Banking App',
    clientName: 'Đặng Thùy Dung',
    company: 'Techcombank',
    companyInitials: 'TCB',
    companyColor: '#915907',
    location: 'Hà Nội',
    postedAgo: '2 ngày trước',
    budget: '450.000 ₫ / giờ',
    avgBid: 'Avg 400.000 ₫',
    salaryType: 'hourly',
    salaryValue: 450000,
    description:
      'Techcombank tuyển UX/UI Designer cho dự án nâng cấp ứng dụng ngân hàng di động TCB. Vị trí yêu cầu tư duy thiết kế lấy người dùng làm trung tâm, kinh nghiệm với giao diện tài chính và khả năng làm việc với các tiêu chuẩn bảo mật và compliance trong ngành ngân hàng.',
    skills: ['Mobile UI', 'Banking UX', 'Figma', 'Accessibility', 'User Flow'],
    hiring: true,
    viewsCount: 220,
    submitsCount: 8,
    openPositions: 2,
    filledPositions: 0,
    status: 'OPEN',
    experienceLevel: 'intermediate',
    clientRating: 4.6,
    duration: 'Linh hoạt theo giờ',
    hoursPerDay: 2,
    roles: [
      {
        id: 'r4-1',
        title: 'Senior Banking UX Consultant',
        minBudget: 400000,
        maxBudget: 600000,
        budgetDisplay: '400.000 – 600.000 ₫',
        salaryType: 'hourly',
        salaryTypeLabel: '/ giờ',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
        jd: 'Tư vấn và thiết kế giao diện các tính năng mở sổ tiết kiệm online, vay thấu chi tự động và quản lý danh mục đầu tư cá nhân.',
        requirements: [
          'Có ít nhất 3 năm làm việc trong lĩnh vực Ngân hàng số / FinTech',
          'Hiểu biết về bảo mật ngân hàng, OTP và xác thực sinh trắc học',
        ],
        skills: ['Banking UX', 'Compliance', 'Security UX', 'Figma'],
      },
      {
        id: 'r4-2',
        title: 'Accessibility (a11y) & Usability Specialist',
        minBudget: 350000,
        maxBudget: 500000,
        budgetDisplay: '350.000 – 500.000 ₫',
        salaryType: 'hourly',
        salaryTypeLabel: '/ giờ',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
        jd: 'Audit và tối ưu độ tương phản, kích thước nút bấm, font size và hỗ trợ VoiceOver cho người cao tuổi sử dụng app ngân hàng.',
        requirements: [
          'Nắm vững chuẩn tiếp cận WCAG 2.1 AA',
          'Kinh nghiệm audit accessibility cho mobile app',
        ],
        skills: ['Accessibility', 'WCAG 2.1', 'VoiceOver', 'Usability Audit'],
      },
    ],
  },
  {
    id: 5,
    title: 'Freelance Product Designer – Startup MVP',
    clientName: 'Nguyễn Minh Trí',
    company: 'NextGen Ventures',
    companyInitials: 'NGV',
    companyColor: '#44712E',
    location: 'Toàn quốc',
    postedAgo: '3 ngày trước',
    budget: '25.000.000 ₫ / dự án',
    avgBid: 'Avg 20.000.000 ₫',
    salaryType: 'fixed',
    salaryValue: 25000000,
    description:
      'Startup công nghệ giai đoạn Seed đang tìm Freelance Product Designer để thiết kế MVP cho nền tảng kết nối doanh nghiệp B2B. Dự án kéo dài 2–3 tháng, yêu cầu thiết kế từ wireframe đến high-fidelity prototype và tham gia vào quá trình user testing với khách hàng doanh nghiệp.',
    skills: ['MVP Design', 'Wireframing', 'Figma', 'B2B UX', 'Rapid Prototyping'],
    hiring: true,
    viewsCount: 78,
    submitsCount: 2, // Ít cạnh tranh (< 5)
    openPositions: 1,
    filledPositions: 0,
    status: 'OPEN',
    experienceLevel: 'intermediate',
    clientRating: 4.9,
    duration: '2 - 3 tuần',
    hoursPerDay: 6,
    roles: [
      {
        id: 'r5-1',
        title: 'End-to-End Product Designer (MVP)',
        minBudget: 22000000,
        maxBudget: 32000000,
        budgetDisplay: '22.000.000 – 32.000.000 ₫',
        salaryType: 'fixed',
        salaryTypeLabel: '/ dự án',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
        jd: 'Thiết kế toàn bộ từ Wireframe, Mockup, UI Kit đến Prototype cho phiên bản MVP B2B SaaS đầu tiên của startup.',
        requirements: [
          'Đã có sản phẩm MVP từng ra mắt thị trường',
          'Khả năng triển khai nhanh và giải quyết vấn đề linh hoạt',
        ],
        skills: ['MVP Design', 'Wireframing', 'Figma', 'B2B SaaS'],
      },
    ],
  },
  {
    id: 6,
    title: 'Design System Engineer – SaaS Platform',
    clientName: 'Vũ Hải Đăng',
    company: 'Base.vn',
    companyInitials: 'BSE',
    companyColor: '#3675BD',
    location: 'Hà Nội',
    postedAgo: '5 ngày trước',
    budget: '12.500.000 ₫ / tuần',
    avgBid: 'Avg 11.000.000 ₫',
    salaryType: 'weekly',
    salaryValue: 12500000,
    description:
      'Base.vn tìm Design System Engineer có kinh nghiệm xây dựng và duy trì Design System quy mô lớn cho sản phẩm SaaS phục vụ hơn 10.000 doanh nghiệp. Bạn sẽ cộng tác chặt chẽ với frontend engineers và product designers để đảm bảo tính nhất quán trên toàn hệ thống.',
    skills: ['Design System', 'Figma Variables', 'Tokens', 'React', 'Documentation'],
    hiring: false,
    viewsCount: 410,
    submitsCount: 21,
    openPositions: 1,
    filledPositions: 1,
    status: 'CLOSED', // Demo job đã đóng
    experienceLevel: 'entry',
    clientRating: 4.7,
    duration: '1 tháng',
    hoursPerDay: 8,
    roles: [
      {
        id: 'r6-1',
        title: 'Design System Specialist (React & Figma Tokens)',
        minBudget: 10000000,
        maxBudget: 15000000,
        budgetDisplay: '10.000.000 – 15.000.000 ₫',
        salaryType: 'weekly',
        salaryTypeLabel: '/ tuần',
        slotsTotal: 1,
        slotsFilled: 1,
        status: 'filled',
        jd: 'Đồng bộ hóa Figma Variables với React Component Library, viết documentation và guidelines cho đội ngũ 30+ kỹ sư.',
        requirements: [
          'Thành thạo Figma Tokens, Style Dictionary và React Storybook',
          'Hiểu rõ component architecture và accessibility standards',
        ],
        skills: ['Tokens', 'React', 'Storybook', 'Design System'],
      },
    ],
  },
  {
    id: 7,
    title: 'Junior Graphic & Banner Designer – Chiến dịch Marketing',
    clientName: 'Hoàng Gia Bảo',
    company: 'FPT Telecom',
    companyInitials: 'FPT',
    companyColor: '#F59E0B',
    location: 'Hà Nội',
    postedAgo: '6 ngày trước',
    budget: '3.500.000 ₫ / tuần',
    avgBid: 'Avg 3.000.000 ₫',
    salaryType: 'weekly',
    salaryValue: 3500000,
    description:
      'Tuyển thiết kế đồ họa hỗ trợ các chiến dịch truyền thông và marketing số. Yêu cầu thành thạo Photoshop, Illustrator, có gu thẩm mỹ hiện đại và khả năng làm việc theo tiến độ nhanh.',
    skills: ['Photoshop', 'Illustrator', 'Social Media', 'Graphic Design'],
    hiring: true,
    viewsCount: 65,
    submitsCount: 1, // Ít cạnh tranh (< 5)
    openPositions: 1,
    filledPositions: 0,
    status: 'OPEN',
    experienceLevel: 'entry',
    clientRating: 4.5,
    duration: '3 - 5 ngày',
    hoursPerDay: 3,
    roles: [
      {
        id: 'r7-1',
        title: 'Banner & Social Media Content Designer',
        minBudget: 3000000,
        maxBudget: 4500000,
        budgetDisplay: '3.000.000 – 4.500.000 ₫',
        salaryType: 'weekly',
        salaryTypeLabel: '/ tuần',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
        jd: 'Thiết kế các bộ banner quảng cáo Google GDN, bài đăng Facebook/TikTok theo định dạng chuẩn và màu sắc thương hiệu FPT.',
        requirements: [
          'Kỹ năng Photoshop, Illustrator tốt',
          'Có trách nhiệm và đảm bảo tiến độ bàn giao hàng tuần',
        ],
        skills: ['Photoshop', 'Illustrator', 'Social Media', 'Banner Ads'],
      },
    ],
  },
  {
    id: 8,
    title: 'Content & SEO Copywriter Freelance',
    clientName: 'Ngô Bích Thảo',
    company: 'Sendo Group',
    companyInitials: 'SND',
    companyColor: '#C03A2B',
    location: 'Toàn quốc',
    postedAgo: '12 ngày trước',
    budget: '250.000 ₫ / giờ',
    avgBid: 'Avg 220.000 ₫',
    salaryType: 'hourly',
    salaryValue: 250000,
    description:
      'Tìm kiếm Content Writer phụ trách viết bài chuẩn SEO, bài giới thiệu sản phẩm và nội dung fanpage theo chủ đề công nghệ và đời sống số.',
    skills: ['SEO', 'Content Writing', 'Copywriting', 'Creative Writing'],
    hiring: true,
    viewsCount: 145,
    submitsCount: 4, // Ít cạnh tranh (< 5)
    openPositions: 1,
    filledPositions: 0,
    status: 'OPEN',
    experienceLevel: 'entry',
    clientRating: 4.8,
    duration: 'Theo giờ',
    hoursPerDay: 2,
    roles: [
      {
        id: 'r8-1',
        title: 'SEO Tech & Lifestyle Copywriter',
        minBudget: 200000,
        maxBudget: 350000,
        budgetDisplay: '200.000 – 350.000 ₫',
        salaryType: 'hourly',
        salaryTypeLabel: '/ giờ',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
        jd: 'Viết bài chuẩn SEO theo bộ từ khóa được giao, biên tập bài đánh giá công nghệ và tối ưu thẻ meta onpage.',
        requirements: [
          'Khả năng nghiên cứu thông tin nhanh, viết văn lưu loát, không đạo văn',
          'Hiểu biết cơ bản về SEO Onpage',
        ],
        skills: ['SEO Writing', 'Copywriting', 'Keyword Research'],
      },
    ],
  },
]

let jobsStore: JobListing[] = [...MOCK_JOBS_PAYLOAD]

export function addJobListing(job: JobListing): void {
  jobsStore = [job, ...jobsStore]
}

export function getInternalJobsStore(): JobListing[] {
  return [...jobsStore]
}

export function resetJobsStore(): void {
  jobsStore = [...MOCK_JOBS_PAYLOAD]
}

/**
 * Fetches the list of job postings with optional query parameters.
 *
 * NOTE: Currently mocks the network response with client-side simulation.
 * When the backend endpoint is ready:
 * ```ts
 * import { apiClient } from '@/lib/api-client'
 * const response = await apiClient.get<JobListing[]>('/jobs', { params })
 * return response.data
 * ```
 */
export async function getJobs(params?: GetJobsParams): Promise<JobListing[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...jobsStore]

      // 1. Text Search Keyword
      if (params?.search && params.search.trim()) {
        const q = params.search.trim().toLowerCase()
        result = result.filter((job) => {
          const matchTitle = job.title.toLowerCase().includes(q)
          const matchCompany = job.company.toLowerCase().includes(q)
          const matchDesc = job.description.toLowerCase().includes(q)
          const matchSkills = job.skills.some((s) => s.toLowerCase().includes(q))
          return matchTitle || matchCompany || matchDesc || matchSkills
        })
      }

      // 2. Experience Level
      if (params?.experienceLevel && params.experienceLevel !== 'all') {
        result = result.filter((job) => job.experienceLevel === params.experienceLevel)
      }

      // 3. Job Status (OPEN / CLOSED)
      if (params?.status && params.status !== 'all') {
        result = result.filter((job) => job.status === params.status)
      }

      // 4. Hours Per Day (Thời gian làm việc / ngày)
      if (params?.hoursPerDay && params.hoursPerDay !== 'all') {
        result = result.filter((job) => {
          const h = job.hoursPerDay || 0
          if (params.hoursPerDay === 'under-4h') return h < 4
          if (params.hoursPerDay === '4h-8h') return h >= 4 && h <= 8
          if (params.hoursPerDay === 'above-8h') return h > 8
          return true
        })
      }

      // 7. Salary Type
      if (params?.salaryType && params.salaryType !== 'all') {
        result = result.filter((job) => job.salaryType === params.salaryType)
      }

      // 8. Budget Range
      if (params?.budgetRange && params.budgetRange !== 'all') {
        result = result.filter((job) => {
          const val = job.salaryValue
          if (params.budgetRange === 'under-5m') return val < 5000000
          if (params.budgetRange === '5m-20m') return val >= 5000000 && val <= 20000000
          if (params.budgetRange === '20m-50m') return val > 20000000 && val <= 50000000
          if (params.budgetRange === 'above-50m') return val > 50000000
          return true
        })
      }

      // 9. Time Recency (24h, 3d, 7d, 30d)
      if (params?.time && params.time !== 'all') {
        if (params.time === '24h') {
          result = result.filter((job) => job.postedAgo.includes('giờ'))
        } else if (params.time === '3d') {
          result = result.filter(
            (job) =>
              job.postedAgo.includes('giờ') ||
              job.postedAgo.includes('1 ngày') ||
              job.postedAgo.includes('2 ngày') ||
              job.postedAgo.includes('3 ngày'),
          )
        } else if (params.time === '7d') {
          result = result.filter(
            (job) => !job.postedAgo.includes('tuần trước') && !job.postedAgo.includes('tháng'),
          )
        }
      }

      // 10. Sorting
      if (params?.sortBy === 'most-viewed') {
        result.sort((a, b) => b.viewsCount - a.viewsCount)
      } else if (params?.sortBy === 'least-proposals') {
        result.sort((a, b) => a.submitsCount - b.submitsCount)
      } else if (params?.sortBy === 'budget-desc') {
        result.sort((a, b) => (b.salaryValue || 0) - (a.salaryValue || 0))
      } else {
        // Default latest: ID desc
        result.sort((a, b) => b.id - a.id)
      }

      resolve(result)
    }, 150)
  })
}
