import { apiClient } from '@/lib/api-client'
import type { CreatedResponse } from '@/types'
import type { CreateContractPayload, ContractDetailResponse } from '../types'

/**
 * Creates a contract with optional terms document (POST /contracts)
 * Multipart/form-data: part 'data' (JSON), part 'file' (optional binary)
 */
export async function createContract(
  payload: CreateContractPayload,
): Promise<ContractDetailResponse> {
  const formData = new FormData()

  const jsonData = JSON.stringify({
    jobId: payload.jobId,
    freelancerGmail: payload.freelancerEmail,
    message: payload.message || undefined,
  })

  // Spring Boot @RequestPart("data") expects application/json
  formData.append('data', new Blob([jsonData], { type: 'application/json' }))

  if (payload.file) {
    formData.append('file', payload.file)
  }

  const res = await apiClient.post<CreatedResponse<ContractDetailResponse>>('/contracts', formData)
  if (!res.data) {
    throw new Error(res.message || 'Failed to create contract')
  }
  return res.data
}
