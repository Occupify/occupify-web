import { apiClient } from '@/lib/api-client'
import type { PageResponse, SingleResponse } from '@/types'
import { adminReportSingleResponseSchema } from './admin-schemas'

export type BackendReportTargetType = 'USER' | 'PROJECT'
export type BackendReportStatus = 'PENDING' | 'RESOLVED' | 'DISMISSED'
export type BackendReportReasonCategory =
  'FRAUD' | 'OUTSIDE_PAYMENT' | 'FAKE_INFORMATION' | 'SPAM' | 'HARASSMENT' | 'OTHER'

export interface AdminReportBackendResponse {
  id: string
  reporterId: string
  reporterEmail: string
  targetType: BackendReportTargetType
  targetUserId?: string | null
  targetProjectId?: string | null
  reasonCategory: BackendReportReasonCategory
  description: string
  status: BackendReportStatus
  createdAt: string
  updatedAt: string
}

export interface AdminReportDetailBackendResponse {
  id: string
  reporterId: string
  reporterEmail: string
  targetType: BackendReportTargetType
  targetUserId?: string | null
  targetProjectId?: string | null
  reasonCategory: BackendReportReasonCategory
  description: string
  status: BackendReportStatus
  createdAt: string
  updatedAt: string
  evidenceUrls?: string[]
}

export interface AdminReportFilterParams {
  status?: BackendReportStatus
  targetType?: BackendReportTargetType
  reasonCategory?: BackendReportReasonCategory
  page?: number
  size?: number
  sort?: string
}

export interface UpdateReportStatusPayload {
  status: BackendReportStatus
  note?: string
}

/**
 * Fetch paginated reports from backend (GET /admin/reports)
 */
export async function getAdminReports(
  params?: AdminReportFilterParams,
): Promise<PageResponse<AdminReportBackendResponse>> {
  return await apiClient.get<PageResponse<AdminReportBackendResponse>>('/admin/reports', {
    params: params as Record<string, string | number | boolean | undefined | null>,
  })
}

/**
 * Fetch report detail with evidence URLs (GET /admin/reports/{id})
 */
export async function getAdminReportDetail(
  id: string,
): Promise<SingleResponse<AdminReportDetailBackendResponse>> {
  return await apiClient.get<SingleResponse<AdminReportDetailBackendResponse>>(
    `/admin/reports/${id}`,
  )
}

/**
 * Update report status (PUT /admin/reports/{id}/status)
 */
export async function updateAdminReportStatus(
  id: string,
  payload: UpdateReportStatusPayload,
): Promise<SingleResponse<AdminReportBackendResponse>> {
  const raw = await apiClient.put<SingleResponse<AdminReportBackendResponse>>(
    `/admin/reports/${id}/status`,
    payload,
  )
  return adminReportSingleResponseSchema.parse(raw)
}
