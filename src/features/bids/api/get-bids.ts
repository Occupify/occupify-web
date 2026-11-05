import { apiClient } from '@/lib/api-client'
import type { PageResponse, SingleResponse, SuccessResponse } from '@/types'
import type { BidFilterParams, BidResponse } from '../types'

/**
 * Fetch paginated bids from backend API (GET /bids)
 * Filter by projectId, jobId, or status
 */
export async function getBids(params?: BidFilterParams): Promise<PageResponse<BidResponse>> {
  return await apiClient.get<PageResponse<BidResponse>>('/bids', {
    params: params as Record<string, string | number | boolean | undefined | null>,
  })
}

/**
 * Fetch current employee's submitted bids (GET /bids/my)
 */
export async function getMyBids(params?: BidFilterParams): Promise<PageResponse<BidResponse>> {
  return await apiClient.get<PageResponse<BidResponse>>('/bids/my', {
    params: params as Record<string, string | number | boolean | undefined | null>,
  })
}

/**
 * Fetch specific bid detail (GET /bids/{id})
 */
export async function getBidDetail(id: string): Promise<BidResponse> {
  const res = await apiClient.get<SingleResponse<BidResponse>>(`/bids/${id}`)
  return res.data
}

/**
 * Cancel/Withdraw bid (DELETE /bids/{id})
 */
export async function cancelBid(id: string): Promise<SuccessResponse> {
  return await apiClient.delete<SuccessResponse>(`/bids/${id}`)
}
