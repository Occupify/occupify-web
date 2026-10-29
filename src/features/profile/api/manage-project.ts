import type { ProfileProject, ProjectFormData } from '../types'

/**
 * Candidate Portfolio Projects CRUD APIs
 */
export async function addProjectApi(proj: ProjectFormData): Promise<ProfileProject> {
  return {
    ...proj,
    id: Date.now(),
  }
}

export async function updateProjectApi(id: number, proj: ProjectFormData): Promise<ProfileProject> {
  return {
    ...proj,
    id,
  }
}

export async function deleteProjectApi(_id: number): Promise<void> {
  // Candidate portfolio projects
}
