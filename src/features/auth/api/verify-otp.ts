import { apiClient } from '@/lib/api-client'
import type { SingleResponse } from '@/types'
import type { VerifyOtpPayload, VerifyOtpSuccessData } from '../types'
import { verifyOtpEnvelopeSchema } from './schemas'

/**
 * Verifies submitted OTP code against Redis store in occupify-identity.
 * - If REGISTER: Activates user account and returns active AuthTokens + UserResponse.
 * - If FORGOT_PASSWORD: Generates and returns temporary password resetToken.
 * Endpoint: POST /auth/verify-otp
 */
export async function verifyOtpApi(
  payloadOrEmail: VerifyOtpPayload | string,
  maybeCode?: string,
  maybeType: 'REGISTER' | 'FORGOT_PASSWORD' = 'REGISTER',
): Promise<VerifyOtpSuccessData> {
  const payload: VerifyOtpPayload =
    typeof payloadOrEmail === 'string'
      ? {
          email: payloadOrEmail,
          otpCode: maybeCode || '',
          type: maybeType,
        }
      : payloadOrEmail

  const raw = await apiClient.post<SingleResponse<VerifyOtpSuccessData>>('/auth/verify-otp', {
    email: payload.email.trim(),
    otpCode: payload.otpCode.trim(),
    type: payload.type,
  })

  const validated = verifyOtpEnvelopeSchema.parse(raw)
  return validated.data as VerifyOtpSuccessData
}
