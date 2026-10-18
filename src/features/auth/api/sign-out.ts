import { apiClient } from '@/lib/api-client'
import type { SuccessResponse } from '@/types'
import { successResponseEnvelopeSchema } from './schemas'

/**
 * Logs out the user and invalidates active session tokens in Redis.
 * Endpoint: POST /auth/sign-out
 */
export async function signOutApi(refreshToken?: string): Promise<SuccessResponse> {
  const token = refreshToken || ''

  const raw = await apiClient.post<SuccessResponse>(
    '/auth/sign-out',
    { refreshToken: token },
    {
      headers: token ? { 'X-Refresh-Token': token } : undefined,
    },
  )
  return successResponseEnvelopeSchema.parse(raw)
}
