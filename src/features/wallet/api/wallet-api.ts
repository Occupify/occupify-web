import type { DepositPayload, WalletTransaction, WithdrawPayload } from '../types'
import { MOCK_INITIAL_BALANCE, MOCK_WALLET_TRANSACTIONS } from './mock-data'
import { WalletTransactionSchema, WalletTransactionsResponseSchema } from './schemas'

// In-memory dumb data store simulating backend persistence
let currentBalance = MOCK_INITIAL_BALANCE
let walletTransactionsStore: WalletTransaction[] = [...MOCK_WALLET_TRANSACTIONS]

export async function getWalletBalance(): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return currentBalance
}

export async function getWalletTransactions(): Promise<WalletTransaction[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  return WalletTransactionsResponseSchema.parse(walletTransactionsStore)
}

export async function depositToWallet(
  payload: DepositPayload,
  orderCode?: string,
): Promise<{ newBalance: number; transaction: WalletTransaction }> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const code = orderCode ?? Math.floor(10000 + Math.random() * 90000).toString()
  const now = new Date()
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

  currentBalance += payload.amount

  const newTx: WalletTransaction = {
    id: `tx-dep-${Date.now()}`,
    type: 'deposit',
    title: 'Nạp tiền vào ví',
    subtitle: `Chuyển khoản VietQR tự động 24/7 (Đơn hàng OPF-${code})`,
    amount: payload.amount,
    date: dateStr,
    time: timeStr,
    status: 'success',
    code: `SEPAY-${code}`,
  }

  const validatedTx = WalletTransactionSchema.parse(newTx)
  walletTransactionsStore = [validatedTx, ...walletTransactionsStore]

  return {
    newBalance: currentBalance,
    transaction: validatedTx,
  }
}

export async function withdrawFromWallet(
  payload: WithdrawPayload,
): Promise<{ newBalance: number; transaction: WalletTransaction }> {
  await new Promise((resolve) => setTimeout(resolve, 120))
  if (payload.amount > currentBalance) {
    throw new Error('Số tiền rút vượt quá số dư khả dụng')
  }

  const now = new Date()
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`

  currentBalance -= payload.amount

  const newTx: WalletTransaction = {
    id: `tx-wd-${Date.now()}`,
    type: 'withdraw',
    title: `Rút tiền về ${payload.bank}`,
    subtitle: `STK: ${payload.accountNumber} • ${payload.accountName}`,
    amount: -payload.amount,
    date: dateStr,
    time: timeStr,
    status: 'success',
    code: `WD-${Math.floor(100000 + Math.random() * 900000)}`,
    bankInfo: `${payload.bank} - ${payload.accountNumber}`,
  }

  const validatedTx = WalletTransactionSchema.parse(newTx)
  walletTransactionsStore = [validatedTx, ...walletTransactionsStore]

  return {
    newBalance: currentBalance,
    transaction: validatedTx,
  }
}
