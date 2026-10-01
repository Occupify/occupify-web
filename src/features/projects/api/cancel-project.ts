import { getInternalStores, setInternalStores } from './get-projects'

export async function cancelMyProject(
  projectId: number,
  _reason?: string,
): Promise<{ success: boolean; projectId: number }> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  const { myProjects } = getInternalStores()
  const updated = myProjects.filter((p) => p.id !== projectId)
  setInternalStores({ myProjects: updated })
  return { success: true, projectId }
}

export async function cancelEmployeeProject(
  projectId: number,
  _reason?: string,
): Promise<{ success: boolean; projectId: number }> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  const { employeeProjects } = getInternalStores()
  const updated = employeeProjects.filter((p) => p.id !== projectId)
  setInternalStores({ employeeProjects: updated })
  return { success: true, projectId }
}
