import type { ProfileSkill, SkillFormData } from '../types'
import { apiClient } from '@/lib/api-client'
import type { SingleResponse } from '@/types'

/**
 * Skill CRUD APIs (POST/PUT/DELETE /users/me/skills)
 */
export async function addSkillApi(payload: SkillFormData): Promise<ProfileSkill> {
  const res = await apiClient.post<SingleResponse<{ skillId?: string }>>('/users/me/skills', {
    skillName: payload.name,
    category: payload.category || 'General',
    isTopSkill: Boolean(payload.isTopSkill),
  })

  return {
    id: res?.data?.skillId ?? Date.now(),
    name: payload.name,
    category: payload.category ?? '',
    isTopSkill: payload.isTopSkill ?? false,
  }
}

export async function updateSkillApi(
  id: string | number,
  payload: SkillFormData,
): Promise<ProfileSkill> {
  await apiClient.put(`/users/me/skills/${id}`, {
    skillName: payload.name,
    category: payload.category,
    isTopSkill: payload.isTopSkill,
  })

  return {
    id,
    name: payload.name,
    category: payload.category ?? '',
    isTopSkill: payload.isTopSkill ?? false,
  }
}

export async function deleteSkillApi(id: string | number): Promise<void> {
  await apiClient.delete(`/users/me/skills/${id}`)
}
