import { apiClient } from '../../../lib/api-client.ts'
import type { PageResponse, SingleResponse } from '../../../types/api.ts'
import type {
  MyProject,
  PendingProject,
  ProjectDetail,
  ProjectFilterParams,
  ProjectJob,
  ProjectSummary,
} from '../types/index.ts'
import { toMyProject } from '../types/index.ts'
import { getContracts } from '../../contracts/api/get-contracts.ts'
import {
  toMyProjectFromContract,
  toPendingProjectFromContract,
  type ContractSummaryResponse,
} from '../../contracts/types/index.ts'

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

function isContractForEmployee(
  contract: ContractSummaryResponse,
  currentUserId?: string,
  userEmail?: string,
): boolean {
  if (!currentUserId && !userEmail) return true

  const matchesUserId =
    Boolean(currentUserId) &&
    Boolean(contract.employeeId) &&
    String(contract.employeeId) === String(currentUserId)
  const matchesEmail =
    Boolean(userEmail) &&
    Boolean(contract.freelancerEmail) &&
    contract.freelancerEmail!.toLowerCase() === userEmail!.toLowerCase()

  return matchesUserId || matchesEmail
}

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
  try {
    // /projects/{id}/jobs filters out soft-deleted jobs (findByProjectIdAndDeletedAtIsNull)
    const jobsRes = await apiClient.get<PageResponse<ProjectJob>>(`/projects/${id}/jobs?size=100`)
    if (jobsRes?.data && Array.isArray(jobsRes.data)) {
      detail.jobs = jobsRes.data
    }
  } catch {
    // Fallback to detail.jobs
  }
  return toMyProject(detail)
}

/**
 * Get current user's projects with backend integration
 */
export async function getMyProjects(employerId?: string): Promise<MyProject[]> {
  if (!employerId) {
    return []
  }

  const res = await getProjects({
    employerId,
    size: 50,
    sort: 'createdAt,desc',
  })
  if (res?.data && Array.isArray(res.data)) {
    const backendProjects = res.data.map(toMyProject)
    setInternalStores({ myProjects: backendProjects })
    return backendProjects
  }
  return []
}

/**
 * Get active contracts where the user participates as employee / contractor
 */
export async function getEmployeeProjects(
  currentUserId?: string,
  userEmail?: string,
): Promise<MyProject[]> {
  const res = await getContracts({ size: 50, sort: 'createdAt,desc' })
  if (res?.data && Array.isArray(res.data)) {
    const activeContracts = res.data.filter((c) => {
      const isParticipantStatus =
        c.status === 'IN_PROGRESS' || c.status === 'COMPLETED' || c.status === 'PENDING_ESCROW'
      if (!isParticipantStatus) return false
      return isContractForEmployee(c, currentUserId, userEmail)
    })
    const mapped = activeContracts.map((c) => toMyProjectFromContract(c, currentUserId))
    setInternalStores({ employeeProjects: mapped })
    return mapped
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
  const res = await getContracts({ status: 'PENDING', size: 50, sort: 'createdAt,desc' })
  if (res?.data && Array.isArray(res.data)) {
    const pendingContracts = res.data.filter(
      (c) => c.status === 'PENDING' && isContractForEmployee(c, currentUserId, userEmail),
    )
    const mapped = pendingContracts.map(toPendingProjectFromContract)
    setInternalStores({ pending: mapped })
    return mapped
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
