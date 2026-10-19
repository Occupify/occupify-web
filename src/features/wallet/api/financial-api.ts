import type { CashflowMonthData, FinancialFilterState, FinancialTransaction } from '../types'
import { MOCK_CASHFLOW_CHART_MONTHS, MOCK_FINANCIAL_TRANSACTIONS } from './mock-data.ts'
import { CashflowMonthsResponseSchema, FinancialTransactionsResponseSchema } from './schemas.ts'

export async function getFinancialTransactions(
  filter?: FinancialFilterState,
): Promise<FinancialTransaction[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  let list = [...MOCK_FINANCIAL_TRANSACTIONS]

  if (filter) {
    if (filter.filterType !== 'all') {
      list = list.filter((item) => item.type === filter.filterType)
    }
    if (filter.startDate) {
      list = list.filter((item) => item.date >= filter.startDate)
    }
    if (filter.endDate) {
      list = list.filter((item) => item.date <= filter.endDate)
    }
  }

  return FinancialTransactionsResponseSchema.parse(list)
}

export async function getCashflowChartMonths(): Promise<CashflowMonthData[]> {
  await new Promise((resolve) => setTimeout(resolve, 60))
  return CashflowMonthsResponseSchema.parse(MOCK_CASHFLOW_CHART_MONTHS)
}
