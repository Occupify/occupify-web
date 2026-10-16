import { useMutation } from '@tanstack/react-query'
import { forgotPasswordApi } from '../api/forgot-password'
import type { ForgotPasswordPayload } from '../types'
import type { SuccessResponse } from '@/types'

export function useForgotPassword() {
  return useMutation<SuccessResponse, Error, ForgotPasswordPayload>({
    mutationFn: (payload) => forgotPasswordApi(payload),
  })
}
