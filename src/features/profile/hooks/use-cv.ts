import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadCvApi } from '../api'
import { PROFILE_QUERY_KEYS } from './use-profile'

export function useUploadCv() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadCvApi(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}
