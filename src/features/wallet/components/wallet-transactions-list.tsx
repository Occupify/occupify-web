import { useState } from 'react'
import { ArrowDownLeftIcon, ArrowUpRightIcon } from '@phosphor-icons/react'
import type { WalletTransaction } from '../types'
import { formatVND } from '@/utils'

export interface WalletTransactionsListProps {
  transactions: WalletTransaction[]
}

export function WalletTransactionsList({ transactions }: WalletTransactionsListProps) {
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdraw'>('all')

  const filteredList = transactions.filter((t) => {
    if (filterType === 'all') return true
    return t.type === filterType
  })

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Section Header & Filters */}
      <div
        style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(0,0,0,0.90)' }}>
            Lịch sử nạp và rút tiền
          </h2>
          <p style={{ fontSize: 12.5, color: 'rgba(0,0,0,0.55)', marginTop: 2 }}>
            Ghi nhận chi tiết các lần nạp tiền vào ví và rút tiền về tài khoản ngân hàng
          </p>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'all', label: `Tất cả (${transactions.length})` },
            {
              id: 'deposit',
              label: `Nạp tiền (${transactions.filter((t) => t.type === 'deposit').length})`,
            },
            {
              id: 'withdraw',
              label: `Rút tiền (${transactions.filter((t) => t.type === 'withdraw').length})`,
            },
          ].map((tab) => {
            const isActive = filterType === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id as 'all' | 'deposit' | 'withdraw')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 9999,
                  border: isActive ? '1px solid #0A66C2' : '1px solid rgba(0,0,0,0.12)',
                  background: isActive ? '#EAF1FA' : 'transparent',
                  color: isActive ? '#0A66C2' : 'rgba(0,0,0,0.70)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 120ms ease',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filteredList.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: 'rgba(0,0,0,0.45)',
              fontSize: 14,
            }}
          >
            Không có giao dịch nào trong danh mục này.
          </div>
        ) : (
          filteredList.map((tx, idx) => {
            const isDeposit = tx.type === 'deposit'

            return (
              <div
                key={tx.id}
                style={{
                  padding: '16px 24px',
                  borderBottom:
                    idx === filteredList.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  transition: 'background 150ms ease',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = '#FAFAF9')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = 'transparent')
                }
              >
                {/* Left Icon + Text */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: isDeposit ? '#E5F6E8' : '#FBE2E2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: isDeposit ? '#057642' : '#C03A2B',
                    }}
                  >
                    {isDeposit ? (
                      <ArrowDownLeftIcon size={20} weight="bold" />
                    ) : (
                      <ArrowUpRightIcon size={20} weight="bold" />
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'rgba(0,0,0,0.90)',
                        marginBottom: 2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {tx.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'rgba(0,0,0,0.55)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span>{tx.subtitle}</span>
                      <span>•</span>
                      <span>
                        {tx.time} {tx.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Amount + Status */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: tx.amount > 0 ? '#137333' : '#C03A2B',
                      letterSpacing: '-0.01em',
                      marginBottom: 4,
                    }}
                  >
                    {tx.amount > 0 ? `+${formatVND(tx.amount)}` : `-${formatVND(tx.amount)}`}
                  </div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      background: '#E5F6E8',
                      color: '#057642',
                    }}
                  >
                    Thành công
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
