import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSavedJobs, getSavedJobIds, toggleSaveJob } from '../api'

export const savedJobsKeys = {
  all: ['saved-jobs'] as const,
  ids: ['saved-job-ids'] as const,
}

export function useSavedJobs() {
  const queryClient = useQueryClient()

  const jobsQuery = useQuery({
    queryKey: savedJobsKeys.all,
    queryFn: getSavedJobs,
  })

  const idsQuery = useQuery({
    queryKey: savedJobsKeys.ids,
    queryFn: getSavedJobIds,
  })

  const toggleMutation = useMutation({
    mutationFn: toggleSaveJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedJobsKeys.all })
      queryClient.invalidateQueries({ queryKey: savedJobsKeys.ids })
    },
  })

  return {
    savedJobs: jobsQuery.data ?? [],
    savedJobIds: idsQuery.data ?? [],
    isLoading: jobsQuery.isLoading || idsQuery.isLoading,
    error: jobsQuery.error,
    toggleSaveJob: toggleMutation.mutateAsync,
    isToggling: toggleMutation.isPending,
  }
}
