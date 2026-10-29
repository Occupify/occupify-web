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
    mutationFn: ({
      id,
      index,
      data,
    }: {
      id?: string | number
      index?: number
      data: EducationFormData
    }) => updateEducationApi(id ?? index ?? '', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}

export function useDeleteEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (idOrIndex: string | number) => deleteEducationApi(idOrIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}
