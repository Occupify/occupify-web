import type { JobListing, JobSalaryType, JobExperienceLevel, JobRoleItem } from '../types'
import { addJobListing } from './get-jobs'

export interface CreateJobInput {
  title: string
  description: string
  skills?: string[]
  budget?: string
  salaryValue?: number
  salaryType?: JobSalaryType
  experienceLevel?: JobExperienceLevel
  duration?: string
  hoursPerDay?: number
  openPositions?: number
  status?: 'OPEN' | 'CLOSED'
  location?: string
  clientName?: string
  company?: string
  roles?: JobRoleItem[]
  dueDate?: string
  bidCloseDate?: string
  tags?: string[]
  contractDuration?: string
  salaryDueDate?: string
  completedProjectsCount?: number
}

export async function createJob(input: CreateJobInput): Promise<JobListing> {
  await new Promise((resolve) => setTimeout(resolve, 80))

  const clientName = input.clientName || 'Tôi (Chủ dự án)'
  const company = input.company || 'Dự án cá nhân'
  const initials =
    clientName
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .join('')
      .slice(0, 3)
      .toUpperCase() || 'DA'

  const salaryType = input.salaryType || 'monthly'
  const cleanPrice = input.salaryValue || 0

  let formattedBudget = input.budget
  if (!formattedBudget && cleanPrice > 0) {
    const cycleLabel =
      salaryType === 'hourly'
        ? '/ giờ'
        : salaryType === 'weekly'
          ? '/ tuần'
          : salaryType === 'fixed'
            ? '/ dự án'
            : '/ tháng'
    formattedBudget = `${cleanPrice.toLocaleString('vi-VN')} ₫ ${cycleLabel}`
  }

  const newJob: JobListing = {
    id: Date.now(),
    title: input.title,
    clientName,
    company,
    companyInitials: initials,
    companyColor: '#0A66C2',
    location: input.location || 'Toàn quốc',
    postedAgo: 'Vừa xong',
    budget: formattedBudget || 'Thỏa thuận',
    avgBid:
      cleanPrice > 0 ? `Avg ${Math.round(cleanPrice * 0.9).toLocaleString('vi-VN')} ₫` : undefined,
    salaryType,
    salaryValue: cleanPrice,
    description: input.description,
    skills: input.skills && input.skills.length > 0 ? input.skills : ['Dự án mới'],
    hiring: true,
    viewsCount: 1,
    submitsCount: 0,
    openPositions: input.openPositions || 1,
    filledPositions: 0,
    status: input.status || 'OPEN',
    experienceLevel: input.experienceLevel || 'intermediate',
    clientRating: 5.0,
    duration: input.duration || '1 - 3 tháng',
    hoursPerDay: input.hoursPerDay || 4,
    dueDate: input.dueDate,
    bidCloseDate: input.bidCloseDate,
    tags: input.tags,
    contractDuration: input.contractDuration,
    salaryDueDate: input.salaryDueDate,
    completedProjectsCount: input.completedProjectsCount || 1,
    roles: input.roles,
  }

  addJobListing(newJob)
  return newJob
}
