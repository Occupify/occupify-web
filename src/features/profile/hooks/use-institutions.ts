import { useQuery } from '@tanstack/react-query'
import { getInstitutionsApi } from '../api'

export function useInstitutions(keyword?: string) {
  return useQuery({
    queryKey: ['institutions', keyword || ''],
    queryFn: () => getInstitutionsApi(keyword),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
