import type { CreateProjectFormData, MyProject } from '../types'
import { getInternalStores, setInternalStores } from './get-projects'

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
    tags: formData.tags,
    members: [],
    recruitingRoles: formData.tags.map((tag: string, idx: number) => ({
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

  return newProject
}
