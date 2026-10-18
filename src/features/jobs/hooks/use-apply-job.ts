import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applyToJob } from '../api/apply-job'
import type { ApplyJobInput, ApplyJobResponse } from '../types'
import { JOB_QUERY_KEYS } from './use-jobs'

export function useApplyJob() {
  const queryClient = useQueryClient()

  return useMutation<ApplyJobResponse, Error, ApplyJobInput>({
    mutationFn: (input) => applyToJob(input),
    onSuccess: (_data, variables) => {
      // Invalidate relevant job query
      queryClient.invalidateQueries({ queryKey: JOB_QUERY_KEYS.detail(variables.jobId) })
    },
  })
}
