import type { CreatedResponse } from '../../../types/index.ts'
import type { BidResponse } from '../../bids/types/index.ts'
import type { ApplyJobInput, ApplyJobResponse } from '../types/index.ts'

/**
 * Builds the FormData payload matching backend CreateBidRequest (multipart/form-data)
 */
export function buildBidFormData(input: ApplyJobInput): FormData {
  const formData = new FormData()

  // Target job role ID (UUID)
  formData.append('jobId', String(input.roleId))

  // Proposed rate: parse numeric value
  const cleanRate =
    typeof input.proposedRate === 'number' && input.proposedRate > 0
      ? input.proposedRate
      : Number(String(input.bidPrice || '').replace(/\D/g, '')) || 0
  formData.append('proposedRate', cleanRate.toString())

  // Proposed salary type: enum SalaryType { FIXED, HOURLY, WEEKLY, MONTHLY }
  const salaryType =
    input.salaryCycle === 'hourly'
      ? 'HOURLY'
      : input.salaryCycle === 'weekly'
        ? 'WEEKLY'
        : input.salaryCycle === 'fixed'
          ? 'FIXED'
          : 'MONTHLY'
  formData.append('proposedSalaryType', salaryType)

  // Message: required by backend (@NotBlank, max 5000 chars)
  const message = (
    input.message ||
    input.commitment ||
    'Ứng tuyển vào vị trí công việc qua Occupify'
  ).trim()
  formData.append('message', message)

  // Commitment duration: max 100 chars
  const commitment = input.commitment || input.fixedDeliveryDays
  if (commitment) {
    formData.append('commitmentDuration', commitment.trim().slice(0, 100))
  }

  // Weekly commitment hours: max 50 chars
  if (input.salaryCycle === 'hourly' && input.weeklyHours) {
    formData.append('weeklyCommitmentHours', input.weeklyHours.trim().slice(0, 50))
  }

  // Portfolio link: max 255 chars
  if (input.portfolioLink && input.portfolioLink.trim()) {
    formData.append('portfolioLink', input.portfolioLink.trim().slice(0, 255))
  }

  // CV File upload: MultipartFile
  if (typeof File !== 'undefined' && input.cvFile instanceof File) {
    formData.append('attachmentCvUrl', input.cvFile, input.cvFile.name)
  }

  return formData
}

/**
 * Maps CreatedResponse<BidResponse> to ApplyJobResponse
 */
export function toApplyJobResponse(
  response: CreatedResponse<BidResponse>,
  roleId: string,
): ApplyJobResponse {
  return {
    success: true,
    message: response.message || 'Nộp hồ sơ ứng tuyển thành công',
    applicationId: response.data?.id || `app-${Date.now()}`,
    roleId,
    submittedAt: response.data?.createdAt || new Date().toISOString(),
  }
}
