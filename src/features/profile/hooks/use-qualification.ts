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
    mutationFn: ({ index, data }: { index: number; data: CertificateFormData }) =>
      updateCertificateApi(index, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (index: number) => deleteCertificateApi(index),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
    },
  })
}
