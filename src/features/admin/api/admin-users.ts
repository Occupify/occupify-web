import { apiClient } from '@/lib/api-client'
import type { PageResponse, SingleResponse } from '@/types'

export interface AdminUserBackendResponse {
  id: string
  email: string
  fullName: string
  avatarUrl?: string | null
  role: 'FREELANCER' | 'CLIENT' | 'ADMIN' | string
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | string
  createdAt: string
  deletedAt?: string | null
  isFlagged: boolean
}

export interface AdminUserContractSummaryResponse {
  id: string
  title: string
  status: string
  agreedRate?: number | null
  salaryType?: string | null
  startedAt?: string | null
  finishedAt?: string | null
}

export interface AdminUserDetailBackendResponse {
  id: string
  email: string
  fullName: string
  avatarUrl?: string | null
  role: string
  status: string
  createdAt: string
  deletedAt?: string | null
  isFlagged: boolean
  flagReason?: string | null
  totalCompletedContracts: number
  totalContracts: number
  disputeCount: number
  recentContracts: AdminUserContractSummaryResponse[]
}

export interface AdminUserFilterParams {
  keyword?: string
  status?: string
  role?: string
  page?: number
  size?: number
  sort?: string
}

/**
 * Fetch paginated users from backend (GET /admin/users)
 */
export async function getAdminUsers(
  params?: AdminUserFilterParams,
): Promise<PageResponse<AdminUserBackendResponse>> {
  return await apiClient.get<PageResponse<AdminUserBackendResponse>>('/admin/users', {
    params: params as Record<string, string | number | boolean | undefined | null>,
  })
}

/**
 * Fetch user detail with contract history and flags (GET /admin/users/{id})
 */
export async function getAdminUserDetail(
  id: string,
): Promise<SingleResponse<AdminUserDetailBackendResponse>> {
  return await apiClient.get<SingleResponse<AdminUserDetailBackendResponse>>(`/admin/users/${id}`)
}
