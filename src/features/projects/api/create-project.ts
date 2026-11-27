import { apiClient } from '../../../lib/api-client.ts'
import type { CreatedResponse } from '../../../types/api.ts'
import type {
  CreateProjectFormData,
  CreateProjectPayload,
  MyProject,
  ProjectDetail,
} from '../types/index.ts'
import { toBackendExperienceLevel, toBackendPeriod, toMyProject } from '../types/index.ts'
import { getInternalStores, setInternalStores } from './get-projects.ts'

export async function createProject(formData: CreateProjectFormData): Promise<MyProject> {
  const cleanPrice = formData.startPrice ? Number(formData.startPrice.replace(/[^0-9]/g, '')) : 0
  const formattedSalary = cleanPrice > 0 ? `${cleanPrice.toLocaleString('vi-VN')} ₫` : 'Thỏa thuận'

  const payload: CreateProjectPayload = {
    title: formData.name.trim(),
    description: formData.description.trim(),
    startPrice: cleanPrice > 0 ? cleanPrice : undefined,
    period: formData.period ? toBackendPeriod(formData.period) : 'FIXED',
    dueDate: formData.dueDate ? formData.dueDate : undefined,
    startDate: formData.bidCloseDate ? `${formData.bidCloseDate}T00:00:00` : undefined,
    experienceLevel: toBackendExperienceLevel(formData.experienceLevel),
    tags: formData.tags?.length ? formData.tags : undefined,
  }

  const res = await apiClient.post<CreatedResponse<ProjectDetail>>('/projects', payload)
  if (!res?.data) {
    throw new Error('Máy chủ không phản hồi dữ liệu dự án')
  }

  const createdProject = toMyProject(res.data)
  if (formData.dueDate) createdProject.dueDate = formData.dueDate
  if (formData.bidCloseDate) createdProject.bidCloseDate = formData.bidCloseDate
  if (!createdProject.tags || createdProject.tags.length === 0) {
    createdProject.tags = formData.tags || []
  }
  if (!createdProject.recruitingRoles || createdProject.recruitingRoles.length === 0) {
    createdProject.recruitingRoles = (formData.tags || ['Chuyên môn']).map(
      (tag: string, idx: number) => ({
        id: `role-${Date.now()}-${idx}`,
        title: tag.includes('Developer') || tag.includes('Design') ? tag : `${tag} Specialist`,
        skills: [tag],
        salaryRange: formattedSalary,
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting' as const,
      }),
    )
  }

  const { myProjects } = getInternalStores()
  setInternalStores({ myProjects: [createdProject, ...myProjects] })

  return createdProject
}
