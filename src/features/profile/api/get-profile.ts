import type {
  ProfileData,
  ProfileExperience,
  ProfileEducation,
  ProfileCertificate,
  ProfileProject,
  ReportProfilePayload,
  UploadCvResponse,
  UpdateBasicInfoPayload,
  ExperienceFormData,
  EducationFormData,
  CertificateFormData,
  ProjectFormData,
  ProfileSkill,
  SkillFormData,
} from '../types'

export function nameToGmail(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase()
      .replace(/\s+/g, '') + '@gmail.com'
  )
}

export const MOCK_MY_PROFILE_DATA: ProfileData = {
  name: 'Nguyễn Minh Khoa',
  headline: 'Product Designer & Senior Architect · Fintech & SaaS',
  location: 'Hà Nội, Việt Nam',
  connections: 534,
  intro:
    'Product Designer với 6 năm kinh nghiệm trong lĩnh vực thiết kế sản phẩm số, chuyên sâu về Fintech và SaaS. Tôi có niềm đam mê với việc xây dựng trải nghiệm người dùng đơn giản, hiệu quả và có tác động thực sự. Đã dẫn dắt và đóng góp vào hơn 20 dự án thực tế từ giai đoạn nghiên cứu đến bàn giao.',
  onTimeRate: 96,
  successRate: 94,
  creditScore: 92,
  cvFileName: 'CV_Nguyen_Minh_Khoa_Senior_Architect.pdf',
  cvUrl: '#',
  experiences: [
    {
      id: 1,
      title: 'Lead Product Designer & Design Architect',
      company: 'Fintech Solutions Asia',
      employmentType: 'Freelance / Contract',
      location: 'Hà Nội · Remote',
      startDate: '03/2022',
      endDate: 'Hiện tại',
      isCurrent: true,
      description:
        'Chịu trách nhiệm kiến trúc Design System đa nền tảng (Web & Mobile), tối ưu hóa trải nghiệm checkout và quy trình thanh toán số cho hơn 500.000 người dùng hoạt động hàng tháng. Trực tiếp phối hợp cùng CTO và đội ngũ kỹ thuật để chuẩn hóa component library trên React & Tailwind.',
      skills: ['Design System', 'Figma', 'Fintech', 'React', 'UX Architecture'],
    },
    {
      id: 2,
      title: 'Senior UI/UX Consultant',
      company: 'SaaS Innovate Labs',
      employmentType: 'Hợp đồng dự án',
      location: 'TP. Hồ Chí Minh · Hybrid',
      startDate: '06/2020',
      endDate: '02/2022',
      isCurrent: false,
      description:
        'Nghiên cứu hành vi người dùng B2B, tái thiết kế luồng onboarding giúp giảm tỷ lệ drop-off 38%. Soạn thảo tài liệu chuẩn hóa giao diện và hướng dẫn bàn giao thiết kế cho các kỹ sư frontend.',
      skills: ['User Research', 'Prototyping', 'B2B SaaS', 'Usability Testing'],
    },
    {
      id: 3,
      title: 'Product Interface Designer',
      company: 'VNPAY Ecosystem',
      employmentType: 'Toàn thời gian',
      location: 'Hà Nội',
      startDate: '01/2018',
      endDate: '05/2020',
      isCurrent: false,
      description:
        'Tham gia thiết kế các tính năng ví điện tử, cổng thanh toán QR Code và quản lý ví doanh nghiệp. Đạt giải thưởng dự án xuất sắc năm 2019.',
      skills: ['Mobile UI', 'Payment Gateway', 'Interaction Design'],
    },
  ],
  education: [{ school: 'Đại học Bách Khoa Hà Nội', period: '2015 – 2020' }],
  skills: [
    { id: 1, name: 'React', category: 'Frontend', isTopSkill: true },
    { id: 2, name: 'Frontend', category: 'Frontend', isTopSkill: true },
    { id: 3, name: 'TypeScript', category: 'Frontend' },
    { id: 4, name: 'Next.js', category: 'Frontend' },
    { id: 5, name: 'TailwindCSS', category: 'Frontend' },
    { id: 6, name: 'Java', category: 'Backend', isTopSkill: true },
    { id: 7, name: 'Spring Boot', category: 'Backend' },
    { id: 8, name: 'Node.js', category: 'Backend' },
    { id: 9, name: 'PostgreSQL', category: 'Backend' },
    { id: 10, name: 'RESTful API', category: 'Backend' },
    { id: 11, name: 'Cloud', category: 'Cloud', isTopSkill: true },
    { id: 12, name: 'AWS', category: 'Cloud' },
    { id: 13, name: 'Docker', category: 'Cloud' },
    { id: 14, name: 'Kubernetes', category: 'Cloud' },
    { id: 15, name: 'CI/CD', category: 'Cloud' },
    { id: 16, name: 'Figma', category: 'Công cụ & Khác' },
    { id: 17, name: 'Design System', category: 'Công cụ & Khác' },
    { id: 18, name: 'Git', category: 'Công cụ & Khác' },
    { id: 19, name: 'Agile/Scrum', category: 'Công cụ & Khác' },
  ],
  certificates: [
    {
      name: 'Google UX Design Professional Certificate',
      issuer: 'Google · Coursera',
      year: '2021',
    },
    {
      name: 'Figma Advanced Design & Prototyping',
      issuer: 'Figma',
      year: '2022',
    },
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      year: '2023',
    },
    {
      name: 'Agile & Scrum Foundation',
      issuer: 'Scrum Alliance',
      year: '2022',
    },
  ],
  reviews: [
    {
      id: 1,
      reviewer: 'Nguyễn Văn Bình',
      rating: 5,
      comment:
        'Anh Khoa làm việc rất chuyên nghiệp, giao sản phẩm đúng hạn và chất lượng vượt kỳ vọng. Tinh thần trách nhiệm cao, phản hồi nhanh chóng và trao đổi kỹ thuật rất rõ ràng.',
      date: 'Tháng 9, 2024',
    },
    {
      id: 2,
      reviewer: 'Lê Thị Hồng Nhung',
      rating: 5,
      comment:
        'Phân tích giải pháp rất sâu, đưa ra tư vấn có giá trị thực tiễn. Báo cáo nghiệm thu rõ ràng, dễ hiểu cho cả đội ngũ kỹ thuật và ban giám đốc.',
      date: 'Tháng 8, 2024',
    },
    {
      id: 3,
      reviewer: 'Trần Quốc Tuấn',
      rating: 4,
      comment:
        'Tiến độ và chất lượng công việc tốt, phối hợp ăn ý trong các buổi sprint review. Sẽ tiếp tục hợp tác trong các giai đoạn mở rộng tiếp theo.',
      date: 'Tháng 7, 2024',
    },
  ],
  projects: [
    {
      id: 1,
      owner: 'VNPAY Corporation',
      name: 'Redesign hệ thống UI cho ứng dụng Fintech',
      detail: 'Làm tốt, hoàn thành đúng các mốc cam kết kỹ thuật.',
      rating: 5,
    },
    {
      id: 2,
      owner: 'Base.vn',
      name: 'Xây dựng Design System cho nền tảng SaaS',
      detail: 'Chất lượng thiết kế cao, hệ thống components chỉn chu.',
      rating: 4,
    },
    {
      id: 3,
      owner: 'Momo',
      name: 'UX Research & Audit cho mobile app',
      detail: 'Báo cáo trực quan và phân tích dữ liệu người dùng sắc nét.',
      rating: 5,
    },
    {
      id: 4,
      owner: 'Shopee Vietnam',
      name: 'Thiết kế landing page chiến dịch Marketing',
      detail: 'Tốc độ phản hồi nhanh, đáp ứng tốt yêu cầu chiến dịch.',
      rating: 4,
    },
  ],
}

