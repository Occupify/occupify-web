import { apiClient } from '@/lib/api-client'
import type { SuccessResponse } from '@/types'
import type { ResetPasswordPayload } from '../types'
import { successResponseEnvelopeSchema } from './schemas'

/**
 * Resets user password using resetToken obtained from /auth/verify-otp.
 * Inactivates all other sessions.
 * Endpoint: POST /auth/reset-password
 */
export async function resetPasswordApi(payload: ResetPasswordPayload): Promise<SuccessResponse> {
  const raw = await apiClient.post<SuccessResponse>(
    '/auth/reset-password',
    {
      resetToken: payload.resetToken.trim(),
      newPassword: payload.newPassword,
      confirmPassword: payload.confirmPassword,
    },
    {
      headers: {
        'X-Reset-Token': payload.resetToken.trim(),
      },
    },
  )

  return successResponseEnvelopeSchema.parse(raw)
}
