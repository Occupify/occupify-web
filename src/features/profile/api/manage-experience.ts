import type { ProfileExperience, ExperienceFormData } from '../types'
import { apiClient } from '@/lib/api-client'
import type { SingleResponse } from '@/types'
import { formatDateForBackend } from '../utils'

/**
 * Work Experience CRUD APIs (POST/PUT/DELETE /users/me/experiences)
 */
export async function addExperienceApi(exp: ExperienceFormData): Promise<ProfileExperience> {
  const res = await apiClient.post<SingleResponse<{ id: string }>>('/users/me/experiences', {
    title: exp.title,
    organization: exp.company,
    employmentType: exp.employmentType,
    location: exp.location || '',
    startDate: formatDateForBackend(exp.startDate),
    endDate: exp.isCurrent ? null : formatDateForBackend(exp.endDate),
    isCurrent: Boolean(exp.isCurrent),
    description: exp.description || '',
  })

  return {
    ...exp,
    id: res?.data?.id ?? Date.now(),
  }
}

export async function updateExperienceApi(
  id: string | number,
  exp: ExperienceFormData,
): Promise<ProfileExperience> {
  await apiClient.put(`/users/me/experiences/${id}`, {
    title: exp.title,
    organization: exp.company,
    employmentType: exp.employmentType,
    location: exp.location || '',
    startDate: formatDateForBackend(exp.startDate),
    endDate: exp.isCurrent ? null : formatDateForBackend(exp.endDate),
    isCurrent: Boolean(exp.isCurrent),
    description: exp.description || '',
  })

  return {
    ...exp,
    id,
  }
}

export async function deleteExperienceApi(id: string | number): Promise<void> {
  await apiClient.delete(`/users/me/experiences/${id}`)
}