// In-memory mutable profile state
let currentProfileData: ProfileData = {
  ...MOCK_MY_PROFILE_DATA,
  experiences: [...MOCK_MY_PROFILE_DATA.experiences],
  education: [...MOCK_MY_PROFILE_DATA.education],
  certificates: [...MOCK_MY_PROFILE_DATA.certificates],
  reviews: [...MOCK_MY_PROFILE_DATA.reviews],
  projects: [...MOCK_MY_PROFILE_DATA.projects],
}

/**
 * Fetch profile data for current user or external partner
 */
export async function getProfileApi(userName?: string): Promise<ProfileData> {
  await new Promise((resolve) => setTimeout(resolve, 80))

  if (!userName || userName === currentProfileData.name) {
    return { ...currentProfileData }
  }

  // Construct partner profile dynamically
  return {
    ...currentProfileData,
    name: userName,
    headline: `Khách hàng đối tác · ${userName}`,
    intro: `Hồ sơ thông tin đối tác ${userName} trên nền tảng Occupify. Đã tham gia quản lý và hợp tác nhiều dự án thực tế.`,
    cvFileName: `CV_${userName.replace(/\s+/g, '_')}.pdf`,
  }
}

/**
 * Update basic user information (Name, Headline, Location, Bio/Intro)
 */
export async function updateBasicInfoApi(payload: UpdateBasicInfoPayload): Promise<ProfileData> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  currentProfileData = {
    ...currentProfileData,
    name: payload.name,
    headline: payload.headline,
    location: payload.location ?? currentProfileData.location,
    intro: payload.intro,
  }
  return { ...currentProfileData }
}

/**
 * Experience CRUD APIs
 */
