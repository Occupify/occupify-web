import type { ProfileExperience, ExperienceFormData } from '../types'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores'
import type { SingleResponse } from '@/types'
import { currentProfileState, formatDateForBackend } from './profile-state'

/**
 * Work Experience CRUD APIs (POST/PUT/DELETE /users/me/experiences)
 */
export async function addExperienceApi(exp: ExperienceFormData): Promise<ProfileExperience[]> {
  let createdId: string | number = Date.now()

  if (useAuthStore.getState().isAuthenticated) {
    try {
      const res = await apiClient.post<SingleResponse<{ id: string }>>('/users/me/experiences', {
        title: exp.title,
        organization: exp.company,
        employmentType: exp.employmentType || 'FULL_TIME',
        location: exp.location || '',
        startDate: formatDateForBackend(exp.startDate),
        endDate: exp.isCurrent ? null : formatDateForBackend(exp.endDate),
        isCurrent: Boolean(exp.isCurrent),
        description: exp.description || '',
      })
      if (res?.data?.id) {
        createdId = res.data.id
      }
    } catch (err) {
      console.warn('[addExperienceApi] Backend post /users/me/experiences failed, saving locally:', err)
    }
  }

  const newExp: ProfileExperience = {
    ...exp,
    id: createdId,
  }
  currentProfileState.data.experiences = [newExp, ...currentProfileState.data.experiences]
  return [...currentProfileState.data.experiences]
}

export async function updateExperienceApi(
  id: string | number,
  exp: ExperienceFormData,
): Promise<ProfileExperience[]> {
  if (useAuthStore.getState().isAuthenticated && typeof id === 'string' && id.includes('-')) {
    try {
      await apiClient.put(`/users/me/experiences/${id}`, {
        title: exp.title,
        organization: exp.company,
        employmentType: exp.employmentType || 'FULL_TIME',
        location: exp.location || '',
        startDate: formatDateForBackend(exp.startDate),
        endDate: exp.isCurrent ? null : formatDateForBackend(exp.endDate),
        isCurrent: Boolean(exp.isCurrent),
        description: exp.description || '',
      })
    } catch (err) {
      console.warn('[updateExperienceApi] Backend put /users/me/experiences failed, updating locally:', err)
    }
  }

  currentProfileState.data.experiences = currentProfileState.data.experiences.map((item) =>
    item.id === id ? { ...item, ...exp } : item,
  )
  return [...currentProfileState.data.experiences]
}

export async function deleteExperienceApi(id: string | number): Promise<ProfileExperience[]> {
  if (useAuthStore.getState().isAuthenticated && typeof id === 'string' && id.includes('-')) {
    try {
      await apiClient.delete(`/users/me/experiences/${id}`)
    } catch (err) {
      console.warn('[deleteExperienceApi] Backend delete /users/me/experiences failed:', err)
    }
  }

  currentProfileState.data.experiences = currentProfileState.data.experiences.filter(
    (item) => item.id !== id,
  )
  return [...currentProfileState.data.experiences]
}
