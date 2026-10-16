import { apiClient } from '@/lib/api-client'
import type { SuccessResponse } from '@/types'
import type { SendOtpPayload } from '../types'
import { successResponseEnvelopeSchema } from './schemas'

/**
 * Resends a new 6-digit verification OTP to the user's email subject to cooldown restrictions.
 * Endpoint: POST /auth/resend-otp
 */
export async function resendOtpApi(payload: SendOtpPayload): Promise<SuccessResponse> {
  const raw = await apiClient.post<SuccessResponse>('/auth/resend-otp', {
    email: payload.email.trim(),
    type: payload.type,
  })

  return successResponseEnvelopeSchema.parse(raw)
}
