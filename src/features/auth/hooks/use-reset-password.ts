import { useMutation } from '@tanstack/react-query'
import { resetPasswordApi } from '../api/reset-password'
import type { ResetPasswordPayload } from '../types'
import type { SuccessResponse } from '@/types'

export function useResetPassword() {
  return useMutation<SuccessResponse, Error, ResetPasswordPayload>({
    mutationFn: (payload) => resetPasswordApi(payload),
  })
}
