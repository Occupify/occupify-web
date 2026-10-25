import { apiClient } from '@/lib/api-client'
import type { SingleResponse } from '@/types'
import type { ProjectDetail, UpdateProjectPayload } from '../types'
import { fromBackendPeriod } from '../types'
import { getInternalStores, setInternalStores } from './get-projects'

export async function updateProject(
  id: string | number,
  payload: UpdateProjectPayload,
): Promise<ProjectDetail> {
  const { myProjects } = getInternalStores()

  // Update local project in store
  const updatedMyProjects = myProjects.map((p) => {
    if (String(p.id) === String(id)) {
      return {
        ...p,
        name: payload.title ?? p.name,
        description: payload.description !== undefined ? payload.description : p.description,
        dueDate: payload.dueDate !== undefined ? payload.dueDate : p.dueDate,
        bidCloseDate: payload.bidCloseDate !== undefined ? payload.bidCloseDate : p.bidCloseDate,
        startPrice: payload.startPrice !== undefined ? payload.startPrice : p.startPrice,
        period: payload.period ? fromBackendPeriod(payload.period) : p.period,
      }
    }
    return p
  })
  setInternalStores({ myProjects: updatedMyProjects })

  if (String(id).startsWith('local-')) {
    const found = updatedMyProjects.find((p) => String(p.id) === String(id))
    return found as unknown as ProjectDetail
  }

  // Strip frontend-only fields before sending to backend PUT /projects/{id}
  const { bidCloseDate: _bidClose, ...apiPayload } = payload

  try {
    const res = await apiClient.put<SingleResponse<ProjectDetail>>(`/projects/${id}`, apiPayload)
    return res.data
  } catch (err) {
    const found = updatedMyProjects.find((p) => String(p.id) === String(id))
    if (found) return found as unknown as ProjectDetail
    throw err
  }
}
