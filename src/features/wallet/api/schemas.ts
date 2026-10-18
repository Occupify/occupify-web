import { z } from 'zod'

export const WalletTransactionSchema = z.object({
  id: z.string(),
  type: z.enum(['deposit', 'withdraw', 'income']),
  title: z.string(),
  subtitle: z.string(),
  amount: z.number(),
  date: z.string(),
  time: z.string(),
  status: z.enum(['success', 'pending', 'failed']),
  code: z.string(),
  bankInfo: z.string().optional(),
})

export const WalletTransactionsResponseSchema = z.array(WalletTransactionSchema)

export const FinancialTransactionSchema = z.object({
  id: z.string(),
  contractCode: z.string(),
  contractName: z.string(),
  category: z.string(),
  type: z.enum(['in', 'out']),
  amount: z.number(),
  date: z.string(),
  timestamp: z.string(),
})

export const FinancialTransactionsResponseSchema = z.array(FinancialTransactionSchema)

export const CashflowMonthDataSchema = z.object({
  month: z.string(),
  inVal: z.number(),
  outVal: z.number(),
  formattedIn: z.string(),
  formattedOut: z.string(),
  net: z.string(),
})

export const CashflowMonthsResponseSchema = z.array(CashflowMonthDataSchema)