export async function addExperienceApi(exp: ExperienceFormData): Promise<ProfileExperience[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const newExp: ProfileExperience = {
    ...exp,
    id: Date.now(),
  }
  currentProfileData.experiences = [newExp, ...currentProfileData.experiences]
  return [...currentProfileData.experiences]
}

export async function updateExperienceApi(
  id: string | number,
  exp: ExperienceFormData,
): Promise<ProfileExperience[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  currentProfileData.experiences = currentProfileData.experiences.map((item) =>
    item.id === id ? { ...item, ...exp } : item,
  )
  return [...currentProfileData.experiences]
}

export async function deleteExperienceApi(id: string | number): Promise<ProfileExperience[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  currentProfileData.experiences = currentProfileData.experiences.filter((item) => item.id !== id)
  return [...currentProfileData.experiences]
}

/**
 * Education CRUD APIs
 */
export async function addEducationApi(edu: EducationFormData): Promise<ProfileEducation[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  currentProfileData.education = [edu, ...currentProfileData.education]
  return [...currentProfileData.education]
}

export async function updateEducationApi(
  index: number,
  edu: EducationFormData,
): Promise<ProfileEducation[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  currentProfileData.education = currentProfileData.education.map((item, idx) =>
    idx === index ? edu : item,
  )
  return [...currentProfileData.education]
}

export async function deleteEducationApi(index: number): Promise<ProfileEducation[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  currentProfileData.education = currentProfileData.education.filter((_, idx) => idx !== index)
  return [...currentProfileData.education]
}

/**
 * Certificate CRUD APIs
 */
export async function addCertificateApi(cert: CertificateFormData): Promise<ProfileCertificate[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  currentProfileData.certificates = [cert, ...currentProfileData.certificates]
  return [...currentProfileData.certificates]
}

export async function updateCertificateApi(
  index: number,
  cert: CertificateFormData,
): Promise<ProfileCertificate[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  currentProfileData.certificates = currentProfileData.certificates.map((item, idx) =>
    idx === index ? cert : item,
  )
  return [...currentProfileData.certificates]
}

export async function deleteCertificateApi(index: number): Promise<ProfileCertificate[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  currentProfileData.certificates = currentProfileData.certificates.filter(
    (_, idx) => idx !== index,
  )
  return [...currentProfileData.certificates]
}

/**
 * Project CRUD APIs
 */
export async function addProjectApi(proj: ProjectFormData): Promise<ProfileProject[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const newProj: ProfileProject = {
    ...proj,
    id: Date.now(),
  }
  currentProfileData.projects = [newProj, ...currentProfileData.projects]
  return [...currentProfileData.projects]
}

export async function updateProjectApi(
  id: number,
  proj: ProjectFormData,
): Promise<ProfileProject[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  currentProfileData.projects = currentProfileData.projects.map((item) =>
    item.id === id ? { ...item, ...proj } : item,
  )
  return [...currentProfileData.projects]
}

export async function deleteProjectApi(id: number): Promise<ProfileProject[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  currentProfileData.projects = currentProfileData.projects.filter((item) => item.id !== id)
  return [...currentProfileData.projects]
}

/**
 * Report a user profile
 */
export async function reportProfileApi(
  payload: ReportProfilePayload,
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return {
    success: true,
    message: `Đã gửi báo cáo người dùng "${payload.reportedUserName}" thành công. Ban quản trị Occupify sẽ xử lý trong 24h.`,
  }
}

/**
 * Upload candidate CV file
 */
export async function uploadCvApi(file: File): Promise<UploadCvResponse> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  currentProfileData.cvFileName = file.name
  return {
    fileName: file.name,
    fileUrl: URL.createObjectURL(file),
  }
}

/**
 * Skill CRUD APIs
 */
export async function addSkillApi(payload: SkillFormData): Promise<ProfileSkill[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const newSkill: ProfileSkill = {
    id: Date.now(),
    name: payload.name,
    category: payload.category ?? '',
    isTopSkill: payload.isTopSkill ?? false,
  }
  currentProfileData.skills = [newSkill, ...currentProfileData.skills]
  return [...currentProfileData.skills]
}

export async function updateSkillApi(
  id: string | number,
  payload: SkillFormData,
): Promise<ProfileSkill[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  currentProfileData.skills = currentProfileData.skills.map((item) =>
    item.id === id
      ? {
          ...item,
          name: payload.name,
          category: payload.category ?? item.category ?? '',
          isTopSkill: payload.isTopSkill ?? item.isTopSkill,
        }
      : item,
  )
  return [...currentProfileData.skills]
}

export async function deleteSkillApi(id: string | number): Promise<ProfileSkill[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  currentProfileData.skills = currentProfileData.skills.filter((item) => item.id !== id)
  return [...currentProfileData.skills]
}
