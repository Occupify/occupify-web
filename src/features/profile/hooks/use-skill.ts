import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addSkillApi, updateSkillApi, deleteSkillApi } from '../api'
import type { SkillFormData } from '../types'
import { PROFILE_QUERY_KEYS } from './use-profile'

export function useAddSkill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SkillFormData) => addSkillApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}

export function useUpdateSkill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: SkillFormData }) =>
      updateSkillApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}

export function useDeleteSkill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteSkillApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}
