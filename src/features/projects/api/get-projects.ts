import { apiClient } from '../../../lib/api-client'
import type { PageResponse, SingleResponse } from '../../../types'
import type {
  MyProject,
  PendingProject,
  ProjectDetail,
  ProjectFilterParams,
  ProjectSummary,
} from '../types'
import { toMyProject } from '../types'
import {
  getContracts,
  toMyProjectFromContract,
  toPendingProjectFromContract,
} from '@/features/contracts'

const CUSTOM_PROJECTS_KEY = 'occupify_custom_projects'

function loadPersistedCustomProjects(): MyProject[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CUSTOM_PROJECTS_KEY)
    return raw ? (JSON.parse(raw) as MyProject[]) : []
  } catch {
    return []
  }
}

function savePersistedCustomProjects(projects: MyProject[]) {
  if (typeof window === 'undefined') return
  try {
    const custom = projects.filter((p) => String(p.id).startsWith('local-'))
    localStorage.setItem(CUSTOM_PROJECTS_KEY, JSON.stringify(custom))
  } catch {
    // Ignore storage quota
  }
}

let myProjectsStore: MyProject[] = [...loadPersistedCustomProjects()]
let employeeProjectsStore: MyProject[] = []
let pendingProjectsStore: PendingProject[] = []

/**
 * Fetch paginated projects from backend API (/projects)
 */
export async function getProjects(
  params?: ProjectFilterParams,
): Promise<PageResponse<ProjectSummary>> {
  return await apiClient.get<PageResponse<ProjectSummary>>('/projects', {
    params: params as Record<string, string | number | boolean | undefined | null>,
  })
}

/**
 * Fetch project detail from backend API (/projects/{id})
 */
export async function getProjectDetail(id: string): Promise<ProjectDetail> {
  const res = await apiClient.get<SingleResponse<ProjectDetail>>(`/projects/${id}`)
  return res.data
}

/**
 * Fetch project by ID from backend API
 */
export async function getProjectById(id: string | number): Promise<MyProject | null> {
  const detail = await getProjectDetail(String(id))
  return toMyProject(detail)
}

/**
 * Get current user's projects with backend integration
 */
export async function getMyProjects(employerId?: string): Promise<MyProject[]> {
  const res = await getProjects({
    employerId,
    limit: 50,
    sort: 'createdAt,desc',
  })
  if (res?.data && Array.isArray(res.data)) {
    const backendProjects = res.data.map(toMyProject)
    setInternalStores({ myProjects: backendProjects })
    return backendProjects
  }
  return myProjectsStore
}

/**
 * Get active contracts where the user participates as employee / contractor
 */
export async function getEmployeeProjects(currentUserId?: string): Promise<MyProject[]> {
  try {
    const res = await getContracts({ limit: 50, sort: 'createdAt,desc' })
    if (res?.data && Array.isArray(res.data)) {
      const activeContracts = res.data.filter(
        (c) => c.status === 'IN_PROGRESS' || c.status === 'COMPLETED',
      )
      const mapped = activeContracts.map((c) => toMyProjectFromContract(c, currentUserId))
      setInternalStores({ employeeProjects: mapped })
      return mapped
    }
  } catch {
    // Return empty on network error or unauthorized
  }
  return []
}

/**
 * Get pending contract invitations for current user
 */
export async function getPendingProjects(
  currentUserId?: string,
  userEmail?: string,
): Promise<PendingProject[]> {
  try {
    const res = await getContracts({ status: 'PENDING', limit: 50, sort: 'createdAt,desc' })
    if (res?.data && Array.isArray(res.data)) {
      const pendingContracts = res.data.filter((c) => {
        if (c.status !== 'PENDING') return false
        if (currentUserId && c.employeeId && String(c.employeeId) === String(currentUserId)) {
          return true
        }
        if (
          userEmail &&
          c.freelancerEmail &&
          c.freelancerEmail.toLowerCase() === userEmail.toLowerCase()
        ) {
          return true
        }
        return !currentUserId && !userEmail
      })
      const mapped = pendingContracts.map(toPendingProjectFromContract)
      setInternalStores({ pending: mapped })
      return mapped
    }
  } catch {
    // Return empty on network error or unauthorized
  }
  return []
}

export function setInternalStores(data: {
  myProjects?: MyProject[]
  employeeProjects?: MyProject[]
  pending?: PendingProject[]
}) {
  if (data.myProjects) {
    myProjectsStore = data.myProjects
    savePersistedCustomProjects(myProjectsStore)
  }
  if (data.employeeProjects) employeeProjectsStore = data.employeeProjects
  if (data.pending) pendingProjectsStore = data.pending
}

export function getInternalStores() {
  return {
    myProjects: myProjectsStore,
    employeeProjects: employeeProjectsStore,
    pending: pendingProjectsStore,
  }
}
