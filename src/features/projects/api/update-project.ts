import { apiClient } from '../../../lib/api-client.ts'
import type { SingleResponse } from '../../../types/api.ts'
import type { ProjectDetail, UpdateProjectPayload } from '../types/index.ts'
import { fromBackendPeriod } from '../types/index.ts'
import { getInternalStores, setInternalStores } from './get-projects.ts'

export async function updateProject(
  id: string | number,
  payload: UpdateProjectPayload,
): Promise<ProjectDetail> {
  const { myProjects } = getInternalStores()

  if (String(id).startsWith('local-')) {
    const updatedLocalProjects = myProjects.map((p) => {
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
    setInternalStores({ myProjects: updatedLocalProjects })
    const found = updatedLocalProjects.find((p) => String(p.id) === String(id))
    return found as unknown as ProjectDetail
  }

  // Map bidCloseDate to backend startDate (LocalDateTime)
  const apiPayload: UpdateProjectPayload = {
    ...payload,
    startDate: payload.bidCloseDate ? `${payload.bidCloseDate}T00:00:00` : payload.startDate,
  }
  delete apiPayload.bidCloseDate

  const res = await apiClient.put<SingleResponse<ProjectDetail>>(`/projects/${id}`, apiPayload)

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

  return res.data
}
