import { useMutation } from '@tanstack/react-query'
import { registerApi } from '../api/register'
import type { SignUpCredentials } from '../types'
import type { CreatedResponse } from '@/types'

export function useRegister() {
  return useMutation<CreatedResponse<void>, Error, SignUpCredentials>({
    mutationFn: (credentials) => registerApi(credentials),
  })
}
