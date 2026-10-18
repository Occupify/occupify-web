import { useQuery } from '@tanstack/react-query'
import { getCashflowChartMonths, getFinancialTransactions } from '../api'
import type { FinancialFilterState } from '../types'

export const financialKeys = {
  all: ['financial-history'] as const,
  transactions: (filter?: FinancialFilterState) =>
    [...financialKeys.all, 'transactions', filter] as const,
  cashflow: () => [...financialKeys.all, 'cashflow'] as const,
}

export function useFinancialHistory(filter?: FinancialFilterState) {
  const transactionsQuery = useQuery({
    queryKey: financialKeys.transactions(filter),
    queryFn: () => getFinancialTransactions(filter),
  })

  const cashflowQuery = useQuery({
    queryKey: financialKeys.cashflow(),
    queryFn: getCashflowChartMonths,
  })

  const transactions = transactionsQuery.data ?? []
  const cashflowMonths = cashflowQuery.data ?? []

  // Derived metrics
  const totalIn = transactions
    .filter((tx) => tx.type === 'in')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const totalOut = transactions
    .filter((tx) => tx.type === 'out')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const netBalance = totalIn - totalOut

  return {
    transactions,
    cashflowMonths,
    totalIn,
    totalOut,
    netBalance,
    isLoading: transactionsQuery.isLoading || cashflowQuery.isLoading,
    error: transactionsQuery.error || cashflowQuery.error,
  }
}
