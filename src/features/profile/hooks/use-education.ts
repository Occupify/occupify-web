import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addEducationApi, updateEducationApi, deleteEducationApi } from '../api'
import type { EducationFormData } from '../types'
import { PROFILE_QUERY_KEYS } from './use-profile'

export function useAddEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (edu: EducationFormData) => addEducationApi(edu),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}

export function useUpdateEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ index, data }: { index: number; data: EducationFormData }) =>
      updateEducationApi(index, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}

export function useDeleteEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (index: number) => deleteEducationApi(index),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}
