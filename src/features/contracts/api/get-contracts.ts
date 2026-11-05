import { apiClient } from '@/lib/api-client'
import type { PageResponse } from '@/types'
import type { ContractFilterParams, ContractSummaryResponse } from '../types'

/**
 * Fetch paginated contracts from backend API (GET /contracts)
 * Filters by status, projectId, etc.
 */
export async function getContracts(
  params?: ContractFilterParams,
): Promise<PageResponse<ContractSummaryResponse>> {
  return await apiClient.get<PageResponse<ContractSummaryResponse>>('/contracts', {
    params: params as Record<string, string | number | boolean | undefined | null>,
  })
}
