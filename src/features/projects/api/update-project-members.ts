import type { ProjectMember } from '../types'
import { getInternalStores, setInternalStores } from './get-projects'

export async function updateMyProjectMembers(
  projectId: number | string,
  members: ProjectMember[],
): Promise<{ projectId: number | string; members: ProjectMember[] }> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  const { myProjects } = getInternalStores()
  const updated = myProjects.map((p) =>
    String(p.id) === String(projectId) ? { ...p, members } : p,
  )
  setInternalStores({ myProjects: updated })
  return { projectId, members }
}
