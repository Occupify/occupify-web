import { apiClient } from '@/lib/api-client'
import type { PageResponse, SingleResponse } from '@/types'

export interface AdminProjectEmployerResponse {
  id: string
  email: string
  fullName: string
  avatarUrl?: string | null
}

export interface AdminProjectBackendResponse {
  id: string
  title: string
  description?: string | null
  status: 'OPEN' | 'CLOSED' | string
  employer: AdminProjectEmployerResponse
  createdAt: string
  closedAt?: string | null
  reportCount: number
}

export interface AdminProjectReportItemResponse {
  id: string
  reporterId?: string
  reporterName?: string
  reporterEmail?: string
  reasonCategory: string
  description: string
  status: string
  createdAt: string
}

export interface AdminProjectDetailBackendResponse {
  id: string
  title: string
  description?: string | null
  status: string
  employer: AdminProjectEmployerResponse
  createdAt: string
  closedAt?: string | null
  reportCount: number
  reports: AdminProjectReportItemResponse[]
}

export interface AdminProjectFilterParams {
  keyword?: string
  status?: string
  employerId?: string
  page?: number
  size?: number
  sort?: string
}

/**
 * Fetch paginated projects from backend (GET /admin/projects)
 */
export async function getAdminProjects(
  params?: AdminProjectFilterParams,
): Promise<PageResponse<AdminProjectBackendResponse>> {
  return await apiClient.get<PageResponse<AdminProjectBackendResponse>>('/admin/projects', {
    params: params as Record<string, string | number | boolean | undefined | null>,
  })
}

/**
 * Fetch project detail with associated reports (GET /admin/projects/{id})
 */
export async function getAdminProjectDetail(
  id: string,
): Promise<SingleResponse<AdminProjectDetailBackendResponse>> {
  return await apiClient.get<SingleResponse<AdminProjectDetailBackendResponse>>(
    `/admin/projects/${id}`,
  )
}
