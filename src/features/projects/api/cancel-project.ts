import { apiClient } from '@/lib/api-client'
import type { SingleResponse } from '@/types'
import type { ProjectDetail } from '../types'
import { getInternalStores, setInternalStores } from './get-projects'

export async function closeProject(
  projectId: string | number,
): Promise<ProjectDetail> {
  const res = await apiClient.patch<SingleResponse<ProjectDetail>>(
    `/projects/${projectId}/close`,
  )
  return res.data
}

export async function cancelMyProject(
  projectId: number | string,
  _reason?: string,
): Promise<{ success: boolean; projectId: number | string }> {
  try {
    await closeProject(projectId)
  } catch {
    // Fallback to local store
  }
  const { myProjects } = getInternalStores()
  const updated = myProjects.filter((p) => String(p.id) !== String(projectId))
  setInternalStores({ myProjects: updated })
  return { success: true, projectId }
}

export async function cancelEmployeeProject(
  projectId: number | string,
  _reason?: string,
): Promise<{ success: boolean; projectId: number | string }> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  const { employeeProjects } = getInternalStores()
  const updated = employeeProjects.filter((p) => String(p.id) !== String(projectId))
  setInternalStores({ employeeProjects: updated })
  return { success: true, projectId }
}
