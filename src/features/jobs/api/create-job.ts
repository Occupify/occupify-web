import { apiClient } from '@/lib/api-client'
import type { CreatedResponse } from '@/types'
import type { JobSummaryResponse } from '../types'

export interface CreateJobPayload {
  projectId: string
  role: string
  title: string
  description?: string
  budget?: number
  salaryType?: 'DAY' | 'FIXED' | 'HOURLY' | 'WEEKLY' | 'MONTHLY'
  startedAt?: string
  finishedAt?: string
  skillIds?: string[]
  file?: File | null
}

export async function createJob(input: CreateJobPayload): Promise<JobSummaryResponse> {
  const formData = new FormData()
  const requestData = {
    projectId: input.projectId,
    role: input.role,
    title: input.title,
    description: input.description,
    budget: input.budget,
    salaryType: input.salaryType,
    startedAt: input.startedAt,
    finishedAt: input.finishedAt,
    skillIds: input.skillIds,
  }

  formData.append('data', new Blob([JSON.stringify(requestData)], { type: 'application/json' }))

  if (input.file) {
    formData.append('file', input.file)
  }

  const res = await apiClient.post<CreatedResponse<JobSummaryResponse>>('/jobs', formData)
  if (!res.data) {
    throw new Error(res.message || 'Không thể tạo tuyển dụng')
  }
  return res.data
}
