import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addCertificateApi, updateCertificateApi, deleteCertificateApi } from '../api'
import type { CertificateFormData } from '../types'
import { PROFILE_QUERY_KEYS } from './use-profile'

export function useAddCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cert: CertificateFormData) => addCertificateApi(cert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: CertificateFormData }) =>
      updateCertificateApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteCertificateApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}
