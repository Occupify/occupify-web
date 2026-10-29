import { apiClient } from '@/lib/api-client'
import { institutionsResponseEnvelopeSchema } from './schemas'
import type { EducationalInstitution } from '../types'
import type { SingleResponse } from '@/types'

/**
 * Searches institutions catalog by keyword or retrieves top verified institutions.
 * Endpoint: GET /users/institutions?keyword=...
 */
export async function getInstitutionsApi(keyword?: string): Promise<EducationalInstitution[]> {
  const raw = await apiClient.get<SingleResponse<EducationalInstitution[]>>(
    '/users/institutions',
    {
      params: keyword && keyword.trim() ? { keyword: keyword.trim() } : undefined,
      skipAuth: true,
    },
  )
  const parsed = institutionsResponseEnvelopeSchema.parse(raw)
  return parsed.data ?? []
}
