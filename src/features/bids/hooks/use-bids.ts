import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { PageResponse } from '@/types'
import { getBids, getMyBids, getBidDetail, cancelBid } from '../api'
import type { BidFilterParams, BidResponse } from '../types'

export const bidKeys = {
  all: ['bids'] as const,
  lists: () => [...bidKeys.all, 'list'] as const,
  list: (filter?: BidFilterParams) => [...bidKeys.lists(), filter] as const,
  my: (filter?: BidFilterParams) => [...bidKeys.all, 'my', filter] as const,
  detail: (id: string) => [...bidKeys.all, 'detail', id] as const,
}

const EMPTY_PAGE_RESPONSE: PageResponse<BidResponse> = {
  statusCode: 200,
  message: '',
  data: [],
  paging: { page: 0, limit: 100, total: 0, totalPages: 0 },
}

export function useBids(params?: BidFilterParams) {
  return useQuery({
    queryKey: bidKeys.list(params),
    queryFn: () => getBids(params),
  })
}

export function useProjectBids(projectId?: string) {
  return useQuery({
    queryKey: bidKeys.list({ projectId }),
    queryFn: () =>
      projectId ? getBids({ projectId, limit: 100 }) : Promise.resolve(EMPTY_PAGE_RESPONSE),
    enabled: Boolean(projectId),
  })
}

export function useMyBids(params?: BidFilterParams) {
  return useQuery({
    queryKey: bidKeys.my(params),
    queryFn: () => getMyBids(params),
  })
}

export function useBidDetail(id?: string) {
  return useQuery({
    queryKey: bidKeys.detail(id ?? ''),
    queryFn: () => (id ? getBidDetail(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  })
}

export function useCancelBid() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bidId: string) => cancelBid(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bidKeys.all })
    },
  })
}
