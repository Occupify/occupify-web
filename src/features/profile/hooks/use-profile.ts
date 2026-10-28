import { useQuery } from '@tanstack/react-query'
import { getProfileApi } from '../api'

export const PROFILE_QUERY_KEYS = {
  all: ['profile'] as const,
  profile: ['profile', 'me'] as const,
  account: ['profile', 'account'] as const,
}

export const ACCOUNT_QUERY_KEYS = PROFILE_QUERY_KEYS

/**
 * Hook to retrieve full 360-degree profile (or partner profile).
 * Endpoint: GET /users/me/detail
 */
export function useProfile(userName?: string) {
  return useQuery({
    queryKey: ['profile', userName || 'me'],
    queryFn: () => getProfileApi(userName),
  })
}
