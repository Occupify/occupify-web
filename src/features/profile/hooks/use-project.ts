import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addProjectApi, updateProjectApi, deleteProjectApi } from '../api'
import type { ProjectFormData } from '../types'
import { PROFILE_QUERY_KEYS } from './use-profile'

export function useAddProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ProjectFormData) => addProjectApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProjectFormData }) =>
      updateProjectApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProjectApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}
