import { apiClient } from '@/lib/api-client'
import type { PageResponse, SingleResponse, SuccessResponse } from '@/types'
import {
  accountModerationRequestSchema,
  adminUserSingleResponseSchema,
  normalizeModerationReason,
  successResponseSchema,
} from './admin-schemas'

export interface AdminUserBackendResponse {
  id: string
  email: string
  fullName: string
  avatarUrl?: string | null
  role: 'FREELANCER' | 'CLIENT' | 'ADMIN' | 'USER' | string
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'DELETED' | string
  statusReason?: string | null
  createdAt: string
  deletedAt?: string | null
  isFlagged: boolean
  totalCompletedContracts?: number
  disputeCount?: number
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
  statusReason?: string | null
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

export interface AccountModerationPayload {
  reason?: string | null
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

/**
 * Soft delete a user account (DELETE /admin/users/{id})
 */
export async function deleteAdminUser(
  id: string,
  reason?: string | null,
): Promise<SuccessResponse> {
  const payload = accountModerationRequestSchema.parse({
    reason: normalizeModerationReason(reason),
  })
  const raw = await apiClient.delete<SuccessResponse>(`/admin/users/${id}`, {
    data: payload,
  })
  return successResponseSchema.parse(raw)
}

/**
 * Lock an active user account (PATCH /admin/users/{id}/lock)
 */
export async function lockAdminUser(
  id: string,
  reason?: string | null,
): Promise<SingleResponse<AdminUserBackendResponse>> {
  const payload = accountModerationRequestSchema.parse({
    reason: normalizeModerationReason(reason),
  })
  const raw = await apiClient.patch<SingleResponse<AdminUserBackendResponse>>(
    `/admin/users/${id}/lock`,
    payload,
  )
  return adminUserSingleResponseSchema.parse(raw)
}

/**
 * Unlock a locked (BANNED) user account back to ACTIVE (PATCH /admin/users/{id}/unlock)
 */
export async function unlockAdminUser(
  id: string,
): Promise<SingleResponse<AdminUserBackendResponse>> {
  const raw = await apiClient.patch<SingleResponse<AdminUserBackendResponse>>(
    `/admin/users/${id}/unlock`,
  )
  return adminUserSingleResponseSchema.parse(raw)
}
