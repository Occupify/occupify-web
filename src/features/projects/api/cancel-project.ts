import { apiClient } from '../../../lib/api-client.ts'
import type { SingleResponse } from '../../../types/api.ts'
import type { ProjectDetail } from '../types/index.ts'
import { getInternalStores, setInternalStores } from './get-projects.ts'
import { cancelContract as apiCancelContract } from '../../contracts/api/manage-contract.ts'

export async function closeProject(projectId: string | number): Promise<ProjectDetail> {
  const res = await apiClient.patch<SingleResponse<ProjectDetail>>(`/projects/${projectId}/close`)
  return res.data
}

export async function cancelMyProject(
  projectId: number | string,
  _reason?: string,
): Promise<{ success: boolean; projectId: number | string }> {
  if (!String(projectId).startsWith('local-')) {
    await closeProject(projectId)
  }
  const { myProjects } = getInternalStores()
  const updated = myProjects.filter((p) => String(p.id) !== String(projectId))
  setInternalStores({ myProjects: updated })
  return { success: true, projectId }
}

export async function cancelEmployeeProject(
  projectId: number | string,
  reason?: string,
): Promise<{ success: boolean; projectId: number | string }> {
  if (
    !String(projectId).startsWith('local-') &&
    (typeof projectId === 'string' || Number.isNaN(Number(projectId)))
  ) {
    await apiCancelContract(String(projectId), reason)
  }
  const { employeeProjects } = getInternalStores()
  const updated = employeeProjects.filter((p) => String(p.id) !== String(projectId))
  setInternalStores({ employeeProjects: updated })
  return { success: true, projectId }
}
