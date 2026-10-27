import { apiClient } from '@/lib/api-client'
import type { SingleResponse } from '@/types'
import type { AuthResponseData } from '../types'
import { authResponseEnvelopeSchema } from './schemas'

/**
 * Obtains a new accessToken + refreshToken pair using the active refreshToken.
 * Endpoint: POST /auth/refresh-token
 */
export async function refreshTokenApi(refreshToken: string): Promise<AuthResponseData> {
  const raw = await apiClient.post<SingleResponse<AuthResponseData>>(
    '/auth/refresh-token',
    { refreshToken },
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        'X-Refresh-Token': refreshToken,
      },
      skipAuth: true,
    },
  )

  const validated = authResponseEnvelopeSchema.parse(raw)
  return validated.data
}
