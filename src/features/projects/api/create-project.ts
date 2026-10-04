import type { CreateProjectFormData, MyProject } from '../types'
import { getInternalStores, setInternalStores } from './get-projects'
import { createJob } from '@/features/jobs/api'
import type { JobSalaryType } from '@/features/jobs/types'

export async function createProject(formData: CreateProjectFormData): Promise<MyProject> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const cleanPrice = Number(formData.startPrice.replace(/[^0-9]/g, ''))
  const formattedSalary = `${cleanPrice.toLocaleString('vi-VN')} ₫`

  const newProject: MyProject = {
    id: Date.now(),
    name: formData.name,
    description: formData.description,
    owner: 'Tôi (Chủ dự án)',
    period: formData.period || 'Hàng tháng',
    dueDate: formData.dueDate,
    contractDuration: formData.contractDuration,
    tags: formData.tags,
    members: [],
    recruitingRoles:
      formData.roles ||
      formData.tags.map((tag: string, idx: number) => ({
        id: `role-${Date.now()}-${idx}`,
        title: tag.includes('Developer') || tag.includes('Design') ? tag : `${tag} Specialist`,
        skills: [tag],
        salaryRange: formattedSalary,
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting' as const,
      })),
  }

  const { myProjects } = getInternalStores()
  setInternalStores({ myProjects: [newProject, ...myProjects] })

  // Synchronize public project with Home Page job feed
  if (formData.isPublic !== false) {
    let salaryType: JobSalaryType = 'monthly'
    let periodLabel = '/ tháng'
    if (formData.period === 'Theo giờ') {
      salaryType = 'hourly'
      periodLabel = '/ giờ'
    } else if (formData.period === 'Theo tuần' || formData.period === 'Hàng tuần') {
      salaryType = 'weekly'
      periodLabel = '/ tuần'
    } else if (formData.period === 'Cố định') {
      salaryType = 'fixed'
      periodLabel = '/ dự án'
    }

    const formattedBudget =
      cleanPrice > 0 ? `${cleanPrice.toLocaleString('vi-VN')} ₫ ${periodLabel}` : undefined

    // Determine displayed duration: prioritize contract duration for non-fixed jobs
    const displayDuration =
      formData.period !== 'Cố định' && formData.contractDuration
        ? `HĐ: ${formData.contractDuration}`
        : formData.dueDate
          ? `Hạn: ${formData.dueDate}`
          : formData.duration || (formData.period === 'Cố định' ? 'Theo dự án' : 'Linh hoạt')

    await createJob({
      title: formData.name,
      description: formData.description,
      skills: formData.tags,
      budget: formattedBudget,
      salaryValue: cleanPrice,
      salaryType,
      experienceLevel: formData.experienceLevel || 'intermediate',
      duration: displayDuration,
      hoursPerDay: formData.hoursPerDay || 4,
      openPositions: formData.openPositions || 1,
      status: 'OPEN',
      roles: newProject.recruitingRoles?.map((r) => ({
        id: r.id,
        title: r.title,
        minBudget: cleanPrice,
        maxBudget: cleanPrice,
        budgetDisplay: r.salaryRange || formattedSalary,
        salaryType,
        salaryTypeLabel: periodLabel,
        slotsTotal: r.slotsTotal || 1,
        slotsFilled: 0,
        status: 'recruiting' as const,
        jd: `Đảm nhận vai trò ${r.title} cho dự án ${formData.name}`,
        skills: r.skills || formData.tags,
      })),
    })
  }

  return newProject
}
