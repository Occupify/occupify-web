import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addExperienceApi, updateExperienceApi, deleteExperienceApi } from '../api'
import type { ExperienceFormData } from '../types'
import { PROFILE_QUERY_KEYS } from './use-profile'

export function useAddExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (exp: ExperienceFormData) => addExperienceApi(exp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}

export function useUpdateExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: ExperienceFormData }) =>
      updateExperienceApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}

export function useDeleteExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteExperienceApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}
