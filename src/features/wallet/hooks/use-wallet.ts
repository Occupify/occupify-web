import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  depositToWallet,
  getWalletBalance,
  getWalletTransactions,
  withdrawFromWallet,
} from '../api'
import type { DepositPayload, WithdrawPayload } from '../types'

export const walletKeys = {
  all: ['wallet'] as const,
  balance: () => [...walletKeys.all, 'balance'] as const,
  transactions: () => [...walletKeys.all, 'transactions'] as const,
}

export function useWallet() {
  const queryClient = useQueryClient()

  const balanceQuery = useQuery({
    queryKey: walletKeys.balance(),
    queryFn: getWalletBalance,
  })

  const transactionsQuery = useQuery({
    queryKey: walletKeys.transactions(),
    queryFn: getWalletTransactions,
  })

  const depositMutation = useMutation({
    mutationFn: ({ payload, orderCode }: { payload: DepositPayload; orderCode?: string }) =>
      depositToWallet(payload, orderCode),
    onSuccess: (data) => {
      queryClient.setQueryData(walletKeys.balance(), data.newBalance)
      queryClient.invalidateQueries({ queryKey: walletKeys.transactions() })
    },
  })

  const withdrawMutation = useMutation({
    mutationFn: (payload: WithdrawPayload) => withdrawFromWallet(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(walletKeys.balance(), data.newBalance)
      queryClient.invalidateQueries({ queryKey: walletKeys.transactions() })
    },
  })

  return {
    balance: balanceQuery.data ?? 0,
    transactions: transactionsQuery.data ?? [],
    isLoading: balanceQuery.isLoading || transactionsQuery.isLoading,
    error: balanceQuery.error || transactionsQuery.error,
    deposit: depositMutation.mutateAsync,
    isDepositing: depositMutation.isPending,
    withdraw: withdrawMutation.mutateAsync,
    isWithdrawing: withdrawMutation.isPending,
  }
}
