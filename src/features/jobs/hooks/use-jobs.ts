import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJobs } from '../api/get-jobs'
import { createJob, type CreateJobInput } from '../api/create-job'
import type { GetJobsParams } from '../types'

export const JOB_QUERY_KEYS = {
  all: ['jobs'] as const,
  list: (params?: GetJobsParams) => ['jobs', 'list', params] as const,
  filters: ['jobs', 'filters'] as const,
}

export function useJobs(params?: GetJobsParams) {
  return useQuery({
    queryKey: JOB_QUERY_KEYS.list(params),
    queryFn: () => getJobs(params),
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateJobInput) => createJob(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEYS.all })
    },
  })
}
