import { apiClient } from '@/lib/api-client'
import type { SingleResponse, SuccessResponse } from '@/types'
import type { JobSummaryResponse } from '../types'

export interface UpdateJobPayload {
  role?: string
  title?: string
  description?: string
  budget?: number
  salaryType?: 'DAY' | 'FIXED' | 'HOURLY' | 'WEEKLY' | 'MONTHLY'
  startedAt?: string
  finishedAt?: string
  skillIds?: string[]
  file?: File | null
}

/**
 * Closes a job from project (PATCH /jobs/{id}/close)
 */
export async function closeJob(jobId: string): Promise<JobSummaryResponse> {
  const res = await apiClient.patch<SingleResponse<JobSummaryResponse>>(`/jobs/${jobId}/close`)
  return res.data
}

/**
 * Soft deletes a job and cancels pending bids (DELETE /jobs/{id})
 */
export async function deleteJob(jobId: string): Promise<SuccessResponse> {
  return await apiClient.delete<SuccessResponse>(`/jobs/${jobId}`)
}

/**
 * Updates job details and optional terms file (PUT /jobs/{id})
 */
export async function updateJob(
  jobId: string,
  payload: UpdateJobPayload,
): Promise<JobSummaryResponse> {
  const formData = new FormData()
  const requestData = {
    role: payload.role,
    title: payload.title,
    description: payload.description,
    budget: payload.budget,
    salaryType: payload.salaryType,
    startedAt: payload.startedAt,
    finishedAt: payload.finishedAt,
    skillIds: payload.skillIds,
  }
  formData.append(
    'data',
    new Blob([JSON.stringify(requestData)], { type: 'application/json' }),
  )
  if (payload.file) {
    formData.append('file', payload.file)
  }
  const res = await apiClient.put<SingleResponse<JobSummaryResponse>>(`/jobs/${jobId}`, formData)
  return res.data
}

