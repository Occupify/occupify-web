import { useQuery } from '@tanstack/react-query'
import { getJobFilters } from '../api/get-job-filters'
import { JOB_QUERY_KEYS } from './use-jobs'

export function useJobFilters() {
  return useQuery({
    queryKey: JOB_QUERY_KEYS.filters,
    queryFn: getJobFilters,
    staleTime: 1000 * 60 * 60, // Cache 1 giờ vì metadata cấu hình bộ lọc ít khi thay đổi
  })
}
