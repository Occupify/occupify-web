import { apiClient } from '@/lib/api-client'
import type { SuccessResponse } from '@/types'
import type { ForgotPasswordPayload } from '../types'
import { successResponseEnvelopeSchema } from './schemas'

/**
 * Initiates password reset flow in occupify-identity.
 * Publishes PasswordResetRequestedEvent to RabbitMQ -> occupify-noti sends OTP email.
 * Endpoint: POST /auth/forgot-password
 */
export async function forgotPasswordApi(payload: ForgotPasswordPayload): Promise<SuccessResponse> {
  const raw = await apiClient.post<SuccessResponse>('/auth/forgot-password', {
    email: payload.email.trim(),
  })

  return successResponseEnvelopeSchema.parse(raw)
}
