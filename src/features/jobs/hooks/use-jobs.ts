import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getJobs, getJobById } from '../api/get-jobs'
import { createJob, type CreateJobPayload } from '../api/create-job'
import { closeJob, deleteJob, updateJob, type UpdateJobPayload } from '../api/manage-job'
import type { GetJobsParams } from '../types'

export const JOB_QUERY_KEYS = {
  all: ['jobs'] as const,
  list: (params?: GetJobsParams) => ['jobs', 'list', params] as const,
  detail: (id?: string | number | null) => ['jobs', 'detail', id] as const,
  filters: ['jobs', 'filters'] as const,
}

export function useJobs(params?: GetJobsParams) {
  return useQuery({
    queryKey: JOB_QUERY_KEYS.list(params),
    queryFn: () => getJobs(params),
    staleTime: 1000 * 60 * 2,
  })
}

export function useJob(id?: string | number | null) {
  return useQuery({
    queryKey: JOB_QUERY_KEYS.detail(id),
    queryFn: () => (id ? getJobById(id) : null),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateJobPayload) => createJob(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useCloseJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jobId: string) => closeJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (jobId: string) => deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ jobId, payload }: { jobId: string; payload: UpdateJobPayload }) =>
      updateJob(jobId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
