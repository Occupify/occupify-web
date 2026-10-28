import type { ProfileEducation, EducationFormData } from '../types'
import { currentProfileState } from './profile-state'

/**
 * Education CRUD APIs (POST/PUT/DELETE /users/me/educations)
 */
export async function addEducationApi(edu: EducationFormData): Promise<ProfileEducation[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  currentProfileState.data.education = [edu, ...currentProfileState.data.education]
  return [...currentProfileState.data.education]
}

export async function updateEducationApi(
  index: number,
  edu: EducationFormData,
): Promise<ProfileEducation[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  currentProfileState.data.education = currentProfileState.data.education.map((item, idx) =>
    idx === index ? edu : item,
  )
  return [...currentProfileState.data.education]
}

export async function deleteEducationApi(index: number): Promise<ProfileEducation[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  currentProfileState.data.education = currentProfileState.data.education.filter(
    (_, idx) => idx !== index,
  )
  return [...currentProfileState.data.education]
}
