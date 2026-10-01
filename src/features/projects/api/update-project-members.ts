import type { ProjectMember } from '../types'
import { getInternalStores, setInternalStores } from './get-projects'

export async function updateMyProjectMembers(
  projectId: number,
  members: ProjectMember[],
): Promise<{ projectId: number; members: ProjectMember[] }> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  const { myProjects } = getInternalStores()
  const updated = myProjects.map((p) => (p.id === projectId ? { ...p, members } : p))
  setInternalStores({ myProjects: updated })
  return { projectId, members }
}
