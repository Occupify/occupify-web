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
  MY_PROJECTS_DATA,
  EMPLOYEE_PROJECTS_DATA,
  PENDING_PROJECTS_DATA,
} from '../../mock-data'

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

let myProjectsStore: MyProject[] = [...loadPersistedCustomProjects(), ...MY_PROJECTS_DATA]
let employeeProjectsStore: MyProject[] = [...EMPLOYEE_PROJECTS_DATA]
let pendingProjectsStore: PendingProject[] = [...PENDING_PROJECTS_DATA]

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
 * Fetch project by ID with fallback to local mock store
 */
export async function getProjectById(id: string | number): Promise<MyProject | null> {
  try {
    const detail = await getProjectDetail(String(id))
    return toMyProject(detail)
  } catch {
    const local =
      myProjectsStore.find((p) => String(p.id) === String(id)) ||
      employeeProjectsStore.find((p) => String(p.id) === String(id))
    return local || null
  }
}

/**
 * Get current user's projects with backend integration & local store fallback
 */
export async function getMyProjects(employerId?: string): Promise<MyProject[]> {
  try {
    const res = await getProjects({
      employerId,
      limit: 50,
      sort: 'createdAt,desc',
    })
    if (res?.data && Array.isArray(res.data)) {
      const backendProjects = res.data.map(toMyProject)
      // Keep any local custom projects that were created locally in this browser
      const existingNames = new Set(backendProjects.map((p) => p.name.trim().toLowerCase()))
      const localCustom = myProjectsStore.filter(
        (p) => String(p.id).startsWith('local-') && !existingNames.has(p.name.trim().toLowerCase()),
      )
      return [...localCustom, ...backendProjects]
    }
  } catch {
    // Fallback to local memory store when backend is unavailable
  }
  return [...myProjectsStore]
}

export async function getEmployeeProjects(): Promise<MyProject[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  return [...employeeProjectsStore]
}

export async function getPendingProjects(): Promise<PendingProject[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  return [...pendingProjectsStore]
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
