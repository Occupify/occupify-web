import { apiClient } from '@/lib/api-client'
import type { SingleResponse, SuccessResponse } from '@/types'
import type {
  CompleteContractPayload,
  ContractDetailResponse,
  UpdateContractPayload,
} from '../types'

/**
 * Freelancer/Employee accepts pending contract (POST /contracts/{id}/accept)
 */
export async function acceptContract(contractId: string): Promise<ContractDetailResponse> {
  const res = await apiClient.post<SingleResponse<ContractDetailResponse>>(
    `/contracts/${contractId}/accept`,
  )
  return res.data
}

/**
 * Freelancer/Employee rejects pending contract (POST /contracts/{id}/reject)
 */
export async function rejectContract(contractId: string): Promise<ContractDetailResponse> {
  const res = await apiClient.post<SingleResponse<ContractDetailResponse>>(
    `/contracts/${contractId}/reject`,
  )
  return res.data
}

/**
 * Updates contract details & optional terms file (PUT /contracts/{id})
 */
export async function updateContract(
  contractId: string,
  payload: UpdateContractPayload,
): Promise<ContractDetailResponse> {
  const formData = new FormData()
  const requestData = {
    jobId: payload.jobId,
    message: payload.message,
    freelancer_gmail: payload.freelancerEmail,
  }
  formData.append('data', new Blob([JSON.stringify(requestData)], { type: 'application/json' }))
  if (payload.file) {
    formData.append('file', payload.file)
  }
  const res = await apiClient.put<SingleResponse<ContractDetailResponse>>(
    `/contracts/${contractId}`,
    formData,
  )
  return res.data
}

/**
 * Employer or Employee cancels a contract (POST /contracts/{id}/cancel)
 */
export async function cancelContract(
  contractId: string,
  _reason?: string,
): Promise<ContractDetailResponse> {
  const res = await apiClient.post<SingleResponse<ContractDetailResponse>>(
    `/contracts/${contractId}/cancel`,
  )
  return res.data
}

/**
 * Recruiter completes in-progress contract with rating and review (POST /contracts/{id}/complete)
 */
export async function completeContract(
  contractId: string,
  payload: CompleteContractPayload,
): Promise<ContractDetailResponse> {
  const res = await apiClient.post<SingleResponse<ContractDetailResponse>>(
    `/contracts/${contractId}/complete`,
    payload,
  )
  return res.data
}

/**
 * Deletes contract (DELETE /contracts/{id})
 */
export async function deleteContract(contractId: string): Promise<SuccessResponse> {
  return await apiClient.delete<SuccessResponse>(`/contracts/${contractId}`)
}
