import test from 'node:test'
import assert from 'node:assert/strict'
import { getFinancialTransactions, getCashflowChartMonths } from './financial-api.ts'

test('getFinancialTransactions returns full transaction list without filter', async () => {
  const transactions = await getFinancialTransactions()
  assert.ok(Array.isArray(transactions), 'Transactions should be an array')
  assert.ok(transactions.length > 0, 'Transactions should not be empty')

  const first = transactions[0]
  assert.ok(first.id, 'Transaction must have an id')
  assert.ok(first.contractCode, 'Transaction must have contractCode')
  assert.ok(first.amount > 0, 'Transaction amount must be positive')
})

test('getFinancialTransactions correctly filters by transaction type', async () => {
  const inTransactions = await getFinancialTransactions({
    filterType: 'in',
    startDate: '',
    endDate: '',
  })
  assert.ok(inTransactions.length > 0, 'Should find in transactions')
  assert.ok(
    inTransactions.every((tx) => tx.type === 'in'),
    'All items should be type in',
  )

  const outTransactions = await getFinancialTransactions({
    filterType: 'out',
    startDate: '',
    endDate: '',
  })
  assert.ok(outTransactions.length > 0, 'Should find out transactions')
  assert.ok(
    outTransactions.every((tx) => tx.type === 'out'),
    'All items should be type out',
  )
})

test('getCashflowChartMonths returns valid 6-month cashflow data', async () => {
  const months = await getCashflowChartMonths()
  assert.ok(Array.isArray(months), 'Months should be an array')
  assert.equal(months.length, 6, 'Should have 6 months of data')

  for (const m of months) {
    assert.ok(m.month, 'Month label must exist')
    assert.ok(typeof m.inVal === 'number', 'inVal must be a number')
    assert.ok(typeof m.outVal === 'number', 'outVal must be a number')
    assert.ok(m.net, 'net surplus string must exist')
  }
})
