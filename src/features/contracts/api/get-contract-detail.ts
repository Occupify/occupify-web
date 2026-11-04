import { apiClient } from '@/lib/api-client'
import type { SingleResponse } from '@/types'
import type { ContractDetailResponse } from '../types'

/**
 * Fetch contract detail with terms download url (GET /contracts/{id})
 */
export async function getContractDetail(id: string): Promise<ContractDetailResponse> {
  const res = await apiClient.get<SingleResponse<ContractDetailResponse>>(`/contracts/${id}`)
  return res.data
}

