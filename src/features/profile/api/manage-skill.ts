import type { ProfileSkill, SkillFormData } from '../types'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores'
import type { SingleResponse } from '@/types'
import { currentProfileState } from './profile-state'

/**
 * Skill CRUD APIs (POST/PUT/DELETE /users/me/skills)
 */
export async function addSkillApi(payload: SkillFormData): Promise<ProfileSkill[]> {
  let createdId: string | number = Date.now()

  if (useAuthStore.getState().isAuthenticated) {
    try {
      const res = await apiClient.post<SingleResponse<{ skillId?: string }>>('/users/me/skills', {
        skillName: payload.name,
        category: payload.category || 'General',
        isTopSkill: Boolean(payload.isTopSkill),
      })
      if (res?.data?.skillId) {
        createdId = res.data.skillId
      }
    } catch (err) {
      console.warn('[addSkillApi] Backend post /users/me/skills failed, saving locally:', err)
    }
  }

  const newSkill: ProfileSkill = {
    id: createdId,
    name: payload.name,
    category: payload.category ?? '',
    isTopSkill: payload.isTopSkill ?? false,
  }
  currentProfileState.data.skills = [newSkill, ...currentProfileState.data.skills]
  return [...currentProfileState.data.skills]
}

export async function updateSkillApi(
  id: string | number,
  payload: SkillFormData,
): Promise<ProfileSkill[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  currentProfileState.data.skills = currentProfileState.data.skills.map((item) =>
    item.id === id
      ? {
          ...item,
          name: payload.name,
          category: payload.category ?? item.category ?? '',
          isTopSkill: payload.isTopSkill ?? item.isTopSkill,
        }
      : item,
  )
  return [...currentProfileState.data.skills]
}

export async function deleteSkillApi(id: string | number): Promise<ProfileSkill[]> {
  if (useAuthStore.getState().isAuthenticated && typeof id === 'string' && id.includes('-')) {
    try {
      await apiClient.delete(`/users/me/skills/${id}`)
    } catch (err) {
      console.warn('[deleteSkillApi] Backend delete /users/me/skills failed:', err)
    }
  }

  currentProfileState.data.skills = currentProfileState.data.skills.filter((item) => item.id !== id)
  return [...currentProfileState.data.skills]
}
