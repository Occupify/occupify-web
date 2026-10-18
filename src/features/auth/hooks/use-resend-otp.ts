import { useMutation } from '@tanstack/react-query'
import { resendOtpApi } from '../api/resend-otp'
import type { SendOtpPayload } from '../types'
import type { SuccessResponse } from '@/types'

export function useResendOtp() {
  return useMutation<SuccessResponse, Error, SendOtpPayload>({
    mutationFn: (payload) => resendOtpApi(payload),
  })
}
