import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getContracts,
  getContractDetail,
  createContract,
  updateContract,
  acceptContract,
  rejectContract,
  cancelContract,
  completeContract,
} from '../api'
import type {
  ContractFilterParams,
  CreateContractPayload,
  UpdateContractPayload,
  CompleteContractPayload,
} from '../types'

export const contractKeys = {
  all: ['contracts'] as const,
  lists: () => [...contractKeys.all, 'list'] as const,
  list: (filter?: ContractFilterParams) => [...contractKeys.lists(), filter] as const,
  details: () => [...contractKeys.all, 'detail'] as const,
  detail: (id: string) => [...contractKeys.details(), id] as const,
}

export function useContracts(params?: ContractFilterParams) {
  return useQuery({
    queryKey: contractKeys.list(params),
    queryFn: () => getContracts(params),
  })
}

export function useContractDetail(id?: string) {
  return useQuery({
    queryKey: contractKeys.detail(id ?? ''),
    queryFn: () => (id ? getContractDetail(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  })
}

export function useCreateContract() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateContractPayload) => createContract(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateContract() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ contractId, payload }: { contractId: string; payload: UpdateContractPayload }) =>
      updateContract(contractId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useAcceptContract() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (contractId: string) => acceptContract(contractId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useRejectContract() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (contractId: string) => rejectContract(contractId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useCancelContract() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ contractId, reason }: { contractId: string; reason?: string }) =>
      cancelContract(contractId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useCompleteContract() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      contractId,
      payload,
    }: {
      contractId: string
      payload: CompleteContractPayload
    }) => completeContract(contractId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
