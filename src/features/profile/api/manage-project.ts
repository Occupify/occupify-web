import type { ProfileProject, ProjectFormData } from '../types'
import { currentProfileState } from './profile-state'

/**
 * Candidate Portfolio Projects CRUD APIs
 */
export async function addProjectApi(proj: ProjectFormData): Promise<ProfileProject[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const newProj: ProfileProject = {
    ...proj,
    id: Date.now(),
  }
  currentProfileState.data.projects = [newProj, ...currentProfileState.data.projects]
  return [...currentProfileState.data.projects]
}

export async function updateProjectApi(
  id: number,
  proj: ProjectFormData,
): Promise<ProfileProject[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  currentProfileState.data.projects = currentProfileState.data.projects.map((item) =>
    item.id === id ? { ...item, ...proj } : item,
  )
  return [...currentProfileState.data.projects]
}

export async function deleteProjectApi(id: number): Promise<ProfileProject[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  currentProfileState.data.projects = currentProfileState.data.projects.filter(
    (item) => item.id !== id,
  )
  return [...currentProfileState.data.projects]
}
