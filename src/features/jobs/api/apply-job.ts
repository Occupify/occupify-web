import { apiClient } from '@/lib/api-client'
import type { CreatedResponse } from '@/types'
import type { BidResponse } from '@/features/bids/types'
import type { ApplyJobInput, ApplyJobResponse } from '../types'
import { buildBidFormData, toApplyJobResponse } from './apply-job-mapping'

export { buildBidFormData, toApplyJobResponse } from './apply-job-mapping'

/**
 * Submits an application/proposal for a specific job role (POST /bids)
 * Consumes multipart/form-data matching CreateBidRequest in backend.
 */
export async function applyToJob(input: ApplyJobInput): Promise<ApplyJobResponse> {
  const formData = buildBidFormData(input)
  const response = await apiClient.post<CreatedResponse<BidResponse>>('/bids', formData)
  return toApplyJobResponse(response, input.roleId)
}
