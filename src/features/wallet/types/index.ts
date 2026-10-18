export type WalletTransactionType = 'deposit' | 'withdraw' | 'income'
export type WalletTransactionStatus = 'success' | 'pending' | 'failed'

export interface WalletTransaction {
  id: string
  type: WalletTransactionType
  title: string
  subtitle: string
  amount: number
  date: string
  time: string
  status: WalletTransactionStatus
  code: string
  bankInfo?: string
}

export type FinancialTransactionType = 'in' | 'out'

export interface FinancialTransaction {
  id: string
  contractCode: string
  contractName: string
  category: string
  type: FinancialTransactionType
  amount: number
  date: string
  timestamp: string
}

export interface CashflowMonthData {
  month: string
  inVal: number
  outVal: number
  formattedIn: string
  formattedOut: string
  net: string
}

export interface BankInfo {
  code: string
  shortName: string
  fullName: string
}

export interface SepayOrder {
  orderCode: string
  amount: number
  date: string
}

export interface DepositPayload {
  amount: number
}

export interface WithdrawPayload {
  bank: string
  accountNumber: string
  accountName: string
  amount: number
}

export interface FinancialFilterState {
  filterType: 'all' | 'in' | 'out'
  startDate: string
  endDate: string
}
