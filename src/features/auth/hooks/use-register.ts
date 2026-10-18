import { useMutation } from '@tanstack/react-query'
import { registerApi } from '../api/register'
import type { SignUpCredentials, AuthUser } from '../types'

export function useRegister() {
  return useMutation<AuthUser, Error, SignUpCredentials>({
    mutationFn: (credentials) => registerApi(credentials),
  })
}
